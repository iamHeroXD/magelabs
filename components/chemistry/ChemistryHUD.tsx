"use client";

import Link from "next/link";
import {
  Volume2,
  VolumeX,
  BookOpen,
  LogOut,
  Maximize2,
  Minimize2,
  Droplet,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sparkles,
  Sun,
  Moon,
  ArrowDownCircle,
  Bot,
  Eye,
  Sliders,
} from "lucide-react";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";
import { useState } from "react";
import { LabVesselState } from "./equipment/InteractiveVessels";
import { InspectViewMode } from "./InspectionCamera";

interface ChemistryHUDProps {
  isInspecting: boolean;
  onToggleInspect: () => void;
  inspectViewMode?: InspectViewMode;
  onSetInspectViewMode?: (mode: InspectViewMode) => void;
  hoverLabel: string | null;
  currentStep: number;
  totalSteps: number;
  buretteDispensedMl: number;
  currentPh: number;
  solutionColor: string;
  hasIndicator: boolean;
  isStopcockOpen: boolean;
  flowRateMode: "closed" | "dropwise" | "stream";
  onSetFlowRateMode?: (mode: "closed" | "dropwise" | "stream") => void;
  onSwirlFlask?: () => void;
  ceilingLightsOn: boolean;
  onToggleCeilingLights: () => void;
  heldVessel: LabVesselState | null;
  onDropVessel: () => void;
  onToggleStopcock: () => void;
  onDispenseSingleDrop: () => void;
  onAddIndicator: () => void;
  onResetTitration: () => void;
  onOpenNotebook: () => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
  onOpenRobotMenu?: () => void;
  activeRobotTask?: string;
}

export function ChemistryHUD({
  isInspecting,
  onToggleInspect,
  hoverLabel,
  currentStep,
  totalSteps,
  buretteDispensedMl,
  currentPh,
  solutionColor,
  hasIndicator,
  isStopcockOpen,
  flowRateMode,
  onSetFlowRateMode,
  onSwirlFlask,
  ceilingLightsOn,
  onToggleCeilingLights,
  heldVessel,
  onDropVessel,
  onToggleStopcock,
  onDispenseSingleDrop,
  onAddIndicator,
  onResetTitration,
  onOpenNotebook,
  onToggleAssistant,
  isAssistantOpen,
  onOpenRobotMenu,
  activeRobotTask,
  inspectViewMode = "overview",
  onSetInspectViewMode,
}: ChemistryHUDProps) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    chemistryAudio.setMuted(nextMute);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-6">
      {/* ─────────────────────────────────────────────────────────────
          TOP BAR: BRAND, EXPERIMENT INFO, & ACTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        {/* Top-left: Lab Badge & Experiment Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              MAGE LABS // CHEMISTRY 02
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
              SANDBOX & EXPERIMENT
            </span>
          </div>
          <h1 className="font-display text-sm sm:text-base font-bold text-zinc-300 uppercase tracking-tight">
            EXP 01: VOLUMETRIC ACID–BASE TITRATION & CHEMICAL BENCH
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <span className="text-zinc-400">WASD</span>
            <span>Walk</span>
            <span>·</span>
            <span className="text-zinc-400">Wheel/Z</span>
            <span>Zoom</span>
            <span>·</span>
            <span className="text-zinc-400">C</span>
            <span>Inspect</span>
            <span>·</span>
            <span className="text-zinc-400">R</span>
            <span>Robot / Drop</span>
            <span>·</span>
            <span className="text-zinc-400">E / Click</span>
            <span>Interact</span>
          </div>
        </div>

        {/* Top-right: Controls & Navigation */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* AURA Robot Assistant Trigger Button */}
          {onOpenRobotMenu && (
            <button
              onClick={onOpenRobotMenu}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-all backdrop-blur-md ${
                activeRobotTask && activeRobotTask !== "idle"
                  ? "bg-amber-950/80 border-amber-500/60 text-amber-300 animate-pulse"
                  : "bg-sky-950/60 border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white"
              }`}
              title="AURA Autonomous Lab Robot [Click or Press R]"
            >
              <Bot className="h-3.5 w-3.5 text-sky-400" />
              <span>
                {activeRobotTask && activeRobotTask !== "idle"
                  ? `AURA: ${activeRobotTask.toUpperCase()}`
                  : "AURA ROBOT"}
              </span>
            </button>
          )}

          {/* Light Toggle */}
          <button
            onClick={onToggleCeilingLights}
            className={`p-1.5 rounded border text-xs font-mono transition-all backdrop-blur-md ${
              ceilingLightsOn
                ? "bg-zinc-900 border-zinc-700 text-amber-400"
                : "bg-zinc-950 border-zinc-800 text-zinc-500"
            }`}
            title="Toggle Room Lights"
          >
            {ceilingLightsOn ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mode Switcher: Walk vs Inspect */}
          <button
            onClick={onToggleInspect}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white text-xs font-mono transition-all backdrop-blur-md"
            title="Toggle Inspection Mode [C]"
          >
            {isInspecting ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-amber-400" />
                <span>WALK MODE [C]</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
                <span>INSPECT BENCH [E]</span>
              </>
            )}
          </button>

          {/* Notebook button */}
          <button
            onClick={onOpenNotebook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white text-xs font-mono transition-all backdrop-blur-md"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>NOTEBOOK</span>
          </button>

          {/* Audio Mute toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded bg-zinc-950/90 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all backdrop-blur-md"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Exit lab */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white text-xs font-mono transition-all backdrop-blur-md"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">EXIT</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TOP HELD VESSEL NOTIFICATION (Non-obstructive)
         ───────────────────────────────────────────────────────────── */}
      {heldVessel && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 bg-zinc-950/90 border border-sky-500/40 rounded-full backdrop-blur-md shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-white">
            HOLDING: <strong className="text-sky-300">{heldVessel.name}</strong> ({heldVessel.currentVolumeMl.toFixed(0)} mL, pH {heldVessel.pH.toFixed(1)})
          </span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            · [CLICK TARGET BEAKER OR FLASK TO POUR]
          </span>
          <button
            onClick={onDropVessel}
            className="ml-2 px-2.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono rounded-full flex items-center gap-1 transition-colors"
          >
            <ArrowDownCircle className="h-3 w-3" />
            <span>PLACE BACK [R]</span>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INSPECTION MODE HEADER (Macro angle switcher & guidance)
         ───────────────────────────────────────────────────────────── */}
      {isInspecting && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950/90 border border-sky-500/40 rounded-full backdrop-blur-md shadow-2xl">
            {(["overview", "meniscus", "flask"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onSetInspectViewMode?.(mode)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${
                  inspectViewMode === mode
                    ? "bg-sky-500 text-white font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                }`}
              >
                {mode === "overview"
                  ? "Apparatus Overview"
                  : mode === "meniscus"
                  ? "Meniscus Eye-Level"
                  : "Flask Vortex"}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
            CURSOR UNLOCKED · PRESS [C] TO EXIT INSPECTION
          </span>
        </div>
      )}

      {/* Optical Meniscus Reading Reticle (When in eye-level meniscus macro view) */}
      {isInspecting && inspectViewMode === "meniscus" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-between px-16 z-20 animate-in fade-in duration-300">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-cyan-400" />
          <div className="px-3.5 py-1 bg-zinc-950/95 border border-cyan-400/80 rounded-full font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)] mx-4 backdrop-blur-md">
            MENISCUS LINE: <strong className="text-white font-bold">{buretteDispensedMl.toFixed(2)} mL</strong> (Read bottom curve)
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-400 via-cyan-400/60 to-transparent" />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CENTER: CLEAN RETICLE & CONTEXTUAL RAYCAST TARGET
         ───────────────────────────────────────────────────────────── */}
      {!isInspecting && (
        <div className="my-auto flex flex-col items-center justify-center space-y-2 pointer-events-none">
          {/* Reticle Dot */}
          <div
            className={`h-2 w-2 rounded-full transition-all duration-150 border ${
              hoverLabel
                ? "bg-sky-400 scale-125 border-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                : "bg-white/50 border-white/70"
            }`}
          />

          {/* Hover Prompt */}
          {hoverLabel && (
            <div className="px-3 py-1 rounded bg-black/85 border border-zinc-700 text-white font-mono text-xs tracking-wider backdrop-blur-md shadow-lg animate-fade-in">
              {hoverLabel}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BAR: EXPERIMENT STATUS & INTERACTION DOCK
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        {/* Bottom-left: Active Step & Live Chemistry Telemetry */}
        <div className="space-y-1.5 max-w-lg bg-zinc-950/80 border border-zinc-900 p-3.5 rounded backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>STEP 0{currentStep} / 0{totalSteps}</span>
            <span>·</span>
            <span>
              {currentStep === 1
                ? "INSPECT APPARATUS & PREPARE FLASK"
                : currentStep === 2
                ? "ADD 3 DROPS PHENOLPHTHALEIN"
                : currentStep === 3
                ? "DISPENSE NaOH TITRANT DROPWISE"
                : currentStep === 4
                ? "DETECT FAINT PINK ENDPOINT"
                : "RECORD MEASUREMENT TO NOTEBOOK"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
            <div>
              <span className="text-zinc-500">TITRANT (V): </span>
              <span className="text-white font-bold">{buretteDispensedMl.toFixed(2)} mL</span>
            </div>
            <div>
              <span className="text-zinc-500">pH READOUT: </span>
              <span
                className={`font-bold ${
                  currentPh >= 8.2 && currentPh <= 8.6
                    ? "text-pink-400"
                    : currentPh > 8.6
                    ? "text-fuchsia-400"
                    : "text-sky-400"
                }`}
              >
                {currentPh.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">INDICATOR: </span>
              <span className={hasIndicator ? "text-emerald-400" : "text-amber-400"}>
                {hasIndicator ? "PRESENT" : "MISSING"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-Center / Right: Interactive Titration Controls (when inspecting) */}
        {isInspecting && (
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-lg backdrop-blur-md shadow-2xl">
            {!hasIndicator && (
              <button
                onClick={onAddIndicator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/40 border border-amber-600/70 hover:border-amber-400 text-amber-300 text-xs font-mono transition-all shadow-sm"
              >
                <Droplet className="h-3.5 w-3.5 text-amber-400" />
                <span>ADD INDICATOR</span>
              </button>
            )}

            {/* Single drop button */}
            <button
              onClick={onDispenseSingleDrop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-400 text-zinc-200 hover:text-white text-xs font-mono transition-all group"
              title="Dispense exact single drop (+0.05 mL) [Key 1]"
            >
              <Droplet className="h-3.5 w-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>[1] DROP (+0.05 mL)</span>
            </button>

            {/* Flow Mode Switcher: Dropwise vs Continuous Stream vs Closed */}
            <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded p-0.5 gap-1">
              <button
                onClick={() => onSetFlowRateMode ? onSetFlowRateMode("dropwise") : onToggleStopcock()}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  flowRateMode === "dropwise"
                    ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
                title="Dropwise Flow (~0.5 mL/s) [Key 2]"
              >
                <span>[2] DROPWISE</span>
              </button>

              <button
                onClick={() => onSetFlowRateMode ? onSetFlowRateMode("stream") : onToggleStopcock()}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  flowRateMode === "stream"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
                title="Continuous Stream Flow (~2.5 mL/s) [Key 3]"
              >
                <span>[3] STREAM</span>
              </button>

              <button
                onClick={() => onSetFlowRateMode ? onSetFlowRateMode("closed") : (isStopcockOpen ? onToggleStopcock() : null)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  flowRateMode === "closed"
                    ? "bg-rose-600/90 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
                title="Close Stopcock [Key 4]"
              >
                <Pause className="h-3 w-3" />
                <span>[4] STOP</span>
              </button>
            </div>

            {/* Swirl Flask Button */}
            {onSwirlFlask && (
              <button
                onClick={onSwirlFlask}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-emerald-500 hover:text-emerald-300 text-zinc-300 text-xs font-mono transition-all"
                title="Swirl flask to mix solution thoroughly [Space]"
              >
                <RotateCw className="h-3.5 w-3.5 text-emerald-400" />
                <span>[SPACE] SWIRL</span>
              </button>
            )}

            {/* Reset Flask Button */}
            <button
              onClick={onResetTitration}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all"
              title="Reset Titration Flask"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Bottom-right: AI Lab Assistant trigger */}
        <div className="pointer-events-auto">
          <button
            onClick={onToggleAssistant}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono shadow-2xl backdrop-blur-md transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>● LAB ASSISTANT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
