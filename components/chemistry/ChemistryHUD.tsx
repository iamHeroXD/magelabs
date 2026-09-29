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
  Sparkles,
  Sun,
  Moon,
  ArrowDownCircle,
  Bot,
} from "lucide-react";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";
import { useState } from "react";
import { LabVesselState } from "./equipment/InteractiveVessels";

interface ChemistryHUDProps {
  isInspecting: boolean;
  onToggleInspect: () => void;
  hoverLabel: string | null;
  currentStep: number;
  totalSteps: number;
  buretteDispensedMl: number;
  currentPh: number;
  solutionColor: string;
  hasIndicator: boolean;
  isStopcockOpen: boolean;
  flowRateMode: "closed" | "dropwise" | "stream";
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
          CENTER: RETICLE & CONTEXTUAL RAYCAST TARGET
         ───────────────────────────────────────────────────────────── */}
      <div className="my-auto flex flex-col items-center justify-center space-y-3">
        {/* Reticle Dot */}
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all duration-200 border ${
            hoverLabel || heldVessel
              ? "bg-white scale-150 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              : "bg-white/40 border-white/60"
          }`}
        />

        {/* Hover Prompt */}
        {hoverLabel && !heldVessel && (
          <div className="px-3 py-1 rounded bg-black/80 border border-zinc-700 text-white font-mono text-xs tracking-wider backdrop-blur-md animate-fade-in">
            {hoverLabel}
          </div>
        )}

        {/* Held Vessel Status Banner */}
        {heldVessel && (
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950/95 border border-zinc-700 rounded-md backdrop-blur-md shadow-2xl pointer-events-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-white">
              HOLDING: <strong className="text-sky-300">{heldVessel.name}</strong> ({heldVessel.currentVolumeMl.toFixed(0)} mL, pH {heldVessel.pH.toFixed(1)})
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              · [CLICK TARGET BEAKER TO POUR]
            </span>
            <button
              onClick={onDropVessel}
              className="ml-2 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono rounded flex items-center gap-1"
            >
              <ArrowDownCircle className="h-3 w-3" />
              <span>PLACE BACK [R]</span>
            </button>
          </div>
        )}
      </div>

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
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-zinc-950/90 border border-zinc-800 p-2 rounded backdrop-blur-md">
            {!hasIndicator && (
              <button
                onClick={onAddIndicator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-amber-600/60 hover:border-amber-400 text-amber-300 text-xs font-mono transition-all"
              >
                <Droplet className="h-3.5 w-3.5 text-amber-400" />
                <span>ADD INDICATOR</span>
              </button>
            )}

            <button
              onClick={onDispenseSingleDrop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-200 hover:text-white text-xs font-mono transition-all"
            >
              <Droplet className="h-3.5 w-3.5 text-sky-400" />
              <span>SINGLE DROP (+0.05 mL)</span>
            </button>

            <button
              onClick={onToggleStopcock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                isStopcockOpen
                  ? "bg-rose-600 text-white border border-rose-500 hover:bg-rose-500"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {isStopcockOpen ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>CLOSE STOPCOCK</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>OPEN STOPCOCK (FLOW)</span>
                </>
              )}
            </button>

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
