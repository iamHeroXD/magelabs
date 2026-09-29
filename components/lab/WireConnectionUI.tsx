"use client";

import { Layers, Trash2, Check, AlertCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WireConnection, CircuitComponent } from "@/lib/experiments/types";

interface WireConnectionUIProps {
  wires: WireConnection[];
  components: CircuitComponent[];
  onDisconnectWire: (wireId: string) => void;
  onClearWires: () => void;
  onAutoWire: () => void;
  onClose?: () => void;
}

export function WireConnectionUI({
  wires,
  components,
  onDisconnectWire,
  onClearWires,
  onAutoWire,
  onClose,
}: WireConnectionUIProps) {
  // Map terminal id to component & terminal name for friendly display
  const getTerminalLabel = (termId: string) => {
    for (const comp of components) {
      const term = comp.terminals.find((t) => t.id === termId);
      if (term) {
        return `${comp.name.split(" ")[0]} (${term.label})`;
      }
    }
    return termId;
  };

  return (
    <div className="w-88 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-zinc-100 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-sm">Workbench Patch Cables</h3>
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

      {/* Wire count & auto-wire */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono">
        <span className="text-zinc-400">{wires.length} Wires Connected</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoWire}
          className="h-7 text-[11px] gap-1 px-2 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
        >
          <Sparkles className="h-3 w-3" />
          Auto-Route All
        </Button>
      </div>

      {/* Active Wires List */}
      <div className="max-h-56 overflow-y-auto space-y-1.5 mb-4 pr-1">
        {wires.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">
            No patch cables connected. Click any terminal post in the 3D scene to start routing.
          </div>
        ) : (
          wires.map((wire, idx) => (
            <div
              key={wire.id}
              className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border border-black/40 shadow-sm shrink-0"
                  style={{ backgroundColor: wire.color }}
                />
                <span className="text-zinc-300">
                  {getTerminalLabel(wire.fromTerminalId)} → {getTerminalLabel(wire.toTerminalId)}
                </span>
              </div>
              <button
                onClick={() => onDisconnectWire(wire.id)}
                className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                title="Disconnect wire"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Clear all wires */}
      {wires.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearWires}
          className="w-full gap-1.5 text-xs text-red-400 hover:text-red-300 border-zinc-800 hover:border-red-900/80"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Disconnect All Cables
        </Button>
      )}

      {/* Recommended circuit path guide */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400 space-y-1">
        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
          Standard Series Loop Guide:
        </span>
        <p>1. Power(+) → Switch(IN)</p>
        <p>2. Switch(OUT) → Resistor(A)</p>
        <p>3. Resistor(B) → Ammeter(+A)</p>
        <p>4. Ammeter(-COM) → Power(-)</p>
      </div>
    </div>
  );
}
