"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LabHistory() {
  const [hasVisited, setHasVisited] = useState(false);
  const [dataPointsCount, setDataPointsCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const notes = window.localStorage.getItem("magelabs_ohms_notes");
      if (notes) {
        setHasVisited(true);
      }
    }
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-semibold text-sm text-zinc-100">Recent Laboratory Session</h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Progress Saved
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">PHYSICS</span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-400">Ohm's Law & Circuit Analysis</span>
          </div>
          <p className="text-xs text-zinc-300">
            Interactive circuit bench with DC power supply, resistor color bands, knife switch, and ammeter.
          </p>
        </div>

        <Link href="/labs/ohms-law" className="shrink-0">
          <Button variant="amber" size="sm" className="gap-1.5 font-semibold text-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Resume Lab
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
