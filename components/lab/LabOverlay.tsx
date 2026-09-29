"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  BookOpen,
  BarChart2,
  Activity,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraPreset } from "../3d/LabCamera";
import { CircuitSimulationResult } from "@/lib/experiments/types";

interface LabOverlayProps {
  title: string;
  subject: string;
  simulationResult: CircuitSimulationResult;
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
  onResetExperiment: () => void;
  onAutoWire: () => void;
  activePanel: "controls" | "measurements" | "notebook" | "wires" | null;
  setActivePanel: (panel: "controls" | "measurements" | "notebook" | "wires" | null) => void;
}

export function LabOverlay({
  title,
  subject,
  simulationResult,
  cameraPreset,
  onCameraChange,
  onResetExperiment,
  onAutoWire,
  activePanel,
  setActivePanel,
}: LabOverlayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const getStatusBadge = () => {
    if (simulationResult.isShortCircuit) {
      return (
        <Badge variant="danger" className="animate-pulse flex items-center gap-1.5 py-1 px-3">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          SHORT CIRCUIT DANGER
        </Badge>
      );
    }
    if (simulationResult.isClosedCircuit) {
      return (
        <Badge variant="success" className="flex items-center gap-1.5 py-1 px-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          CIRCUIT ENERGIZED ({simulationResult.totalCurrent.toFixed(3)} A)
        </Badge>
      );
    }
    if (simulationResult.isOpenSwitch) {
      return (
        <Badge variant="amber" className="flex items-center gap-1.5 py-1 px-3">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          SWITCH OPEN
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-3">
        <span className="h-2 w-2 rounded-full bg-zinc-500" />
        OPEN LOOP (WIRING INCOMPLETE)
      </Badge>
    );
  };

  return (
    <>
      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-transparent pointer-events-none">
        {/* Left: Back button & Lab details */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="h-9 px-2.5 gap-1 text-zinc-300">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Lab</span>
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-zinc-100">{title}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {subject}
              </span>
            </div>
            <div className="mt-0.5">{getStatusBadge()}</div>
          </div>
        </div>

        {/* Center: Camera Presets */}
        <div className="hidden md:flex items-center gap-1 rounded-lg bg-zinc-900/80 p-1 border border-zinc-800 pointer-events-auto backdrop-blur-md">
          <span className="text-[11px] font-mono text-zinc-400 px-2 flex items-center gap-1">
            <Camera className="h-3 w-3" /> View:
          </span>
          <button
            onClick={() => onCameraChange("default")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              cameraPreset === "default"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onCameraChange("top")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              cameraPreset === "top"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Top-Down
          </button>
          <button
            onClick={() => onCameraChange("circuit")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              cameraPreset === "circuit"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Circuit
          </button>
          <button
            onClick={() => onCameraChange("multimeter")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              cameraPreset === "multimeter"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Meters
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoWire}
            title="Auto-wire standard test circuit"
            className="hidden sm:inline-flex gap-1.5 text-xs text-zinc-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Auto-Wire
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetExperiment}
            title="Reset circuit apparatus"
            className="h-9 px-2.5 text-zinc-300"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="h-9 px-2.5 text-zinc-300"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Floating Panel Navigation Dock (Left side) */}
      <div className="absolute left-4 top-24 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => setActivePanel(activePanel === "controls" ? null : "controls")}
          className={`flex items-center gap-2 p-2.5 rounded-lg border backdrop-blur-md transition-all shadow-lg ${
            activePanel === "controls"
              ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
              : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          }`}
          title="Circuit Controls"
        >
          <Sliders className="h-5 w-5" />
          <span className="hidden xl:inline text-xs font-medium">Controls</span>
        </button>

        <button
          onClick={() => setActivePanel(activePanel === "measurements" ? null : "measurements")}
          className={`flex items-center gap-2 p-2.5 rounded-lg border backdrop-blur-md transition-all shadow-lg ${
            activePanel === "measurements"
              ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
              : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          }`}
          title="Measurements & V-I Graph"
        >
          <BarChart2 className="h-5 w-5" />
          <span className="hidden xl:inline text-xs font-medium">Measurements</span>
        </button>

        <button
          onClick={() => setActivePanel(activePanel === "notebook" ? null : "notebook")}
          className={`flex items-center gap-2 p-2.5 rounded-lg border backdrop-blur-md transition-all shadow-lg ${
            activePanel === "notebook"
              ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
              : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          }`}
          title="Lab Notebook & Data Logging"
        >
          <BookOpen className="h-5 w-5" />
          <span className="hidden xl:inline text-xs font-medium">Notebook</span>
        </button>

        <button
          onClick={() => setActivePanel(activePanel === "wires" ? null : "wires")}
          className={`flex items-center gap-2 p-2.5 rounded-lg border backdrop-blur-md transition-all shadow-lg ${
            activePanel === "wires"
              ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
              : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          }`}
          title="Patch Cable Routing"
        >
          <Layers className="h-5 w-5" />
          <span className="hidden xl:inline text-xs font-medium">Wiring</span>
        </button>
      </div>
    </>
  );
}
