"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isLabView =
    pathname.startsWith("/lab") ||
    pathname.startsWith("/labs") ||
    pathname.startsWith("/rooms");

  if (isLabView) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-900 bg-black py-16 text-zinc-500 text-xs font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="text-zinc-200 tracking-widest text-sm font-bold uppercase block mb-1">
              MAGE LABS
            </span>
            <p className="text-zinc-500 max-w-md text-xs leading-relaxed font-sans">
              Interactive science, built as a place. Designed with physical restraint, authentic laboratory architecture, and rigorous stoichiometry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs">
            <Link href="/lab/chemistry" className="text-zinc-300 hover:text-white transition-colors">
              Chemistry Lab [02]
            </Link>
            <span className="text-zinc-600">Physics [01 - Coming Soon]</span>
            <span className="text-zinc-600">Biology [03 - Coming Soon]</span>
            <a
              href="https://github.com/iamHeroXD/magelabs"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600">
          <span>© {new Date().getFullYear()} MageLabs. Engineering scientific inquiry as a physical place.</span>
          <div className="flex gap-6">
            <span>Deterministic Chemistry</span>
            <span>PointerLock First-Person</span>
            <span>WebGL 2.0 PBR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
