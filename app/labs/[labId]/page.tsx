"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getExperimentById } from "@/lib/experiments/registry";
import { simulateCircuit } from "@/lib/experiments/ohms-law/simulator";
import { LabOverlay } from "@/components/lab/LabOverlay";
import { CircuitControls } from "@/components/lab/CircuitControls";
import { MeasurementPanel } from "@/components/lab/MeasurementPanel";
import { LabNotebook } from "@/components/lab/LabNotebook";
import { WireConnectionUI } from "@/components/lab/WireConnectionUI";
import { LabAssistantWidget } from "@/components/ai/LabAssistantWidget";
import { LabDebugOverlay } from "@/components/lab/LabDebugOverlay";
import { CameraPreset } from "@/components/3d/LabCamera";
import {
  CircuitComponent,
  WireConnection,
  MeasurementRecord,
  LabChallenge,
} from "@/lib/experiments/types";
import confetti from "canvas-confetti";

// Dynamically import the 3D Canvas Scene with SSR disabled to prevent WebGL hydration issues
const LabScene = dynamic(
  () => import("@/components/3d/LabScene").then((mod) => mod.LabScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#090a0d] text-zinc-400 font-mono">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4" />
        <span className="text-xs uppercase tracking-widest text-zinc-300">
          Initializing 3D Virtual Laboratory...
        </span>
        <span className="text-[11px] text-zinc-500 mt-1">
          Loading workbench geometry, studio shaders, and physics solver
        </span>
      </div>
    ),
  }
);

export default function LabPage() {
  const params = useParams();
  const labId = (params?.labId as string) || "ohms-law";

  const experiment = getExperimentById(labId);

  // If experiment doesn't exist in registry
  if (!experiment) {
    return notFound();
  }

  // Active laboratory state
  const [components, setComponents] = useState<CircuitComponent[]>(() =>
    JSON.parse(JSON.stringify(experiment.standardComponents))
  );
  const [wires, setWires] = useState<WireConnection[]>(() =>
    JSON.parse(JSON.stringify(experiment.initialWires))
  );
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("default");
  const [activePanel, setActivePanel] = useState<
    "controls" | "measurements" | "notebook" | "wires" | null
  >("controls");
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [challenges, setChallenges] = useState<LabChallenge[]>(
    experiment.challenges
  );

  // Compute live physics simulation result whenever components or wires update
  const simulationResult = useMemo(() => {
    return simulateCircuit(components, wires);
  }, [components, wires]);

  // Extract component values for controls
  const powerSupply = components.find((c) => c.type === "power-supply");
  const voltage = Number(powerSupply?.properties.voltage ?? 0);

  const resistor = components.find((c) => c.type === "resistor");
  const resistance = Number(resistor?.properties.resistance ?? 10);

  const knifeSwitch = components.find((c) => c.type === "switch");
  const isSwitchOpen = Boolean(knifeSwitch?.properties.isOpen);

  // Challenge completion checker
  useEffect(() => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.isCompleted) return ch;

        let completed = false;
        if (ch.targetMetric === "closed_circuit") {
          completed = simulationResult.isClosedCircuit && voltage >= 2.0;
        } else if (ch.targetMetric === "current" && ch.targetValue) {
          completed =
            Math.abs(simulationResult.totalCurrent - ch.targetValue) <=
            (ch.tolerance || 0.05);
        } else if (ch.targetMetric === "resistance" && ch.targetValue) {
          completed = resistance === ch.targetValue;
        } else if (ch.targetMetric === "recorded_points" && ch.targetValue) {
          completed = records.length >= ch.targetValue;
        }

        if (completed && !ch.isCompleted) {
          // Trigger confetti burst on achievement
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ["#f59e0b", "#38bdf8", "#10b981"],
            });
          } catch {}
        }

        return completed ? { ...ch, isCompleted: true } : ch;
      })
    );
  }, [simulationResult, voltage, resistance, records.length]);

  // Actions
  const handleToggleSwitch = () => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.type === "switch") {
          return {
            ...c,
            properties: { ...c.properties, isOpen: !c.properties.isOpen },
          };
        }
        return c;
      })
    );
  };

  const handleVoltageChange = (newV: number) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.type === "power-supply") {
          return {
            ...c,
            properties: { ...c.properties, voltage: newV },
          };
        }
        return c;
      })
    );
  };

  const handleResistanceChange = (newR: number) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.type === "resistor") {
          return {
            ...c,
            properties: { ...c.properties, resistance: newR },
          };
        }
        return c;
      })
    );
  };

  const handleWireConnect = (fromTermId: string, toTermId: string) => {
    // Avoid duplicate wires
    const exists = wires.some(
      (w) =>
        (w.fromTerminalId === fromTermId && w.toTerminalId === toTermId) ||
        (w.fromTerminalId === toTermId && w.toTerminalId === fromTermId)
    );
    if (exists) return;

    // Pick appropriate wire color
    let wireColor = "#3b82f6"; // Blue default
    if (fromTermId.includes("pos") || toTermId.includes("pos"))
      wireColor = "#ef4444"; // Red for positive
    if (fromTermId.includes("neg") || toTermId.includes("neg"))
      wireColor = "#18181b"; // Black for ground/negative
    if (fromTermId.includes("vm") || toTermId.includes("vm"))
      wireColor = "#eab308"; // Yellow for voltmeter probe

    const newWire: WireConnection = {
      id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fromTerminalId: fromTermId,
      toTerminalId: toTermId,
      color: wireColor,
    };

    setWires((prev) => [...prev, newWire]);
  };

  const handleWireDisconnect = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  const handleResetExperiment = () => {
    setComponents(JSON.parse(JSON.stringify(experiment.standardComponents)));
    setWires(JSON.parse(JSON.stringify(experiment.initialWires)));
  };

  const handleAutoWire = () => {
    setWires(JSON.parse(JSON.stringify(experiment.initialWires)));
  };

  const handleAddRecord = (rec: MeasurementRecord) => {
    setRecords((prev) => [...prev, rec]);
  };

  const handleClearRecords = () => {
    setRecords([]);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#090a0d]">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <LabScene
          components={components}
          wires={wires}
          simulationResult={simulationResult}
          cameraPreset={cameraPreset}
          onToggleSwitch={handleToggleSwitch}
          onVoltageChange={handleVoltageChange}
          onResistanceChange={handleResistanceChange}
          onWireConnect={handleWireConnect}
          onWireDisconnect={handleWireDisconnect}
        />
      </div>

      {/* Top and Side Lab HUD Layer */}
      <LabOverlay
        title={experiment.title}
        subject={experiment.subject}
        simulationResult={simulationResult}
        cameraPreset={cameraPreset}
        onCameraChange={setCameraPreset}
        onResetExperiment={handleResetExperiment}
        onAutoWire={handleAutoWire}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      {/* Floating Active Panel Drawer (Left dock) */}
      <div className="absolute left-20 top-20 z-30 pointer-events-auto">
        {activePanel === "controls" && (
          <CircuitControls
            voltage={voltage}
            resistance={resistance}
            isSwitchOpen={isSwitchOpen}
            onVoltageChange={handleVoltageChange}
            onResistanceChange={handleResistanceChange}
            onToggleSwitch={handleToggleSwitch}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "measurements" && (
          <MeasurementPanel
            simulationResult={simulationResult}
            nominalResistance={resistance}
            records={records}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "notebook" && (
          <LabNotebook
            simulationResult={simulationResult}
            records={records}
            onAddRecord={handleAddRecord}
            onClearRecords={handleClearRecords}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "wires" && (
          <WireConnectionUI
            wires={wires}
            components={components}
            onDisconnectWire={handleWireDisconnect}
            onClearWires={() => setWires([])}
            onAutoWire={handleAutoWire}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>

      {/* Learning Objectives & Challenges Drawer (Top Right) */}
      <div className="absolute right-4 top-16 z-20 hidden lg:block w-72 rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3 shadow-xl backdrop-blur-md pointer-events-auto">
        <div className="flex items-center justify-between text-xs font-mono mb-2 border-b border-zinc-800 pb-1.5">
          <span className="font-bold text-zinc-200 uppercase">Lab Challenges</span>
          <span className="text-amber-400">
            {challenges.filter((c) => c.isCompleted).length} / {challenges.length} Done
          </span>
        </div>
        <div className="space-y-1.5">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className={`p-2 rounded-lg text-xs font-mono transition-colors border ${
                ch.isCompleted
                  ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{ch.title}</span>
                {ch.isCompleted && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
              </div>
              <p className="text-[10.5px] mt-0.5 text-zinc-400 leading-tight">
                {ch.instruction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating State-Aware AI Lab Assistant */}
      <LabAssistantWidget
        experimentId={experiment.id}
        experimentTitle={experiment.title}
        simulationResult={simulationResult}
        components={components}
        wires={wires}
      />

      {/* Physics Nodal Solver & Geometry Debug Overlay (Press ~) */}
      <LabDebugOverlay
        components={components}
        wires={wires}
        simulationResult={simulationResult}
        onToggleSwitch={handleToggleSwitch}
        onAutoWire={handleAutoWire}
        onClearWires={() => setWires([])}
      />
    </div>
  );
}
