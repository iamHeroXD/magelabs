"use client";

import { Sliders, Zap, Power, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CircuitControlsProps {
  voltage: number;
  resistance: number;
  isSwitchOpen: boolean;
  onVoltageChange: (voltage: number) => void;
  onResistanceChange: (resistance: number) => void;
  onToggleSwitch: () => void;
  onClose?: () => void;
}

const RESISTANCE_PRESETS = [10, 20, 50, 100, 220, 500, 1000];
const VOLTAGE_PRESETS = [0, 3, 6, 9, 12, 18, 24];

export function CircuitControls({
  voltage,
  resistance,
  isSwitchOpen,
  onVoltageChange,
  onResistanceChange,
  onToggleSwitch,
  onClose,
}: CircuitControlsProps) {
  return (
    <div className="w-80 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-zinc-100 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-semibold text-sm">Circuit Controls</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Knife Switch Section */}
        <div>
          <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center justify-between">
            <span>Knife Switch</span>
            <span className={isSwitchOpen ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {isSwitchOpen ? "OPEN (INTERRUPTED)" : "CLOSED (CONDUCTING)"}
            </span>
          </label>
          <Button
            variant={isSwitchOpen ? "danger" : "amber"}
            onClick={onToggleSwitch}
            className="w-full mt-2 gap-2 h-10 font-mono text-xs uppercase"
          >
            <Power className="h-4 w-4" />
            {isSwitchOpen ? "Click to Close Switch" : "Click to Open Switch"}
          </Button>
        </div>

        {/* Power Supply Voltage Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-zinc-400 uppercase tracking-wider">Power Supply Voltage</span>
            <span className="text-amber-400 font-bold text-sm">{voltage.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={voltage}
            onChange={(e) => onVoltageChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="grid grid-cols-4 gap-1 mt-2">
            {VOLTAGE_PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => onVoltageChange(v)}
                className={`py-1 rounded text-[11px] font-mono transition-colors border ${
                  Math.abs(voltage - v) < 0.2
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>

        {/* Resistor Resistance Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-zinc-400 uppercase tracking-wider">Resistor Resistance</span>
            <span className="text-cyan-400 font-bold text-sm">{resistance} Ω</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {RESISTANCE_PRESETS.map((r) => (
              <button
                key={r}
                onClick={() => onResistanceChange(r)}
                className={`py-1.5 rounded text-[11px] font-mono transition-colors border ${
                  resistance === r
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 font-bold"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {r >= 1000 ? `${r / 1000}kΩ` : `${r}Ω`}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono">
            4-band EIA color code rings automatically repaint in real time on the 3D resistor.
          </p>
        </div>
      </div>
    </div>
  );
}
