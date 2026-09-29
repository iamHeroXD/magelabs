"use client";

import { useState } from "react";
import { BookOpen, Plus, Download, Trash2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeasurementRecord, CircuitSimulationResult } from "@/lib/experiments/types";

interface LabNotebookProps {
  simulationResult: CircuitSimulationResult;
  records: MeasurementRecord[];
  onAddRecord: (rec: MeasurementRecord) => void;
  onClearRecords: () => void;
  onClose?: () => void;
}

export function LabNotebook({
  simulationResult,
  records,
  onAddRecord,
  onClearRecords,
  onClose,
}: LabNotebookProps) {
  const [studentNotes, setStudentNotes] = useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem("magelabs_ohms_notes") || ""
      : ""
  );
  const [justLogged, setJustLogged] = useState(false);

  const handleLogData = () => {
    const v = simulationResult.totalVoltage;
    const i = simulationResult.totalCurrent;
    const rCalc = i > 0 ? Math.round((v / i) * 100) / 100 : 0;

    const newRecord: MeasurementRecord = {
      id: `rec_${Date.now()}`,
      timestamp: Date.now(),
      voltage: v,
      current: i,
      resistanceCalculated: rCalc,
    };

    onAddRecord(newRecord);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  const handleNotesChange = (text: string) => {
    setStudentNotes(text);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("magelabs_ohms_notes", text);
    }
  };

  const exportCSV = () => {
    if (records.length === 0) return;
    const header = "Trial,Timestamp,Voltage (V),Current (A),Calculated Resistance (Ohms)\n";
    const rows = records
      .map(
        (r, idx) =>
          `${idx + 1},${new Date(r.timestamp).toISOString()},${r.voltage},${r.current},${r.resistanceCalculated}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `magelabs_ohms_law_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-96 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-zinc-100 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-400" />
          <h3 className="font-display font-semibold text-sm">Experimental Notebook</h3>
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

      {/* Quick Action: Log Current Bench State */}
      <Button
        variant={justLogged ? "amber" : "primary"}
        onClick={handleLogData}
        className="w-full gap-2 h-10 font-mono text-xs mb-4 transition-all"
      >
        {justLogged ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-950" />
            Measurement Logged!
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Log Current Reading ({simulationResult.totalVoltage.toFixed(1)}V, {simulationResult.totalCurrent.toFixed(3)}A)
          </>
        )}
      </Button>

      {/* Data Table */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden mb-4">
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase">
              <tr>
                <th className="px-2.5 py-1.5">#</th>
                <th className="px-2.5 py-1.5">V (V)</th>
                <th className="px-2.5 py-1.5">I (A)</th>
                <th className="px-2.5 py-1.5">R (Ω)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-zinc-500 italic">
                    No measurements logged yet. Apply voltage and click Log Reading above.
                  </td>
                </tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-zinc-800/40">
                    <td className="px-2.5 py-1.5 text-zinc-500">{idx + 1}</td>
                    <td className="px-2.5 py-1.5 text-amber-400">{rec.voltage.toFixed(1)}</td>
                    <td className="px-2.5 py-1.5 text-cyan-400">{rec.current.toFixed(3)}</td>
                    <td className="px-2.5 py-1.5 text-emerald-400">{rec.resistanceCalculated.toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notebook Actions */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          disabled={records.length === 0}
          className="flex-1 gap-1.5 text-xs text-zinc-300"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearRecords}
          disabled={records.length === 0}
          className="gap-1.5 text-xs text-red-400 hover:text-red-300 border-zinc-800 hover:border-red-900"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Observation Notes */}
      <div>
        <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1.5">
          Observation & Hypothesis Log
        </label>
        <textarea
          rows={3}
          value={studentNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="e.g. As voltage increases from 6V to 18V, current increases proportionally from 0.6A to 1.8A, confirming V = IR..."
          className="w-full rounded-md border border-zinc-800 bg-zinc-900/90 p-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 resize-none"
        />
      </div>
    </div>
  );
}
