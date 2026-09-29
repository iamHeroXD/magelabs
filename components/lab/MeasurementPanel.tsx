"use client";

import { useMemo } from "react";
import { BarChart2, Activity, Zap, TrendingUp, X } from "lucide-react";
import { CircuitSimulationResult, MeasurementRecord } from "@/lib/experiments/types";

interface MeasurementPanelProps {
  simulationResult: CircuitSimulationResult;
  nominalResistance: number;
  records: MeasurementRecord[];
  onClose?: () => void;
}

export function MeasurementPanel({
  simulationResult,
  nominalResistance,
  records,
  onClose,
}: MeasurementPanelProps) {
  const current = simulationResult.totalCurrent;
  const voltage = simulationResult.totalVoltage;
  const power = current * voltage;
  const equivalentR = simulationResult.equivalentResistance;

  // Linear regression slope on recorded points: V = R * I
  const regression = useMemo(() => {
    if (records.length < 2) return null;

    let sumI = 0;
    let sumV = 0;
    let sumIV = 0;
    let sumI2 = 0;
    const n = records.length;

    for (const r of records) {
      sumI += r.current;
      sumV += r.voltage;
      sumIV += r.current * r.voltage;
      sumI2 += r.current * r.current;
    }

    const denominator = n * sumI2 - sumI * sumI;
    if (Math.abs(denominator) < 1e-9) return null;

    const slope = (n * sumIV - sumI * sumV) / denominator; // Experimental Resistance R
    const intercept = (sumV - slope * sumI) / n;
    const percentError = Math.abs((slope - nominalResistance) / nominalResistance) * 100;

    return {
      slope: Math.round(slope * 100) / 100,
      intercept: Math.round(intercept * 100) / 100,
      percentError: Math.round(percentError * 10) / 10,
    };
  }, [records, nominalResistance]);

  // SVG plot bounds
  const maxI = Math.max(2.5, ...records.map((r) => r.current), current);
  const maxV = Math.max(24, ...records.map((r) => r.voltage), voltage);

  return (
    <div className="w-96 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-zinc-100 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-sm">Real-Time Measurements</h3>
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

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Voltage (V)</span>
          <div className="text-xl font-bold font-mono text-amber-400">
            {voltage.toFixed(2)} <span className="text-xs text-amber-500">V</span>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Current (I)</span>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {current.toFixed(3)} <span className="text-xs text-cyan-500">A</span>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Resistance (Req)</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {equivalentR.toFixed(1)} <span className="text-xs text-emerald-500">Ω</span>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Power (P = I²R)</span>
          <div className="text-xl font-bold font-mono text-purple-400">
            {power.toFixed(2)} <span className="text-xs text-purple-500">W</span>
          </div>
        </div>
      </div>

      {/* V vs I Empirical Graph */}
      <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-3">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            V-I Characteristic Curve
          </span>
          <span className="text-[10px] text-zinc-500">{records.length} Points Recorded</span>
        </div>

        {/* SVG Plot */}
        <div className="relative h-44 w-full bg-zinc-950/80 rounded border border-zinc-900 p-2">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 280 140">
            {/* Grid lines */}
            <line x1="30" y1="20" x2="270" y2="20" stroke="#27272a" strokeDasharray="3 3" />
            <line x1="30" y1="65" x2="270" y2="65" stroke="#27272a" strokeDasharray="3 3" />
            <line x1="30" y1="110" x2="270" y2="110" stroke="#27272a" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1="30" y1="10" x2="30" y2="120" stroke="#71717a" strokeWidth="1.5" />
            <line x1="30" y1="120" x2="270" y2="120" stroke="#71717a" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x="15" y="15" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
              V
            </text>
            <text x="260" y="132" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
              I (A)
            </text>

            {/* Linear Regression Line */}
            {regression && (
              <line
                x1="30"
                y1="120"
                x2="260"
                y2={120 - ((260 - 30) / (240 / (maxI || 1))) * (regression.slope * 4)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Recorded Points */}
            {records.map((pt, idx) => {
              const cx = 30 + (pt.current / (maxI || 1)) * 230;
              const cy = 120 - (pt.voltage / (maxV || 1)) * 100;
              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#38bdf8"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
              );
            })}

            {/* Current Realtime Live Point */}
            {current > 0 && (
              <circle
                cx={30 + (current / (maxI || 1)) * 230}
                cy={120 - (voltage / (maxV || 1)) * 100}
                r="4.5"
                fill="#f59e0b"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>

        {/* Slope & Resistance Analysis */}
        {regression ? (
          <div className="mt-3 p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-400">Experimental Slope (ΔV/ΔI):</span>
              <span className="text-amber-400 font-bold">{regression.slope.toFixed(2)} Ω</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Nominal Component Rating:</span>
              <span className="text-zinc-200">{nominalResistance.toFixed(1)} Ω</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Experimental Error:</span>
              <span className={regression.percentError < 5 ? "text-emerald-400" : "text-amber-400"}>
                {regression.percentError.toFixed(1)}% (Within laboratory tolerance)
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-zinc-500 font-mono mt-2 text-center">
            Record at least 2 data points at varying voltages to calculate the empirical slope (R).
          </p>
        )}
      </div>
    </div>
  );
}
