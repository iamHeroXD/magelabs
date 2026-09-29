"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isLabView =
    pathname.startsWith("/lab") ||
    pathname.startsWith("/labs") ||
    pathname.startsWith("/rooms");

  if (isLabView) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            MAGE LABS
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">
            EST. 2026 / SYS.01
          </span>
        </Link>

        {/* Minimal Nav on Right */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-mono tracking-wider">
          <Link
            href="/#portals"
            className="text-zinc-400 hover:text-white transition-colors uppercase"
          >
            LABS
          </Link>
          <Link
            href="/#narrative"
            className="text-zinc-400 hover:text-white transition-colors uppercase"
          >
            ABOUT
          </Link>
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-white transition-colors uppercase"
          >
            SIGN IN
          </Link>
          <Link
            href="/lab/chemistry"
            className="px-3 py-1 bg-white text-black font-semibold text-[11px] rounded hover:bg-zinc-200 transition-colors uppercase tracking-widest"
          >
            ENTER LAB
          </Link>
        </nav>
      </div>
    </header>
  );
}
