"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Compass, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NaturalLanguageSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matched: boolean;
    experiment?: { id: string; title: string; subject: string; description: string; url: string };
    explanation: string;
  } | null>(null);

  const samplePrompts = [
    "I want to explore how voltage affects electric current.",
    "Verify Ohm's Law and measure resistance from a V-I graph.",
    "Determine gravitational acceleration using a simple pendulum.",
    "Perform an acid-base titration with a burette and indicator.",
  ];

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setMatchResult(null);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error("NLP Match failed:", err);
      setMatchResult({
        matched: false,
        explanation: "Unable to process discovery request. Please choose directly from the catalog below.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
          Tell us what you want to learn
        </span>
      </div>

      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mb-2">
        Natural-Language Laboratory Discovery
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mb-4 leading-relaxed">
        Describe any scientific inquiry, circuit concept, or phenomenon you wish to investigate. Our system maps your goal directly to verified virtual laboratories.
      </p>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'I want to see what happens when I increase resistance in an energized circuit'..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80"
          />
        </div>
        <Button
          type="submit"
          variant="amber"
          disabled={!query.trim() || isLoading}
          className="gap-2 h-11 px-5 font-semibold text-sm whitespace-nowrap"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Compass className="h-4 w-4" />
          )}
          Find Laboratory
        </Button>
      </form>

      {/* Preset example prompt pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-zinc-500">Quick inquiries:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(p);
              handleSearch(p);
            }}
            className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-mono text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/80 border border-zinc-800/80 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Match Result Display */}
      {matchResult && (
        <div className="mt-5 rounded-xl border p-4 animate-in fade-in zoom-in-95 duration-200">
          {matchResult.matched && matchResult.experiment ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-950/20 border border-emerald-800/50 p-4 rounded-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                    Laboratory Matched
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {matchResult.experiment.subject}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-zinc-100">
                  {matchResult.experiment.title}
                </h3>
                <p className="text-xs text-zinc-400 max-w-xl">{matchResult.explanation}</p>
              </div>

              <Button
                variant="amber"
                size="md"
                onClick={() => router.push(matchResult.experiment!.url)}
                className="gap-2 shrink-0 font-semibold"
              >
                Launch This Lab
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-400 font-mono">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200 mb-1">Experiment Not Currently Supported</p>
                <p>{matchResult.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
