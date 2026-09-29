import Link from "next/link";
import { Atom, ShieldCheck, Cpu, GitFork } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-12 text-zinc-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700/80 text-amber-500">
                <Atom className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold text-zinc-100">
                MageLabs
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              A high-precision, interactive virtual laboratory platform. Experience authentic laboratory equipment, topological circuit simulation, state-aware AI guidance, and real-time collaboration directly in your browser.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                V = IR Verified
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-cyan-500" />
                WebGPU/WebGL Powered
              </span>
            </div>
          </div>

          {/* Laboratories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200">
              Laboratories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/labs/ohms-law" className="text-amber-400/90 hover:text-amber-300 font-medium">
                  Ohm's Law & Circuitry (Flagship)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
                  Simple Harmonic Pendulum
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
                  Volumetric Acid-Base Titration
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
                  Compound Light Microscopy
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200">
              Platform & Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard#rooms" className="hover:text-zinc-200 transition-colors">
                  Multiplayer Bench Sync
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
                  Experiment State Engine
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/iamHeroXD/magelabs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                >
                  <GitFork className="h-3 w-3" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MageLabs. Engineering scientific inquiry anywhere.</p>
          <div className="flex gap-6">
            <span>Deterministic Physics</span>
            <span>Zero-Credential Fallback</span>
            <span>Realtime Broadcast</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
