"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Atom, Compass, Layers, Users, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/lib/../components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const isLabView = pathname.startsWith("/labs/") || pathname.startsWith("/rooms/");

  if (isLabView) {
    // In full 3D lab mode, the lab overlay takes over the header to maximize immersive workbench space
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700/80 text-amber-500 shadow-sm transition-transform group-hover:scale-105">
            <Atom className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
              MageLabs
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                v1.0
              </span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono tracking-wider uppercase">
              Virtual Laboratory Platform
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-zinc-100 flex items-center gap-1.5 ${
              pathname === "/dashboard" ? "text-amber-400 font-semibold" : "text-zinc-400"
            }`}
          >
            <Compass className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard#catalog"
            className="text-zinc-400 transition-colors hover:text-zinc-100 flex items-center gap-1.5"
          >
            <Layers className="h-4 w-4" />
            Experiments
          </Link>
          <Link
            href="/dashboard#rooms"
            className="text-zinc-400 transition-colors hover:text-zinc-100 flex items-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            Multiplayer
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Physics Engine Active
          </div>

          <Link href="/labs/ohms-law">
            <Button variant="amber" size="sm" className="gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Launch Ohm's Lab
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
