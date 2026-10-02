"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Droplet,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  FlaskConical,
  Flame,
  Scale,
  Gauge,
  Info,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  TestTube2,
  Volume2,
  VolumeX,
  BookOpen,
  Send,
  Zap,
} from "lucide-react";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";
import { LabVesselState } from "./equipment/InteractiveVessels";
import { calculateUnknownMolarity } from "@/lib/chemistry/engine";
import { RobotTask } from "./avatar/LabRobotAvatar3D";

interface ChemistryWorkbench2DProps {
  dispensedMl: number;
  currentPh: number;
  solutionColor: string;
  hasIndicator: boolean;
  isStopcockOpen: boolean;
  flowRateMode: "closed" | "dropwise" | "stream";
  vessels: LabVesselState[];
  heldVesselId: string | null;
  activeRobotTask: RobotTask;
  onToggleStopcock: () => void;
  onDispenseSingleDrop: () => void;
  onAddIndicator: () => void;
  onResetTitration: () => void;
  onSetFlowRateMode: (mode: "closed" | "dropwise" | "stream") => void;
  onPickUpVessel: (id: string) => void;
  onPourIntoVessel: (targetId: string) => void;
  onOpenNotebook: () => void;
  onToggleAssistant: () => void;
  onOpenRobotMenu: () => void;
}

export function ChemistryWorkbench2D({
  dispensedMl,
  currentPh,
  solutionColor,
  hasIndicator,
  isStopcockOpen,
  flowRateMode,
  vessels,
  heldVesselId,
  activeRobotTask,
  onToggleStopcock,
  onDispenseSingleDrop,
  onAddIndicator,
  onResetTitration,
  onSetFlowRateMode,
  onPickUpVessel,
  onPourIntoVessel,
  onOpenNotebook,
  onToggleAssistant,
  onOpenRobotMenu,
}: ChemistryWorkbench2DProps) {
  const [isStirring, setIsStirring] = useState(true);
  const [stirrerRpm, setStirrerRpm] = useState(450);
  const [hotplateTempC, setHotplateTempC] = useState(25.0);
  const [balanceTare, setBalanceTare] = useState(0);
  const [hoveredApparatus, setHoveredApparatus] = useState<string | null>(null);
  const [dataPoints, setDataPoints] = useState<Array<{ v: number; ph: number }>>([
    { v: 0, ph: 1.0 },
  ]);
  const [auraSpeech, setAuraSpeech] = useState<string>(
    "Welcome to the 2D Analytical Chemistry Workbench! First, add 3 drops of Phenolphthalein indicator to the analyte flask."
  );

  // Keep live titration curve history updated
  useEffect(() => {
    setDataPoints((prev) => {
      const roundedV = Math.round(dispensedMl * 10) / 10;
      const last = prev[prev.length - 1];
      if (!last || Math.abs(last.v - roundedV) >= 0.1 || Math.abs(last.ph - currentPh) >= 0.1) {
        return [...prev, { v: roundedV, ph: currentPh }].sort((a, b) => a.v - b.v);
      }
      return prev;
    });
  }, [dispensedMl, currentPh]);

  // Voice guidance on milestone transitions
  useEffect(() => {
    if (!hasIndicator) {
      setAuraSpeech("Step 1: Click [ADD INDICATOR] to pipet 3 drops of Phenolphthalein into the 25.0 mL HCl analyte.");
    } else if (dispensedMl === 0) {
      setAuraSpeech("Step 2: Solution is ready! Turn stopcock to Dropwise mode to begin dispensing standardized 0.100 M NaOH.");
    } else if (dispensedMl >= 24.0 && dispensedMl < 25.0) {
      setAuraSpeech("Attention: Approaching stoichiometric equivalence point! Use [DISPENSE 1 DROP] for precise endpoint detection.");
    } else if (dispensedMl >= 25.0 && dispensedMl <= 25.2) {
      setAuraSpeech("Stoichiometric endpoint reached at pH 8.2! Permanent faint pink solution observed. Close the stopcock!");
    } else if (dispensedMl > 25.5) {
      setAuraSpeech("Over-titrated! Excess NaOH observed (deep magenta solution). Click [RESET EXPERIMENT] for fresh trial.");
    }
  }, [hasIndicator, dispensedMl]);

  // Analytical balance mass (tared beaker 42.158 g + contents)
  const balanceWeightG = useMemo(() => {
    const raw = 42.158 + (25.0 + dispensedMl) * 1.002 - balanceTare;
    return Math.max(0, raw);
  }, [dispensedMl, balanceTare]);

  // Unknown molarity calculation
  const calculatedMolarity = useMemo(() => {
    if (dispensedMl < 1) return null;
    return calculateUnknownMolarity(25.0, dispensedMl, 0.1);
  }, [dispensedMl]);

  // Burette fluid height fraction (50 mL capacity)
  const buretteRemainingMl = Math.max(0, 50.0 - dispensedMl);
  const buretteFillPercent = (buretteRemainingMl / 50.0) * 100;

  // Flask fluid volume (25 mL initial + dispensed)
  const flaskVolumeMl = 25.0 + dispensedMl;
  const flaskFillPercent = Math.min(95, (flaskVolumeMl / 100.0) * 85);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────────────────
          1. HEADER NAV & TELEMETRY BAR
         ───────────────────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                  MageLabs
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-widest">
                  2D Virtual Lab
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Acid-Base Titration Protocol // HCl(aq) + NaOH(aq)
              </p>
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Pills */}
        <div className="hidden md:flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-500">DISPENSED:</span>
            <span className="text-cyan-400 font-bold">{dispensedMl.toFixed(2)} mL</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-500">PH:</span>
            <span
              className={`font-bold ${
                currentPh < 7 ? "text-rose-400" : currentPh > 8.2 ? "text-fuchsia-400" : "text-emerald-400"
              }`}
            >
              {currentPh.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-500">INDICATOR:</span>
            <span className={hasIndicator ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {hasIndicator ? "PHENOLPHTHALEIN (ADDED)" : "NONE"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-500">VALVE:</span>
            <span
              className={`font-bold uppercase ${
                flowRateMode === "stream"
                  ? "text-rose-400"
                  : flowRateMode === "dropwise"
                  ? "text-cyan-400"
                  : "text-zinc-400"
              }`}
            >
              {flowRateMode}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotebook}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>Notebook</span>
          </button>

          <button
            onClick={onToggleAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span>Dr. AURA</span>
          </button>

          <button
            onClick={onResetTitration}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors"
            title="Refill Burette & Reset Flask"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. MAIN 2D WORKBENCH BENCHTOP LAYOUT
         ───────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: REAGENTS, BALANCE & HOTPLATE */}
        <div className="w-full lg:w-72 border-r border-zinc-800/80 bg-zinc-950/50 p-4 flex flex-col gap-4 overflow-y-auto z-10">
          {/* Chemical Reagents Shelf */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Reagent Shelf
              </span>
              <span className="text-[10px] font-mono text-zinc-500">0.100 M STD</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Phenolphthalein Bottle */}
              <button
                onClick={() => {
                  chemistryAudio.playLiquidDrop();
                  onAddIndicator();
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  hasIndicator
                    ? "border-emerald-500/30 bg-emerald-950/20"
                    : "border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-900/30 shadow-lg shadow-amber-950/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-6 w-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Droplet className="h-3.5 w-3.5" />
                  </div>
                  {hasIndicator ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      CLICK
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-zinc-200">Phenolphthalein</div>
                <div className="text-[10px] text-zinc-400 font-mono">1% in ethanol</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">
                  {hasIndicator ? "Added (3 Drops)" : "Dispense 3 drops"}
                </div>
              </button>

              {/* Titrant Stock Bottle: 0.100 M NaOH */}
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <div className="h-6 w-6 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 mb-1.5">
                  <FlaskConical className="h-3.5 w-3.5" />
                </div>
                <div className="text-xs font-bold text-zinc-200">NaOH Titrant</div>
                <div className="text-[10px] text-blue-400 font-mono">0.1000 M Standard</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Burette supply</div>
              </div>

              {/* Analyte Stock Bottle: HCl */}
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <div className="h-6 w-6 rounded bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-1.5">
                  <FlaskConical className="h-3.5 w-3.5" />
                </div>
                <div className="text-xs font-bold text-zinc-200">HCl Analyte</div>
                <div className="text-[10px] text-rose-400 font-mono">Unknown Molarity</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">25.0 mL in flask</div>
              </div>

              {/* Distilled Water Wash Bottle */}
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <div className="h-6 w-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-1.5">
                  <Droplet className="h-3.5 w-3.5" />
                </div>
                <div className="text-xs font-bold text-zinc-200">Deionized H₂O</div>
                <div className="text-[10px] text-cyan-400 font-mono">HPLC Grade</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Wash Bottle</div>
              </div>
            </div>
          </div>

          {/* Analytical Pan Balance */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-zinc-400" /> Analytical Balance
              </span>
              <button
                onClick={() => {
                  chemistryAudio.playBeep();
                  setBalanceTare(42.158 + (25.0 + dispensedMl) * 1.002);
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
              >
                TARE
              </button>
            </div>

            {/* Digital Balance LED Screen */}
            <div className="p-2.5 rounded-lg bg-black border border-emerald-500/30 flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-emerald-500/70">METTLER AE240</span>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-emerald-400 tracking-wider">
                  {balanceWeightG.toFixed(4)}
                </span>
                <span className="text-xs font-mono text-emerald-500 ml-1">g</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex justify-between">
              <span>Flask + Solution Mass</span>
              <span>Tolerance ±0.0001g</span>
            </div>
          </div>

          {/* Magnetic Hotplate Stirrer */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-400" /> Magnetic Hotplate
              </span>
              <button
                onClick={() => {
                  chemistryAudio.playStopcockClick();
                  setIsStirring(!isStirring);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border transition-colors ${
                  isStirring
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                }`}
              >
                {isStirring ? "STIR ON" : "STIR OFF"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-black/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">TEMP</span>
                <span className="text-sm font-bold text-orange-400">{hotplateTempC.toFixed(1)}°C</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">SPEED</span>
                <span className="text-sm font-bold text-cyan-400">
                  {isStirring ? `${stirrerRpm} RPM` : "0 RPM"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────
            CENTER STAGE: INTERACTIVE 2D TITRATION BENCH APPARATUS
           ───────────────────────────────────────────────────────────────────────── */}
        <div className="flex-1 relative bg-gradient-to-b from-[#0a0d14] via-[#090b10] to-[#06070a] flex flex-col items-center justify-between p-4 overflow-y-auto">
          {/* Dr. AURA Speech Bubble Announcement Banner */}
          <div className="w-full max-w-2xl px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur flex items-center gap-3 shadow-lg shadow-cyan-950/20">
            <div className="h-9 w-9 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 text-cyan-300 relative">
              <Bot className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Dr. AURA // Autonomous AI Lab Director
                </span>
              </div>
              <p className="text-xs text-zinc-200 font-sans truncate">{auraSpeech}</p>
            </div>
            <button
              onClick={() => chemistryAudio.speakRobotVoice(auraSpeech)}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-300 transition-colors"
              title="Speak instruction"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              CENTRAL 2D SCHEMATIC SVG APPARATUS
             ───────────────────────────────────────────────────────────────── */}
          <div className="relative w-full max-w-xl flex-1 flex items-center justify-center py-2">
            <svg
              viewBox="0 0 600 680"
              className="w-full h-auto max-h-[580px] drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.5))" }}
            >
              <defs>
                {/* Glass reflection gradients */}
                <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="75%" stopColor="#ffffff" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
                </linearGradient>

                {/* Burette Titrant Fluid Gradient */}
                <linearGradient id="buretteFluid" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                </linearGradient>

                {/* Reaction Flask Fluid Dynamic Solution Color */}
                <linearGradient id="flaskFluid" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={solutionColor} stopOpacity="0.85" />
                  <stop offset="50%" stopColor={solutionColor} stopOpacity="0.65" />
                  <stop offset="100%" stopColor={solutionColor} stopOpacity="0.9" />
                </linearGradient>

                {/* Retort Stand Cast Iron */}
                <linearGradient id="castIron" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="50%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>

                {/* Chrome Rod Gradient */}
                <linearGradient id="chromeRod" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="35%" stopColor="#f8fafc" />
                  <stop offset="70%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* ─────────────────────────────────────────────────────────
                  1. RETORT STAND ARCHITECTURE
                 ───────────────────────────────────────────────────────── */}
              {/* Stand Heavy Base Plate */}
              <rect x="180" y="620" width="240" height="24" rx="4" fill="url(#castIron)" stroke="#52525b" strokeWidth="1.5" />
              {/* Beveled edge highlight */}
              <rect x="184" y="622" width="232" height="4" rx="2" fill="#71717a" fillOpacity="0.4" />

              {/* White Porcelain Contrast Tile (Under Flask) */}
              <rect x="230" y="608" width="140" height="12" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="234" y="610" width="132" height="3" fill="#ffffff" />

              {/* Vertical Polished Chrome Rod */}
              <rect x="375" y="40" width="14" height="580" rx="3" fill="url(#chromeRod)" stroke="#475569" strokeWidth="1" />

              {/* Top Retort Stand Clamp & Bosshead */}
              <rect x="365" y="110" width="28" height="22" rx="3" fill="#3f3f46" stroke="#18181b" strokeWidth="1" />
              <line x1="330" y1="121" x2="365" y2="121" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              {/* Clamp Jaws gripping Burette */}
              <path d="M 315 112 C 324 112, 328 116, 328 121 C 328 126, 324 130, 315 130" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

              {/* Lower Retort Stand Clamp */}
              <rect x="365" y="290" width="28" height="22" rx="3" fill="#3f3f46" stroke="#18181b" strokeWidth="1" />
              <line x1="330" y1="301" x2="365" y2="301" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <path d="M 315 292 C 324 292, 328 296, 328 301 C 328 306, 324 310, 315 310" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

              {/* ─────────────────────────────────────────────────────────
                  2. 50.00 mL PRECISION GLASS BURETTE
                 ───────────────────────────────────────────────────────── */}
              {/* Burette Glass Column (Outer) */}
              <rect x="288" y="50" width="24" height="320" rx="3" fill="#ffffff" fillOpacity="0.08" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Burette Liquid Column (Fills according to remaining volume) */}
              {buretteFillPercent > 0 && (
                <rect
                  x="290"
                  y={50 + 320 * (1 - buretteFillPercent / 100)}
                  width="20"
                  height={320 * (buretteFillPercent / 100)}
                  fill="url(#buretteFluid)"
                />
              )}

              {/* Curved Meniscus on Liquid Top */}
              {buretteFillPercent > 0 && buretteFillPercent < 100 && (
                <ellipse
                  cx="300"
                  cy={50 + 320 * (1 - buretteFillPercent / 100)}
                  rx="10"
                  ry="2.5"
                  fill="#7dd3fc"
                  fillOpacity="0.6"
                />
              )}

              {/* Precision Millimeter Graduations on Burette */}
              {Array.from({ length: 21 }).map((_, idx) => {
                const yPos = 60 + idx * 14.5;
                const isMajor = idx % 5 === 0;
                const val = idx * 2.5;
                return (
                  <g key={`grad-${idx}`}>
                    <line
                      x1={isMajor ? 290 : 294}
                      y1={yPos}
                      x2={302}
                      y2={yPos}
                      stroke="#ffffff"
                      strokeWidth={isMajor ? 1.2 : 0.7}
                      strokeOpacity={0.8}
                    />
                    {isMajor && (
                      <text
                        x="305"
                        y={yPos + 3}
                        fontSize="8"
                        fontFamily="monospace"
                        fill="#cbd5e1"
                        fillOpacity="0.9"
                      >
                        {val.toFixed(0)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Glass Reflection Highlight Sheen */}
              <rect x="290" y="52" width="6" height="316" rx="2" fill="url(#glassSheen)" />

              {/* Burette Stopcock Glass Joint & Barrel */}
              <rect x="296" y="370" width="8" height="18" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <polygon points="292,382 308,382 304,394 296,394" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

              {/* Stopcock Rotating Valve Handle */}
              <g
                transform={`rotate(${flowRateMode === "stream" ? 90 : flowRateMode === "dropwise" ? 45 : 0}, 300, 388)`}
                onClick={onToggleStopcock}
                className="cursor-pointer group"
              >
                <rect x="282" y="384" width="36" height="8" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                <circle cx="300" cy="388" r="4" fill="#ffffff" />
              </g>

              {/* Dispensing Jet Tip */}
              <polygon points="298,394 302,394 301,416 299,416" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />

              {/* ─────────────────────────────────────────────────────────
                  3. DISPENSING JET / DROPLETS (ANIMATED)
                 ───────────────────────────────────────────────────────── */}
              {isStopcockOpen && flowRateMode === "stream" && (
                <line x1="300" y1="416" x2="300" y2="495" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.85" strokeDasharray="6,2" />
              )}

              {isStopcockOpen && flowRateMode === "dropwise" && (
                <g>
                  {/* Discrete Falling Droplet */}
                  <ellipse cx="300" cy="445" rx="3" ry="5" fill="#38bdf8" fillOpacity="0.95">
                    <animate attributeName="cy" values="418;495" dur="0.45s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="4;6" dur="0.45s" repeatCount="indefinite" />
                  </ellipse>
                </g>
              )}

              {/* ─────────────────────────────────────────────────────────
                  4. 250 mL ERLENMEYER REACTION FLASK
                 ───────────────────────────────────────────────────────── */}
              {/* Flask Outer Glass Shape */}
              <g>
                {/* Conical body path */}
                <path
                  d="M 288 470 L 288 495 L 235 595 C 230 605, 235 608, 245 608 L 355 608 C 365 608, 370 605, 365 595 L 312 495 L 312 470 Z"
                  fill="#ffffff"
                  fillOpacity="0.08"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Flask Lip Rim */}
                <ellipse cx="300" cy="470" rx="13" ry="3.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Flask Liquid Mass */}
                <path
                  d="M 252 565 L 242 596 C 238 604, 242 606, 250 606 L 350 606 C 358 606, 362 604, 358 596 L 348 565 Z"
                  fill="url(#flaskFluid)"
                />

                {/* Liquid Top Meniscus */}
                <ellipse cx="300" cy="565" rx="48" ry="6" fill={solutionColor} fillOpacity="0.8" />

                {/* Spinning Magnetic Stir Bar inside solution */}
                {isStirring && (
                  <g transform="translate(300, 598)">
                    <rect x="-14" y="-3.5" width="28" height="7" rx="3.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="0.18s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </g>
                )}

                {/* Stirring Vortex Cone */}
                {isStirring && (
                  <path
                    d="M 288 565 Q 300 588 300 592 Q 300 588 312 565 Z"
                    fill={solutionColor}
                    fillOpacity="0.5"
                  />
                )}

                {/* Flask Glass Reflections */}
                <path
                  d="M 290 495 L 246 595 C 243 601, 248 604, 254 604"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.35"
                  strokeLinecap="round"
                />
              </g>

              {/* ─────────────────────────────────────────────────────────
                  5. DIGITAL PH ELECTRODE PROBE
                 ───────────────────────────────────────────────────────── */}
              {/* Glass electrode body dipping into flask */}
              <rect x="312" y="475" width="6" height="110" rx="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
              {/* Sensitive glass bulb at tip */}
              <circle cx="315" cy="588" r="4.5" fill="#38bdf8" fillOpacity="0.8" stroke="#0284c7" strokeWidth="1" />
              {/* Shielded cable curving towards pH meter */}
              <path
                d="M 315 475 C 315 430, 430 430, 460 480"
                fill="none"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* ─────────────────────────────────────────────────────────
                  6. BENCHTOP DIGITAL PH METER
                 ───────────────────────────────────────────────────────── */}
              <g transform="translate(440, 480)">
                {/* Meter Housing */}
                <rect x="0" y="0" width="135" height="95" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="6" y="6" width="123" height="52" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />

                {/* 7-Segment LED pH Display */}
                <text x="67" y="38" fontSize="22" fontFamily="monospace" fontWeight="bold" fill="#38bdf8" textAnchor="middle">
                  {currentPh.toFixed(2)}
                </text>
                <text x="115" y="24" fontSize="9" fontFamily="monospace" fill="#0ea5e9">
                  pH
                </text>
                <text x="67" y="52" fontSize="9" fontFamily="monospace" fill="#64748b" textAnchor="middle">
                  25.0°C · ATC ACTIVE
                </text>

                {/* Meter Keypad Buttons */}
                <rect x="14" y="68" width="24" height="16" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                <text x="26" y="79" fontSize="7" fontFamily="monospace" fill="#cbd5e1" textAnchor="middle">CAL</text>

                <rect x="46" y="68" width="24" height="16" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                <text x="58" y="79" fontSize="7" fontFamily="monospace" fill="#cbd5e1" textAnchor="middle">MODE</text>

                <rect x="78" y="68" width="24" height="16" rx="2" fill="#0369a1" stroke="#0284c7" strokeWidth="0.8" />
                <text x="90" y="79" fontSize="7" fontFamily="monospace" fill="#f8fafc" textAnchor="middle">READ</text>
              </g>
            </svg>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              BOTTOM WORKBENCH CONTROL CONSOLE
             ───────────────────────────────────────────────────────────────── */}
          <div className="w-full max-w-2xl bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-4 backdrop-blur shadow-2xl flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Flow Rate Mode Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                <button
                  onClick={() => {
                    chemistryAudio.playStopcockClick();
                    onSetFlowRateMode("closed");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    flowRateMode === "closed"
                      ? "bg-zinc-800 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  CLOSED
                </button>
                <button
                  onClick={() => {
                    chemistryAudio.playStopcockClick();
                    onSetFlowRateMode("dropwise");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    flowRateMode === "dropwise"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  DROPWISE
                </button>
                <button
                  onClick={() => {
                    chemistryAudio.playStopcockClick();
                    onSetFlowRateMode("stream");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    flowRateMode === "stream"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  STREAM
                </button>
              </div>

              {/* Precision Single-Drop Dispense Button */}
              <button
                onClick={() => {
                  chemistryAudio.playLiquidDrop();
                  onDispenseSingleDrop();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-900/30 active:scale-95"
              >
                <Droplet className="h-4 w-4" />
                <span>+0.05 mL (SINGLE DROP)</span>
              </button>

              {/* Stopcock Main Toggle Button */}
              <button
                onClick={() => {
                  chemistryAudio.playStopcockClick();
                  onToggleStopcock();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-lg active:scale-95 ${
                  isStopcockOpen
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"
                }`}
              >
                {isStopcockOpen ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isStopcockOpen ? "CLOSE VALVE" : "OPEN VALVE"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────
            RIGHT COLUMN: REAL-TIME TITRATION CURVE & 6-WELL TEST TUBES
           ───────────────────────────────────────────────────────────────────────── */}
        <div className="w-full lg:w-80 border-l border-zinc-800/80 bg-zinc-950/50 p-4 flex flex-col gap-4 overflow-y-auto z-10">
          {/* Live Real-Time Titration Curve Graph */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-cyan-400" /> Titration Curve
              </span>
              <span className="text-[10px] font-mono text-zinc-500">pH vs NaOH</span>
            </div>

            {/* SVG Sigmoidal Curve Plot */}
            <div className="p-2 rounded-lg bg-black/80 border border-zinc-800">
              <svg viewBox="0 0 240 160" className="w-full h-auto">
                {/* Coordinate Grid Lines */}
                <line x1="30" y1="20" x2="30" y2="135" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="135" x2="230" y2="135" stroke="#334155" strokeWidth="1" />

                {/* Horizontal pH reference marks */}
                {[0, 7, 14].map((phVal) => {
                  const y = 135 - (phVal / 14) * 115;
                  return (
                    <g key={`ph-${phVal}`}>
                      <line x1="26" y1={y} x2="230" y2={y} stroke="#1e293b" strokeDasharray="2,2" strokeWidth="0.8" />
                      <text x="22" y={y + 3} fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="end">
                        {phVal}
                      </text>
                    </g>
                  );
                })}

                {/* Equivalence Point Line (at 25.0 mL) */}
                <line x1="130" y1="20" x2="130" y2="135" stroke="#10b981" strokeDasharray="3,3" strokeWidth="1" strokeOpacity="0.5" />
                <text x="132" y="32" fontSize="7" fontFamily="monospace" fill="#10b981">
                  EQ (25.0 mL)
                </text>

                {/* Sigmoidal Theoretical Curve */}
                <path
                  d="M 30 127 C 80 124, 120 120, 126 112 C 128 95, 129 60, 131 40 C 135 34, 180 32, 230 30"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />

                {/* Experimental Data Points Plotted Live */}
                {dataPoints.map((pt, idx) => {
                  const cx = 30 + (Math.min(50, pt.v) / 50) * 200;
                  const cy = 135 - (Math.min(14, pt.ph) / 14) * 115;
                  const isCurrent = idx === dataPoints.length - 1;

                  return (
                    <circle
                      key={`pt-${idx}`}
                      cx={cx}
                      cy={cy}
                      r={isCurrent ? 4 : 2}
                      fill={isCurrent ? "#f43f5e" : "#fbbf24"}
                      stroke="#ffffff"
                      strokeWidth={isCurrent ? 1.5 : 0.5}
                    />
                  );
                })}

                {/* X Axis Labels (0 to 50 mL) */}
                <text x="30" y="148" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">0</text>
                <text x="130" y="148" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">25</text>
                <text x="230" y="148" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">50 mL</text>
              </svg>
            </div>

            {/* Stoichiometry Calculations Block */}
            <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Reaction:</span>
                <span className="text-zinc-200">HCl + NaOH → NaCl + H₂O</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Analyte Vol (V_A):</span>
                <span className="text-zinc-200">25.00 mL</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Titrant Conc (M_B):</span>
                <span className="text-cyan-400 font-bold">0.1000 M</span>
              </div>
              {calculatedMolarity && (
                <div className="flex justify-between text-emerald-400 border-t border-zinc-800 pt-1 font-bold">
                  <span>Calculated M_A:</span>
                  <span>{calculatedMolarity.toFixed(4)} M</span>
                </div>
              )}
            </div>
          </div>

          {/* 6-Well Reaction Test Tubes Rack */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <TestTube2 className="h-3.5 w-3.5 text-blue-400" /> Reaction Tubes Rack
              </span>
              <span className="text-[10px] font-mono text-zinc-500">6 Wells</span>
            </div>

            <div className="grid grid-cols-3 gap-2 flex-1">
              {[
                { name: "KMnO₄", color: "#7e22ce", desc: "Potassium Permanganate" },
                { name: "FeCl₃", color: "#d97706", desc: "Iron(III) Chloride" },
                { name: "CuSO₄", color: "#0284c7", desc: "Copper(II) Sulfate" },
                { name: "NiSO₄", color: "#059669", desc: "Nickel(II) Sulfate" },
                { name: "Methyl Org", color: "#ea580c", desc: "Indicator (pH 3.1-4.4)" },
                { name: "Carbonate", color: "#f8fafc", desc: "Active Fizz (HCl+Na₂CO₃)" },
              ].map((tube, idx) => (
                <div
                  key={idx}
                  onClick={() => chemistryAudio.playGlassClink()}
                  className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 transition-all flex flex-col items-center justify-between cursor-pointer group"
                >
                  <div className="w-4 h-16 rounded-full border border-zinc-600 bg-zinc-950/80 relative overflow-hidden flex items-end">
                    <div
                      className="w-full rounded-b-full transition-all"
                      style={{
                        height: "75%",
                        backgroundColor: tube.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-200 mt-1 truncate w-full text-center">
                    {tube.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
