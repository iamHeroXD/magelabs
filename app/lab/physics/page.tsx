import Link from "next/link";
import { ArrowLeft, Lock, Atom } from "lucide-react";

export default function PhysicsComingSoonPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-20 text-center font-sans">
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-400">
          <Lock className="h-3 w-3 text-zinc-500" />
          <span>STAGE 02 CURRICULUM</span>
        </div>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Atom className="h-7 w-7" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight uppercase">
          PHYSICS
          <br />
          <span className="text-zinc-500">COMING SOON</span>
        </h1>

        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          The Physics virtual laboratory (Harmonic Motion, Wave Optics, and Electrodynamics) is currently being upgraded to the full first-person room architecture.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            href="/lab/chemistry"
            className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors uppercase tracking-wider"
          >
            ENTER ACTIVE CHEMISTRY LAB
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 border border-zinc-800 hover:border-zinc-600 text-zinc-300 rounded transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
