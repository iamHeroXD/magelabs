# MageLabs — Virtual Laboratory Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/iamHeroXD/magelabs)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-orange)](https://threejs.org)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.17-blue)](https://docs.pmnd.rs/react-three-fiber)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

> **MageLabs** is an interactive, browser-based virtual laboratory platform engineered for authentic STEM inquiry. Experience high-precision electrical circuitry, real topological physics simulation ($V = IR$), state-aware AI tutoring via Gemini, and collaborative multi-user laboratory rooms.

---

## 🔬 Core Experience & Capabilities

1. **Flagship Ohm's Law Laboratory**:
   - **Realistic Apparatus**: DC Regulated Power Supply (0-24V), Ceramic Resistors with dynamic 4-band EIA color codes, Animated Single-Pole Knife Switch, Miniature Filament Lamp with temperature-dependent glow and 3D point light illumination, and digital series Ammeters & Multimeters.
   - **Flexible Patch Wiring**: Catmull-Rom spline cables with realistic gravity drape, binding post snap-targeting, and interactive click-to-disconnect.
   - **Deterministic Circuit Solver**: Graph-traversal topology solver calculating branch currents, potential drops, power dissipation ($P = I^2 R$), short-circuit hazards, and open-circuit states.

2. **Context-Aware AI Lab Assistant**:
   - Injects full laboratory bench state (switch position, voltages, branch currents, wire continuity, active student challenges) into the prompt.
   - Dual-engine architecture: Calls Gemini API (`gemini-1.5-flash`) when configured, with an intelligent offline heuristic physics advisor fallback for zero-credential operation.
   - 4 Pedagogy Modes: `Hint`, `Explain`, `Diagnose`, and `Deep-Dive`.

3. **Natural-Language Experiment Discovery**:
   - *"Tell us what you want to learn"*: Students describe what they want to investigate (e.g. *"I want to see what happens when I increase resistance"*), and the system semantically maps their intent to verified laboratories with transparent fallback.

4. **Multiplayer Bench Synchronization**:
   - Collaborative rooms with short shareable codes (e.g. `LAB-409`).
   - Synchronizes domain events (`SWITCH_TOGGLED`, `VOLTAGE_CHANGED`, `RESISTANCE_CHANGED`, `WIRE_CONNECTED`, `EXPERIMENT_RESET`).
   - Concurrency locking prevents race conditions when two students manipulate the same apparatus.
   - Integrated lab partner chat and activity feed.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **Physics**: Custom topological graph circuit solver adhering to Ohm's Law and Kirchhoff's Laws.
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`) + Heuristic Physics Advisor.
- **Realtime Collaboration**: Supabase Realtime + HTML5 `BroadcastChannel` multi-tab provider.
- **Database / Auth**: Supabase SSR (`@supabase/ssr`, `@supabase/supabase-js`) + Local Guest Session.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/iamHeroXD/magelabs.git
cd magelabs
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your keys:
- `GEMINI_API_KEY`: For Gemini-powered lab assistant (fallback engine activates automatically if omitted).
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: For Supabase auth & persistent rooms.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npm run test
```
Executes native unit tests verifying circuit physics calculations ($V = IR$, short circuits, open switches).

### 5. Production Build & Typecheck
```bash
npm run typecheck
npm run build
```

---

## 📁 Repository Architecture

```
magelabs/
├── app/                         # Next.js App Router routes
│   ├── (marketing)/page.tsx     # Clean product landing page
│   ├── dashboard/page.tsx       # Student dashboard & experiment catalog
│   ├── labs/[labId]/page.tsx    # 3D virtual laboratory
│   ├── rooms/[roomId]/page.tsx  # Collaborative multi-user room
│   └── api/ai/                  # Gemini AI assistant & NLP matcher endpoints
├── components/
│   ├── 3d/                      # Three.js R3F scene, camera, wires, and equipment
│   ├── lab/                     # HUD, circuit controls, V-I scatter plot, notebook
│   ├── ai/                      # Floating context-aware assistant widget
│   ├── multiplayer/             # Room header, roster, and collaborative chat
│   └── ui/                      # Accessible UI primitives
├── lib/
│   ├── experiments/             # Experiment definitions, registry, Ohm's law solver
│   ├── ai/                      # Gemini client and local physics advisor
│   ├── realtime/                # Realtime session provider and concurrency locks
│   └── auth/                    # Session management and guest fallback
├── blender/scripts/             # Headless Blender Python scripts for asset normalization
├── tests/unit/                  # Physics engine and intent parser unit tests
└── supabase/migrations/         # PostgreSQL schema and RLS policies
```

---

## 📜 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [Experiment Engine](./EXPERIMENT_ENGINE.md)
- [3D Asset Pipeline](./3D_PIPELINE.md)
- [Multiplayer Synchronization](./MULTIPLAYER.md)
- [AI Assistant & Safety](./AI.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 📄 License
MIT © MageLabs
