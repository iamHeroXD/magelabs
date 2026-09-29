"use client";

import React, { useState, useEffect, useRef } from "react";
import { CircuitComponent, WireConnection, CircuitSimulationResult } from "@/lib/experiments/types";
import { labAudio } from "@/lib/audio/sound-effects";

interface LabDebugOverlayProps {
  components: CircuitComponent[];
  wires: WireConnection[];
  simulationResult: CircuitSimulationResult;
  onToggleSwitch?: () => void;
  onAutoWire?: () => void;
  onClearWires?: () => void;
}

export function LabDebugOverlay({
  components,
  wires,
  simulationResult,
  onToggleSwitch,
  onAutoWire,
  onClearWires,
}: LabDebugOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // Listen for ~ or ` key to toggle debug HUD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Frame rate monitor
  useEffect(() => {
    let animId: number;
    const calculateFps = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 500) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };
    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-3 right-3 z-50 rounded bg-zinc-900/80 px-2 py-1 text-[10px] font-mono text-zinc-500 hover:text-zinc-200 border border-zinc-800 shadow backdrop-blur cursor-pointer"
        title="Press ` or ~ to toggle physics debug overlay"
      >
        [~] Debug HUD ({fps} FPS)
      </button>
    );
  }

  // Calculate Kirchhoff junction residual
  let totalBranchCurrents = 0;
  Object.values(simulationResult.componentReadings).forEach((r) => {
    totalBranchCurrents += r.current;
  });

  return (
    <div className="fixed bottom-3 right-3 z-50 w-96 rounded-xl border border-cyan-800/60 bg-zinc-950/95 p-4 text-xs font-mono text-zinc-300 shadow-2xl backdrop-blur-md select-none max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-400 uppercase tracking-wider">MageLabs Physics HUD</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${fps >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
            {fps} FPS
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-500 hover:text-zinc-200 cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Physics Nodal Solver Diagnostics */}
      <div className="space-y-2 mb-3">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
          Nodal Circuit Solver
        </div>
        <div className="grid grid-cols-2 gap-1.5 bg-zinc-900/70 p-2 rounded border border-zinc-800/80 text-[11px]">
          <div>
            <span className="text-zinc-500">Loop State: </span>
            <span className={simulationResult.isClosedCircuit ? "text-emerald-400" : "text-amber-400 font-semibold"}>
              {simulationResult.isClosedCircuit ? "CLOSED LOOP" : "OPEN / BROKEN"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Total V: </span>
            <span className="text-zinc-200 font-semibold">{simulationResult.totalVoltage.toFixed(2)} V</span>
          </div>
          <div>
            <span className="text-zinc-500">Total Current: </span>
            <span className="text-cyan-400 font-semibold">{simulationResult.totalCurrent.toFixed(3)} A</span>
          </div>
          <div>
            <span className="text-zinc-500">Eq Resistance: </span>
            <span className="text-zinc-200 font-semibold">
              {simulationResult.equivalentResistance === Infinity ? "∞" : simulationResult.equivalentResistance.toFixed(2)} Ω
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Ammeter: </span>
            <span className="text-cyan-300 font-semibold">{simulationResult.ammeterReading.toFixed(3)} A</span>
          </div>
          <div>
            <span className="text-zinc-500">Voltmeter: </span>
            <span className="text-amber-400 font-semibold">{simulationResult.voltmeterReading.toFixed(2)} V</span>
          </div>
        </div>
      </div>

      {/* Component Branches & Power */}
      <div className="space-y-1 mb-3">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
          Branch Loads ({components.length})
        </div>
        <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
          {components.map((c) => {
            const rd = simulationResult.componentReadings[c.id];
            return (
              <div
                key={c.id}
                className="flex items-center justify-between bg-zinc-900/50 px-2 py-1 rounded text-[10.5px] border border-zinc-800/50"
              >
                <span className="text-zinc-300 truncate max-w-[120px]">{c.name}</span>
                <span className="text-zinc-400">
                  {rd ? `${rd.voltageDrop.toFixed(2)}V · ${rd.current.toFixed(2)}A · ${rd.power.toFixed(2)}W` : "Passive"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wire Topology */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
          <span>Patch Cables ({wires.length})</span>
          <div className="flex gap-2">
            <button
              onClick={onAutoWire}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer text-[10px]"
            >
              Auto-Wire
            </button>
            <button
              onClick={onClearWires}
              className="text-red-400 hover:text-red-300 cursor-pointer text-[10px]"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="space-y-0.5 max-h-20 overflow-y-auto text-[10px] text-zinc-500">
          {wires.map((w) => (
            <div key={w.id} className="flex items-center justify-between font-mono">
              <span style={{ color: w.color }}>● {w.fromTerminalId}</span>
              <span>↔</span>
              <span style={{ color: w.color }}>{w.toTerminalId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Engine Diagnostics & Controls */}
      <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-[10.5px]">
        <span className="text-zinc-500">Web Audio Synthesizer:</span>
        <button
          onClick={() => labAudio.setMuted(!labAudio.getIsMuted())}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
            labAudio.getIsMuted()
              ? "bg-red-950/60 border-red-800 text-red-400"
              : "bg-emerald-950/60 border-emerald-800 text-emerald-400"
          }`}
        >
          {labAudio.getIsMuted() ? "MUTED" : "ACTIVE (24-bit)"}
        </button>
      </div>
    </div>
  );
}
