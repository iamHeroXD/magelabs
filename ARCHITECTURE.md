# MageLabs Platform Architecture

## 1. System Overview

MageLabs is designed around a modular, reactive architecture that decouples rendering, simulation, state synchronization, and pedagogical guidance:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Viewport                       │
│  ┌────────────────────────┐    ┌─────────────────────────┐  │
│  │  3D WebGL Canvas (R3F) │    │  2D Tactical HUD & UI   │  │
│  │  - Equipment Meshes    │    │  - Circuit Controls     │  │
│  │  - Spline Wires        │    │  - V-I Scatter Plot     │  │
│  │  - Orbit Controls      │    │  - Lab Notebook         │  │
│  └───────────▲────────────┘    └────────────▲────────────┘  │
└──────────────┼──────────────────────────────┼───────────────┘
               │                              │
┌──────────────┴──────────────────────────────┴───────────────┐
│               Reactive Experiment State Store               │
│   Components [] | Wires [] | Records [] | Locks []          │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
       Domain Events                   Evaluation
               │                              │
┌──────────────▼─────────────┐   ┌────────────┴──────────────┐
│  Topological Circuit Solver│   │  Realtime Sync Provider   │
│  - Graph Traversal         │   │  - Supabase Realtime      │
│  - V = IR Calculations     │   │  - BroadcastChannel       │
│  - Short-Circuit Breaker   │   │  - Concurrency Lock Mgr   │
└──────────────┬─────────────┘   └───────────────────────────┘
               │
               ▼ Structured State Context
┌─────────────────────────────────────────────────────────────┐
│                   Context-Aware AI Tutor                    │
│   Gemini 1.5 Flash API (Server)  ⇄  Heuristic Physics Engine│
└─────────────────────────────────────────────────────────────┘
```

## 2. Key Subsystems

### A. Topological Physics Simulation Engine (`lib/experiments/ohms-law/simulator.ts`)
- Rather than running approximate rigid-body physics, scientific calculations are strictly deterministic.
- Translates the workbench apparatus into an adjacency graph of nodes and branches.
- Evaluates loop continuity from the positive terminal of the power supply to ground.
- Intercepts open knife switches, loose dangling wires, and zero-resistance short-circuits.
- Computes equivalent resistance $R_{eq}$, loop current $I = V / R_{eq}$, voltage drops, and lamp filament power $P = I^2 R$.

### B. Context-Aware AI Guidance (`lib/ai/`)
- Injects exact experimental values (switch state, supply voltage, branch currents, warnings) into structured Gemini prompts.
- Employs zero-credential offline fallbacks so the application runs out of the box in isolated local environments.
- Enforces pedagogical safety: offers hints and Socratic guidance rather than automatically solving experiments for the student.

### C. Collaborative Realtime Engine (`lib/realtime/`)
- Supports dual transports: Supabase Realtime for global web rooms, and HTML5 `BroadcastChannel` for zero-configuration inter-tab and local testing.
- Event-driven domain synchronization: avoids streaming raw high-frequency render frames and instead broadcasts high-level domain actions (`SWITCH_TOGGLED`, `VOLTAGE_CHANGED`, `WIRE_CONNECTED`).
- Concurrency locks with time-to-live leases prevent collision when multiple students interact with the same component.
