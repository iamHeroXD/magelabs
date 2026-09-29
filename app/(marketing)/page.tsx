import Link from "next/link";
import {
  Atom,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Users,
  Bot,
  Compass,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[#090a0d] text-zinc-100 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 border-b border-zinc-800/80 bg-lab-grid">
        {/* Subtle radial ambient warmth */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-medium text-amber-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            VIRTUAL LABORATORY PLATFORM · V1.0 RELEASE
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08]">
            Your laboratory,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              anywhere.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            MageLabs brings authenticated physical science experiments directly to the browser. Manipulate realistic 3D laboratory apparatus, test Ohm's Law with deterministic circuit simulation, collaborate with peers, and get intelligent guidance from an AI assistant that actually sees your bench.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/labs/ohms-law" className="w-full sm:w-auto">
              <Button
                variant="amber"
                size="lg"
                className="w-full sm:w-auto gap-2.5 font-bold text-sm h-12 px-7 shadow-xl shadow-amber-500/10"
              >
                <Zap className="h-4 w-4 fill-current" />
                Enter Virtual Laboratory
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 text-sm h-12 px-6 border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200"
              >
                <Compass className="h-4 w-4 text-amber-400" />
                Explore Experiment Catalog
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Mathematically Verified Physics (V = IR)
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-cyan-500" />
              Hardware-Accelerated 3D WebGL
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-amber-500" />
              Real-Time Collaborative Rooms
            </span>
          </div>
        </div>

        {/* Hero Product Visual Card */}
        <div className="relative z-10 mx-auto max-w-5xl w-full mt-14 rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 px-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-zinc-500 ml-2">
                MageLabs Virtual Lab Bench · Ohm's Law Circuit Apparatus
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
              Live Simulation Active
            </span>
          </div>

          {/* Interactive Preview Container */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-900 bg-[#0d0e12] flex items-center justify-center p-6 text-center group">
            {/* Visual simulation representation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-zinc-950 to-zinc-900/60" />

            <div className="relative z-10 max-w-lg space-y-4">
              <div className="flex justify-center gap-3">
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left font-mono text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase block">DC Power Supply</span>
                  <span className="text-base font-bold text-amber-400">12.0 V</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left font-mono text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase block">Series Current</span>
                  <span className="text-base font-bold text-cyan-400">1.188 A</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left font-mono text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase block">Resistor Load</span>
                  <span className="text-base font-bold text-emerald-400">10.0 Ω</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-zinc-100">
                  Ready to start experimenting?
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Click below to enter the full 3D interactive workbench with camera orbit, patch wiring, and live multimeters.
                </p>
              </div>

              <Link href="/labs/ohms-law" className="inline-block">
                <Button variant="amber" size="md" className="gap-2 font-bold text-xs">
                  <Zap className="h-4 w-4 fill-current" />
                  Launch Interactive Lab Bench
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section 01 — What is MageLabs? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                01 — Concept & Approach
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                A laboratory, not an educational dashboard.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Most educational software reduces science to static text or multiple-choice quizzes. MageLabs treats the browser as an actual laboratory environment.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Students manipulate physical equipment: connecting insulated patch cables, tuning variable power dials, closing knife switch contacts, and watching physical consequences like bulb illumination and circuit breaker cutoffs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="font-mono text-2xl font-bold text-amber-400">01</span>
                <h4 className="font-display font-semibold text-sm text-zinc-100">Realistic Physics</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real calculations from circuit topology rather than pre-baked canned animations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="font-mono text-2xl font-bold text-cyan-400">02</span>
                <h4 className="font-display font-semibold text-sm text-zinc-100">Contextual AI</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The AI tutor inspects your exact voltage, resistance, and wire continuity in real time.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="font-mono text-2xl font-bold text-emerald-400">03</span>
                <h4 className="font-display font-semibold text-sm text-zinc-100">Multiplayer Rooms</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Collaborate with classmates around the same 3D bench with synchronized presence.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="font-mono text-2xl font-bold text-purple-400">04</span>
                <h4 className="font-display font-semibold text-sm text-zinc-100">Data Logging</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Record trials, plot dynamic V-I regression curves, and export scientific CSV logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 02 — Enter a Realistic Laboratory */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/80">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              02 — Flagship Experiment
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100">
              Ohm's Law & Circuit Analysis
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Explore the foundational law of electrical circuits ($V = IR$). Connect power sources, loads, switches, and precision meters with authentic laboratory feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-zinc-100">
                DC Regulated Power Supply
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fine & coarse rotary dials deliver smooth 0-24V output with high-contrast digital LED voltage displays and isolated ground terminals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-zinc-100">
                Precision Digital Multimeters
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Low-shunt in-line ammeter and high-impedance voltmeter probes accurately measure series current and nodal voltage drops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-zinc-100">
                Flexible Catmull-Rom Wires
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Insulated patch cables snap naturally to terminal posts with realistic gravity drape and click-to-disconnect management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 03 — Ask the AI Lab Assistant */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Bot className="h-4 w-4" /> State Diagnostic Analysis
                </span>
                <span className="text-[10px] text-zinc-500">Live Context Hook</span>
              </div>
              <p className="text-zinc-300">
                <span className="text-zinc-500">Student:</span> "Why isn't the bulb lighting?"
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed">
                <p className="font-bold text-amber-400 mb-1">AI Assistant:</p>
                <p>
                  "Your circuit loop is currently interrupted. The **knife switch is OPEN**, leaving an air gap with infinite resistance. Click the switch blade to close the circuit and allow electrons to flow."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                03 — Context-Aware AI Guidance
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                An AI assistant that actually sees your laboratory state.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Unlike generic disconnected chatbots, the MageLabs AI assistant receives the live electrical state directly: switch position, circuit continuity, voltage drops, and active challenges.
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Diagnoses open switches, short circuits, and loose wires
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Offers Hint, Explain, and Deep-Dive theory modes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Provides pedagogical Socratic clues rather than spoiling answers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 04 — Learn With Friends */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/80">
        <div className="mx-auto max-w-6xl text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            04 — Collaborative Rooms
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 max-w-2xl mx-auto">
            Share your virtual laboratory bench in real time.
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create a room with a short 6-character code, send the invite link to your classmates, and conduct laboratory investigations together.
          </p>

          <div className="pt-4 flex justify-center">
            <Link href="/rooms/LAB-DEMO">
              <Button variant="secondary" size="lg" className="gap-2 font-mono text-xs">
                <Users className="h-4 w-4 text-cyan-400" />
                Try Interactive Multiplayer Demo Room
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Section 05 — Final Call to Action */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-lab-grid text-center relative">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-zinc-100">
            Experience the future of virtual science.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            No installation required. Jump straight into an authenticated 3D laboratory bench in your browser today.
          </p>
          <div className="pt-2">
            <Link href="/labs/ohms-law">
              <Button variant="amber" size="lg" className="gap-2 font-bold text-sm h-12 px-8">
                <Zap className="h-4 w-4 fill-current" />
                Launch MageLabs Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
