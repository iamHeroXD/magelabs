export type RealtimeEventType = 
  | 'SWITCH_TOGGLED'
  | 'VOLTAGE_CHANGED'
  | 'RESISTANCE_CHANGED'
  | 'WIRE_CONNECTED'
  | 'WIRE_DISCONNECTED'
  | 'OBJECT_LOCKED'
  | 'OBJECT_RELEASED'
  | 'EXPERIMENT_RESET'
  | 'CHAT_MESSAGE';

export interface LabParticipant {
  id: string;
  name: string;
  color: string;
  joinedAt: number;
  lastActive: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface RealtimeEventPayload<T = any> {
  type: RealtimeEventType;
  roomId: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  payload: T;
}

export interface ObjectLockState {
  objectId: string;
  lockedBy: string; // participant ID
  lockedByName: string;
  lockedAt: number;
  expiresAt: number;
}
