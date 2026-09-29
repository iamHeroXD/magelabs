"use client";

import React from "react";
import {
  Bot,
  Play,
  Flame,
  RotateCw,
  Sparkles,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Activity,
  Volume2,
} from "lucide-react";
import { RobotTask } from "./LabRobotAvatar3D";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface RobotMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask: RobotTask;
  onSelectTask: (task: RobotTask) => void;
  onAbortTask: () => void;
  currentPh: number;
  dispensedMl: number;
}

export function RobotMenuModal({
  isOpen,
  onClose,
  activeTask,
  onSelectTask,
  onAbortTask,
  currentPh,
  dispensedMl,
}: RobotMenuModalProps) {
  if (!isOpen) return null;

  const tasks: {
    id: RobotTask;
    title: string;
    badge: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    duration: string;
    color: string;
  }[] = [
    {
      id: "titrating",
      title: "Autonomous Acid-Base Titration",
      badge: "Flagship Experiment",
      description:
        "AURA navigates to the burette stand, introduces phenolphthalein indicator, opens stopcock, and dispenses precisely 25.0 mL 0.1M NaOH to reach the stoichiometric equivalence point (pH 8.2).",
      icon: Play,
      duration: "~8 sec",
      color: "border-sky-500/40 text-sky-400 bg-sky-950/20",
    },
    {
      id: "heating",
      title: "Heat & Dissolve Reagent on Hotplate",
      badge: "Thermal Reaction",
      description:
        "AURA approaches the magnetic hotplate stirrer, powers thermal coils to 85°C, engages magnetic flea at 450 RPM, and accelerates dissolution of Copper(II) Sulfate.",
      icon: Flame,
      duration: "~6 sec",
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20",
    },
    {
      id: "centrifuging",
      title: "Centrifuge High-Speed Separation",
      badge: "Fractionation",
      description:
        "AURA inspects benchtop centrifuge balance, latches the acrylic safety dome, and executes an 8,000 RPM sedimentation cycle to separate suspended precipitates.",
      icon: RotateCw,
      duration: "~6 sec",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20",
    },
    {
      id: "cleaning",
      title: "Sanitize & Calibrate Workstation",
      badge: "Bench Reset",
      description:
        "Flushes analytical glassware with deionized water, zeroes the digital analytical balance, returns all reagent bottles, and re-primes the volumetric buret.",
      icon: RefreshCw,
      duration: "~4 sec",
      color: "border-purple-500/40 text-purple-400 bg-purple-950/20",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-sky-500/30 bg-[#090b10] text-zinc-100 shadow-2xl shadow-sky-950/40">
        {/* Glow Header Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-semibold tracking-wider text-white">
                  AURA // AUTONOMOUS LAB ROBOT
                </h3>
                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-500/20">
                  SYS v2.4 ONLINE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Interactive autonomous chemical robotics assistant & protocol executor
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              chemistryAudio.playStopcockClick();
              onClose();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Robot Telemetry Status Bar */}
        <div className="grid grid-cols-4 border-b border-zinc-800/60 bg-[#0d1017] px-6 py-2.5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>CORE: <span className="text-emerald-400">NOMINAL</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span>ACTIVE TASK: <span className="text-sky-300">{activeTask.toUpperCase()}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>BENCH pH: <span className="text-amber-300">{currentPh.toFixed(2)}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>DISPENSED: <span className="text-purple-300">{dispensedMl.toFixed(1)} mL</span></span>
          </div>
        </div>

        {/* Active Task Banner */}
        {activeTask !== "idle" && (
          <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-950/20 px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>
              <span className="text-xs font-mono font-medium text-amber-200">
                AURA is actively executing: <strong className="uppercase">{activeTask}</strong>...
              </span>
            </div>
            <button
              onClick={() => {
                chemistryAudio.playStopcockClick();
                onAbortTask();
              }}
              className="rounded border border-red-500/40 bg-red-950/30 px-3 py-1 text-xs font-mono text-red-300 hover:bg-red-900/40 transition-colors"
            >
              ABORT TASK
            </button>
          </div>
        )}

        {/* Task Selection Grid */}
        <div className="max-h-[55vh] overflow-y-auto p-6 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Select Autonomous Protocol:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tasks.map((task) => {
              const Icon = task.icon;
              const isSelected = activeTask === task.id;

              return (
                <div
                  key={task.id}
                  className={`group relative flex flex-col justify-between rounded-lg border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-sky-400 bg-sky-950/30 shadow-lg shadow-sky-900/20"
                      : "border-zinc-800 bg-[#0d1117] hover:border-zinc-700 hover:bg-[#121721]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded border ${task.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
                            {task.title}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Est. {task.duration}
                          </span>
                        </div>
                      </div>
                      <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                        {task.badge}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-zinc-400 mb-3">
                      {task.description}
                    </p>
                  </div>

                  <button
                    disabled={activeTask !== "idle" && !isSelected}
                    onClick={() => {
                      chemistryAudio.playBeep();
                      onSelectTask(task.id);
                      onClose();
                    }}
                    className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded py-2 text-xs font-mono font-medium transition-all ${
                      isSelected
                        ? "border border-amber-400 bg-amber-500/20 text-amber-200 cursor-default"
                        : activeTask !== "idle"
                        ? "cursor-not-allowed opacity-40 bg-zinc-800 text-zinc-500"
                        : "border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500 hover:text-black"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Activity className="h-3.5 w-3.5 animate-pulse" />
                        <span>RUNNING PROTOCOL...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>DEPLOY AURA TO TASK</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with AI debrief quick trigger */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#0b0e14] px-6 py-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Volume2 className="h-4 w-4 text-sky-400" />
            <span>AURA voice synthesized guidance active</span>
          </div>
          <button
            onClick={() => {
              chemistryAudio.playStopcockClick();
              onClose();
            }}
            className="rounded border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
