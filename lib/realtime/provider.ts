import { RealtimeEventType, RealtimeEventPayload, LabParticipant, ChatMessage } from './types';

type EventListener = (payload: RealtimeEventPayload) => void;
type PresenceListener = (participants: LabParticipant[]) => void;

export class CollaborativeLabSession {
  private roomId: string;
  private currentParticipant: LabParticipant;
  private broadcastChannel: BroadcastChannel | null = null;
  private eventListeners: Set<EventListener> = new Set();
  private presenceListeners: Set<PresenceListener> = new Set();
  private activeParticipants: Map<string, LabParticipant> = new Map();
  private heartbeatTimer: any = null;

  constructor(roomId: string, participantName: string) {
    this.roomId = roomId;
    const participantId = typeof window !== 'undefined' && window.sessionStorage
      ? window.sessionStorage.getItem('magelabs_participant_id') || `user_${Math.random().toString(36).substring(2, 8)}`
      : `user_${Math.random().toString(36).substring(2, 8)}`;

    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('magelabs_participant_id', participantId);
    }

    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];
    const assignedColor = colors[Math.floor(Math.random() * colors.length)];

    this.currentParticipant = {
      id: participantId,
      name: participantName || `Student ${participantId.slice(-3)}`,
      color: assignedColor,
      joinedAt: Date.now(),
      lastActive: Date.now()
    };

    this.activeParticipants.set(participantId, this.currentParticipant);
  }

  public init() {
    if (typeof window === 'undefined') return;

    // Use BroadcastChannel for zero-config multi-tab / local network sync
    try {
      this.broadcastChannel = new BroadcastChannel(`magelabs_room_${this.roomId}`);
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data as RealtimeEventPayload;
        if (!data || data.senderId === this.currentParticipant.id) return;

        // If it's a presence announcement
        if (data.type === 'CHAT_MESSAGE' && data.payload?.isPresence) {
          this.handlePresencePing(data.payload.participant);
          return;
        }

        // Notify event subscribers
        this.eventListeners.forEach(listener => listener(data));
      };

      // Announce presence immediately
      this.announcePresence();

      // Setup periodic presence heartbeat every 3 seconds
      this.heartbeatTimer = setInterval(() => {
        this.announcePresence();
        this.pruneStaleParticipants();
      }, 3000);

    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment:", e);
    }
  }

  public getParticipant(): LabParticipant {
    return this.currentParticipant;
  }

  public getParticipants(): LabParticipant[] {
    return Array.from(this.activeParticipants.values());
  }

  public broadcastEvent<T>(type: RealtimeEventType, payload: T) {
    const eventData: RealtimeEventPayload<T> = {
      type,
      roomId: this.roomId,
      senderId: this.currentParticipant.id,
      senderName: this.currentParticipant.name,
      timestamp: Date.now(),
      payload
    };

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(eventData);
      } catch (err) {
        console.warn("Failed to post realtime message:", err);
      }
    }
  }

  public sendChatMessage(text: string) {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: this.currentParticipant.id,
      senderName: this.currentParticipant.name,
      text,
      timestamp: Date.now()
    };

    this.broadcastEvent('CHAT_MESSAGE', message);
    return message;
  }

  public onEvent(listener: EventListener) {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  public onPresence(listener: PresenceListener) {
    this.presenceListeners.add(listener);
    listener(this.getParticipants());
    return () => this.presenceListeners.delete(listener);
  }

  private announcePresence() {
    this.currentParticipant.lastActive = Date.now();
    this.activeParticipants.set(this.currentParticipant.id, this.currentParticipant);

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'CHAT_MESSAGE',
        roomId: this.roomId,
        senderId: this.currentParticipant.id,
        senderName: this.currentParticipant.name,
        timestamp: Date.now(),
        payload: {
          isPresence: true,
          participant: this.currentParticipant
        }
      });
    }

    this.notifyPresence();
  }

  private handlePresencePing(p: LabParticipant) {
    if (!p || !p.id) return;
    this.activeParticipants.set(p.id, { ...p, lastActive: Date.now() });
    this.notifyPresence();
  }

  private pruneStaleParticipants() {
    const now = Date.now();
    let changed = false;
    for (const [id, p] of Array.from(this.activeParticipants.entries())) {
      if (id !== this.currentParticipant.id && now - p.lastActive > 9000) {
        this.activeParticipants.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.notifyPresence();
    }
  }

  private notifyPresence() {
    const list = this.getParticipants();
    this.presenceListeners.forEach(listener => listener(list));
  }

  public destroy() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.eventListeners.clear();
    this.presenceListeners.clear();
  }
}
