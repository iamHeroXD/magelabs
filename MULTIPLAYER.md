# MageLabs Multiplayer & Realtime Architecture

## 1. Synchronization Philosophy

MageLabs synchronizes **meaningful domain events** rather than high-frequency raw render frames:

| Event Type | Payload | Effect |
| :--- | :--- | :--- |
| `SWITCH_TOGGLED` | `{ isOpen: boolean }` | Toggles knife switch kinematic blade |
| `VOLTAGE_CHANGED` | `{ voltage: number }` | Updates power supply rotary dial & LED |
| `RESISTANCE_CHANGED` | `{ resistance: number }` | Repaints 4-band rings & updates solver |
| `WIRE_CONNECTED` | `{ wire: WireConnection }` | Renders Catmull-Rom spline on peer screens |
| `WIRE_DISCONNECTED` | `{ wireId: string }` | Removes cable from bench |
| `EXPERIMENT_RESET` | `{}` | Clears all bench modifications |
| `CHAT_MESSAGE` | `{ text, senderName, timestamp }` | Dispatches message to peer chat |

## 2. Concurrency & Collision Prevention

To prevent chaotic state thrashing when two students grab or tune the same apparatus:
- **Equipment Locking (`lib/realtime/lock-manager.ts`)**:
  - When Student A clicks or drags an equipment dial, they acquire a temporary lease.
  - Peer interfaces mark the object as temporarily engaged by Student A.
  - When Student A releases or remains idle for 6 seconds, the lease expires automatically.

## 3. Dual-Transport Provider

- **Production Mode**: Supabase Realtime Channels (`postgres_changes` + broadcast & presence).
- **Zero-Config Fallback**: HTML5 `BroadcastChannel` enables instant multi-tab and local testing without external API credentials.
