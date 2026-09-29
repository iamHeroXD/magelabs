"use client";

import { X, Plus, Trash2, LineChart, FileText } from "lucide-react";
import { TitrationTrial } from "@/lib/chemistry/types";
import { calculateTitrationEquilibrium } from "@/lib/chemistry/engine";
import { useMemo } from "react";

interface ChemistryNotebookProps {
  isOpen: boolean;
  onClose: () => void;
  trials: TitrationTrial[];
  onAddTrial: () => void;
  onClearTrials: () => void;
  currentDispensedMl: number;
  currentPh: number;
}

export function ChemistryNotebook({
  isOpen,
  onClose,
  trials,
  onAddTrial,
  onClearTrials,
  currentDispensedMl,
  currentPh,
}: ChemistryNotebookProps) {
  // Generate theoretical titration curve data points for graphing
  const curvePoints = useMemo(() => {
    const pts: { v: number; ph: number }[] = [];
    for (let v = 0; v <= 45; v += 0.5) {
      const eq = calculateTitrationEquilibrium(v, 25.0, 0.100, 0.100, true);
      pts.push({ v, ph: eq.pH });
    }
    return pts;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-8 animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden text-zinc-200 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              LABORATORY NOTEBOOK // SECTION 01
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notebook Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-xs">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-zinc-900 bg-zinc-950/60 p-4 rounded font-mono text-[11px]">
            <div>
              <span className="text-zinc-500 block">EXPERIMENT:</span>
              <span className="text-white font-semibold">Strong Acid–Strong Base Titration</span>
            </div>
            <div>
              <span className="text-zinc-500 block">ANALYTE / TITRANT:</span>
              <span className="text-zinc-300">25.0 mL HCl / 0.100 M NaOH</span>
            </div>
            <div>
              <span className="text-zinc-500 block">INDICATOR:</span>
              <span className="text-pink-400">Phenolphthalein (1% Solution)</span>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-1.5">
            <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-400 uppercase">
              1. OBJECTIVE & STOICHIOMETRY
            </h3>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Determine the molar concentration of an unknown hydrochloric acid sample by titrating against a standardized 0.100 M sodium hydroxide solution until reaching the permanent faint pink stoichiometric endpoint.
            </p>
            <div className="mt-2 font-mono text-[11px] p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded inline-block">
              HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) &nbsp;|&nbsp; M_acid = (M_base × V_base) / V_acid
            </div>
          </div>

          {/* Observation Data Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-400 uppercase">
                2. EMPIRICAL OBSERVATION TABLE
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddTrial}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-black font-mono font-semibold text-[11px] hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>RECORD CURRENT BENCH READING</span>
                </button>
                {trials.length > 0 && (
                  <button
                    onClick={onClearTrials}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Clear Observations"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {trials.length === 0 ? (
              <div className="p-6 border border-dashed border-zinc-800 text-center font-mono text-zinc-600 rounded">
                No trials recorded yet. Open the stopcock, reach the faint pink endpoint, and click "Record Current Bench Reading".
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-900 rounded">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Trial</th>
                      <th className="py-2.5 px-3">Initial (mL)</th>
                      <th className="py-2.5 px-3">Final (mL)</th>
                      <th className="py-2.5 px-3">V_NaOH (mL)</th>
                      <th className="py-2.5 px-3">Endpoint pH</th>
                      <th className="py-2.5 px-3">Calc Molarity (M)</th>
                      <th className="py-2.5 px-3">Appearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {trials.map((t) => (
                      <tr key={t.trialNumber} className="hover:bg-zinc-900/30">
                        <td className="py-2 px-3 font-bold text-white">0{t.trialNumber}</td>
                        <td className="py-2 px-3">{t.initialBuretteMl.toFixed(2)}</td>
                        <td className="py-2 px-3">{t.finalBuretteMl.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sky-400 font-semibold">
                          {t.titrantUsedMl.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-pink-400 font-bold">{t.endpointPh.toFixed(2)}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">
                          {t.calculatedMolarity.toFixed(4)} M
                        </td>
                        <td className="py-2 px-3 text-zinc-400">{t.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Titration Curve Graph */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-zinc-400" />
              <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-400 uppercase">
                3. TITRATION CURVE (pH vs. NaOH VOLUME)
              </h3>
            </div>

            <div className="p-4 border border-zinc-900 bg-zinc-950 rounded space-y-2">
              <div className="h-48 w-full relative flex items-end">
                <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="10" x2="480" y2="10" stroke="#27272a" strokeDasharray="3 3" />
                  <line x1="40" y1="90" x2="480" y2="90" stroke="#3f3f46" strokeDasharray="3 3" />
                  <line x1="40" y1="160" x2="480" y2="160" stroke="#27272a" />
                  <line x1="40" y1="10" x2="40" y2="160" stroke="#27272a" />
                  {/* Equivalence point line (V = 25 mL) */}
                  <line
                    x1={40 + (25 / 50) * 440}
                    y1="10"
                    x2={40 + (25 / 50) * 440}
                    y2="160"
                    stroke="#0284c7"
                    strokeDasharray="4 4"
                  />

                  {/* Phenolphthalein Transition Band (pH 8.2 - 10.0) */}
                  <rect
                    x="40"
                    y={160 - (10.0 / 14) * 150}
                    width="440"
                    height={(1.8 / 14) * 150}
                    fill="#f472b6"
                    opacity="0.12"
                  />

                  {/* Theoretical Equilibrium Titration Curve Line */}
                  <path
                    d={curvePoints
                      .map((p, idx) => {
                        const x = 40 + (p.v / 50) * 440;
                        const y = 160 - (p.ph / 14) * 150;
                        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#e4e4e7"
                    strokeWidth="2"
                  />

                  {/* Current Real-time Point on curve */}
                  <circle
                    cx={40 + (Math.min(50, currentDispensedMl) / 50) * 440}
                    cy={160 - (Math.min(14, currentPh) / 14) * 150}
                    r="5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-900">
                <span>0.0 mL NaOH</span>
                <span className="text-sky-400 font-bold">V_eq = 25.0 mL (Equivalence pH = 7.0)</span>
                <span>50.0 mL NaOH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-900 bg-zinc-950 flex justify-between items-center text-[11px] font-mono text-zinc-500">
          <span>MAGELABS EMPIRICAL ENGINE · STOICHIOMETRY VERIFIED</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded transition-colors"
          >
            RETURN TO LAB
          </button>
        </div>
      </div>
    </div>
  );
}
