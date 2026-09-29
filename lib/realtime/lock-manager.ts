import { ObjectLockState } from './types';

export class ConcurrencyLockManager {
  private locks: Map<string, ObjectLockState> = new Map();
  private readonly defaultTtlMs: number = 6000;

  /**
   * Attempts to acquire lock on an equipment item.
   * Returns true if lock acquired or renewed by current user, false if held by someone else.
   */
  public acquireLock(
    objectId: string,
    participantId: string,
    participantName: string,
    ttlMs: number = this.defaultTtlMs
  ): boolean {
    const now = Date.now();
    const existingLock = this.locks.get(objectId);

    // If lock exists and has not expired
    if (existingLock && existingLock.expiresAt > now) {
      if (existingLock.lockedBy === participantId) {
        // Renew lease
        existingLock.expiresAt = now + ttlMs;
        return true;
      }
      // Held by another participant
      return false;
    }

    // Unlocked or expired: grant lock
    this.locks.set(objectId, {
      objectId,
      lockedBy: participantId,
      lockedByName: participantName,
      lockedAt: now,
      expiresAt: now + ttlMs
    });
    return true;
  }

  /**
   * Releases lock if held by participant.
   */
  public releaseLock(objectId: string, participantId: string): boolean {
    const existing = this.locks.get(objectId);
    if (!existing) return true;
    if (existing.lockedBy === participantId) {
      this.locks.delete(objectId);
      return true;
    }
    return false;
  }

  /**
   * Checks if an object is currently locked by someone other than participantId.
   */
  public isLockedByOther(objectId: string, participantId: string): { isLocked: boolean; holderName?: string } {
    const now = Date.now();
    const existing = this.locks.get(objectId);
    if (existing && existing.expiresAt > now) {
      if (existing.lockedBy !== participantId) {
        return { isLocked: true, holderName: existing.lockedByName };
      }
    }
    return { isLocked: false };
  }

  public clearAll() {
    this.locks.clear();
  }
}

export const lockManager = new ConcurrencyLockManager();
