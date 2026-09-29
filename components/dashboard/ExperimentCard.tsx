"use client";

import Link from "next/link";
import { Clock, BarChart, ArrowRight, Users, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExperimentDefinition } from "@/lib/experiments/types";

interface ExperimentCardProps {
  experiment: ExperimentDefinition;
  onCreateRoom?: (experimentId: string) => void;
}

export function ExperimentCard({ experiment, onCreateRoom }: ExperimentCardProps) {
  const isFlagship = experiment.id === "ohms-law";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-zinc-950/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl ${
        isFlagship
          ? "border-amber-500/40 hover:border-amber-500/80 shadow-[0_0_20px_rgba(217,155,84,0.06)]"
          : "border-zinc-800/80"
      }`}
    >
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                experiment.subject === "physics"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : experiment.subject === "chemistry"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {experiment.subject}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              {experiment.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <Clock className="h-3 w-3" />
            {experiment.estimatedDuration}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
          {experiment.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-2">
          {experiment.description}
        </p>

        {/* Learning objectives preview */}
        {experiment.learningObjectives.length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-zinc-800/60 pt-3">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">
              Core Competencies:
            </span>
            {experiment.learningObjectives.slice(0, 2).map((obj, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-400">
                <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{obj}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-zinc-800/80">
        <Link
          href={experiment.id === "acid-base-titration" ? "/lab/chemistry" : `/labs/${experiment.id}`}
          className="w-full sm:flex-1"
        >
          <Button
            variant={isFlagship ? "amber" : "secondary"}
            className="w-full gap-2 text-xs font-semibold h-10"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            Enter Lab
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Button>
        </Link>

        {onCreateRoom && (
          <Button
            variant="outline"
            onClick={() => onCreateRoom(experiment.id)}
            title="Create collaborative room for this lab"
            className="w-full sm:w-auto h-10 px-3 text-xs text-zinc-300 hover:text-white"
          >
            <Users className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
