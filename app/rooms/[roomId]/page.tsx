"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getExperimentById } from "@/lib/experiments/registry";
import { simulateCircuit } from "@/lib/experiments/ohms-law/simulator";
import { LabOverlay } from "@/components/lab/LabOverlay";
import { CircuitControls } from "@/components/lab/CircuitControls";
import { MeasurementPanel } from "@/components/lab/MeasurementPanel";
import { LabNotebook } from "@/components/lab/LabNotebook";
import { WireConnectionUI } from "@/components/lab/WireConnectionUI";
import { LabAssistantWidget } from "@/components/ai/LabAssistantWidget";
import { RoomHeader } from "@/components/multiplayer/RoomHeader";
import { CollaborativeChat } from "@/components/multiplayer/CollaborativeChat";
import { CameraMode, CameraStation } from "@/components/3d/LabCamera";
import {
  CircuitComponent,
  WireConnection,
  MeasurementRecord,
} from "@/lib/experiments/types";
import { CollaborativeLabSession } from "@/lib/realtime/provider";
import { lockManager } from "@/lib/realtime/lock-manager";
import { LabParticipant, ChatMessage } from "@/lib/realtime/types";

const LabScene = dynamic(
  () => import("@/components/3d/LabScene").then((mod) => mod.LabScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#090a0d] text-zinc-400 font-mono">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4" />
        <span className="text-xs uppercase tracking-widest text-zinc-300">
          Synchronizing Collaborative Lab Room...
        </span>
      </div>
    ),
  }
);

export default function CollaborativeRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "LAB-DEMO";

  const experiment = getExperimentById("ohms-law")!;

  // State
  const [components, setComponents] = useState<CircuitComponent[]>(() =>
    JSON.parse(JSON.stringify(experiment.standardComponents))
  );
  const [wires, setWires] = useState<WireConnection[]>(() =>
    JSON.parse(JSON.stringify(experiment.initialWires))
  );
  const [cameraMode, setCameraMode] = useState<CameraMode>("orbit");
  const [cameraStation, setCameraStation] = useState<CameraStation>("circuits");
  const [activePanel, setActivePanel] = useState<
    "controls" | "measurements" | "notebook" | "wires" | null
  >("controls");
  const [records, setRecords] = useState<MeasurementRecord[]>([]);

  // Multiplayer State
  const [participants, setParticipants] = useState<LabParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const sessionRef = useRef<CollaborativeLabSession | null>(null);

  // Initialize Realtime session
  useEffect(() => {
    const session = new CollaborativeLabSession(roomId, "");
    session.init();
    sessionRef.current = session;

    // Listen to presence updates
    const unsubPresence = session.onPresence((list) => {
      setParticipants(list);
    });

    // Listen to collaborative domain events
    const unsubEvents = session.onEvent((evt) => {
      switch (evt.type) {
        case "SWITCH_TOGGLED":
          setComponents((prev) =>
            prev.map((c) =>
              c.type === "switch"
                ? { ...c, properties: { ...c.properties, isOpen: evt.payload.isOpen } }
                : c
            )
          );
          addSystemMessage(`${evt.senderName} toggled the knife switch.`);
          break;

        case "VOLTAGE_CHANGED":
          setComponents((prev) =>
            prev.map((c) =>
              c.type === "power-supply"
                ? { ...c, properties: { ...c.properties, voltage: evt.payload.voltage } }
                : c
            )
          );
          addSystemMessage(`${evt.senderName} adjusted voltage to ${evt.payload.voltage.toFixed(1)}V.`);
          break;

        case "RESISTANCE_CHANGED":
          setComponents((prev) =>
            prev.map((c) =>
              c.type === "resistor"
                ? { ...c, properties: { ...c.properties, resistance: evt.payload.resistance } }
                : c
            )
          );
          addSystemMessage(`${evt.senderName} changed resistance to ${evt.payload.resistance}Ω.`);
          break;

        case "WIRE_CONNECTED":
          setWires((prev) => [...prev, evt.payload.wire]);
          addSystemMessage(`${evt.senderName} connected a patch wire.`);
          break;

        case "WIRE_DISCONNECTED":
          setWires((prev) => prev.filter((w) => w.id !== evt.payload.wireId));
          addSystemMessage(`${evt.senderName} disconnected a wire.`);
          break;

        case "EXPERIMENT_RESET":
          setComponents(JSON.parse(JSON.stringify(experiment.standardComponents)));
          setWires(JSON.parse(JSON.stringify(experiment.initialWires)));
          addSystemMessage(`${evt.senderName} reset the circuit.`);
          break;

        case "CHAT_MESSAGE":
          if (evt.payload && !evt.payload.isPresence) {
            setChatMessages((prev) => [...prev, evt.payload]);
          }
          break;
      }
    });

    return () => {
      unsubPresence();
      unsubEvents();
      session.destroy();
    };
  }, [roomId]);

  const addSystemMessage = (text: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}_${Math.random()}`,
        senderId: "system",
        senderName: "System",
        text,
        timestamp: Date.now(),
        isSystem: true,
      },
    ]);
  };

  // Compute live physics simulation
  const simulationResult = useMemo(() => {
    return simulateCircuit(components, wires);
  }, [components, wires]);

  const powerSupply = components.find((c) => c.type === "power-supply");
  const voltage = Number(powerSupply?.properties.voltage ?? 0);

  const resistor = components.find((c) => c.type === "resistor");
  const resistance = Number(resistor?.properties.resistance ?? 10);

  const knifeSwitch = components.find((c) => c.type === "switch");
  const isSwitchOpen = Boolean(knifeSwitch?.properties.isOpen);

  // Synchronized Handlers
  const handleToggleSwitch = () => {
    const nextOpen = !isSwitchOpen;
    setComponents((prev) =>
      prev.map((c) =>
        c.type === "switch"
          ? { ...c, properties: { ...c.properties, isOpen: nextOpen } }
          : c
      )
    );
    sessionRef.current?.broadcastEvent("SWITCH_TOGGLED", { isOpen: nextOpen });
  };

  const handleVoltageChange = (newV: number) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.type === "power-supply"
          ? { ...c, properties: { ...c.properties, voltage: newV } }
          : c
      )
    );
    sessionRef.current?.broadcastEvent("VOLTAGE_CHANGED", { voltage: newV });
  };

  const handleResistanceChange = (newR: number) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.type === "resistor"
          ? { ...c, properties: { ...c.properties, resistance: newR } }
          : c
      )
    );
    sessionRef.current?.broadcastEvent("RESISTANCE_CHANGED", { resistance: newR });
  };

  const handleWireConnect = (fromTermId: string, toTermId: string) => {
    const exists = wires.some(
      (w) =>
        (w.fromTerminalId === fromTermId && w.toTerminalId === toTermId) ||
        (w.fromTerminalId === toTermId && w.toTerminalId === fromTermId)
    );
    if (exists) return;

    let wireColor = "#3b82f6";
    if (fromTermId.includes("pos") || toTermId.includes("pos")) wireColor = "#ef4444";
    if (fromTermId.includes("neg") || toTermId.includes("neg")) wireColor = "#18181b";

    const newWire: WireConnection = {
      id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fromTerminalId: fromTermId,
      toTerminalId: toTermId,
      color: wireColor,
    };

    setWires((prev) => [...prev, newWire]);
    sessionRef.current?.broadcastEvent("WIRE_CONNECTED", { wire: newWire });
  };

  const handleWireDisconnect = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
    sessionRef.current?.broadcastEvent("WIRE_DISCONNECTED", { wireId });
  };

  const handleResetExperiment = () => {
    setComponents(JSON.parse(JSON.stringify(experiment.standardComponents)));
    setWires(JSON.parse(JSON.stringify(experiment.initialWires)));
    sessionRef.current?.broadcastEvent("EXPERIMENT_RESET", {});
  };

  const handleSendMessage = (text: string) => {
    const msg = sessionRef.current?.sendChatMessage(text);
    if (msg) {
      setChatMessages((prev) => [...prev, msg]);
    }
  };

  const currentParticipant = sessionRef.current?.getParticipant();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#090a0d]">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <LabScene
          components={components}
          wires={wires}
          simulationResult={simulationResult}
          cameraMode={cameraMode}
          cameraStation={cameraStation}
          onCameraModeChange={setCameraMode}
          onCameraStationChange={setCameraStation}
          onToggleSwitch={handleToggleSwitch}
          onVoltageChange={handleVoltageChange}
          onResistanceChange={handleResistanceChange}
          onWireConnect={handleWireConnect}
          onWireDisconnect={handleWireDisconnect}
        />
      </div>

      {/* Room Header Overlay */}
      <RoomHeader
        roomId={roomId}
        participants={participants}
        currentUserId={currentParticipant?.id || ""}
      />

      {/* Top HUD Layer */}
      <LabOverlay
        title={`${experiment.title} · Live Multi-User Room`}
        subject={experiment.subject}
        simulationResult={simulationResult}
        cameraMode={cameraMode}
        cameraStation={cameraStation}
        onCameraModeChange={setCameraMode}
        onCameraStationChange={setCameraStation}
        onResetExperiment={handleResetExperiment}
        onAutoWire={() => setWires(JSON.parse(JSON.stringify(experiment.initialWires)))}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      {/* Floating Active Panel Drawer */}
      <div className="absolute left-20 top-24 z-30 pointer-events-auto">
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
            onAddRecord={(r) => setRecords((prev) => [...prev, r])}
            onClearRecords={() => setRecords([])}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "wires" && (
          <WireConnectionUI
            wires={wires}
            components={components}
            onDisconnectWire={handleWireDisconnect}
            onClearWires={() => setWires([])}
            onAutoWire={() => setWires(JSON.parse(JSON.stringify(experiment.initialWires)))}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>

      {/* Collaborative Chat */}
      <CollaborativeChat
        messages={chatMessages}
        currentUserId={currentParticipant?.id || ""}
        onSendMessage={handleSendMessage}
      />

      {/* Floating AI Lab Assistant */}
      <LabAssistantWidget
        experimentId={experiment.id}
        experimentTitle={experiment.title}
        simulationResult={simulationResult}
        components={components}
        wires={wires}
      />
    </div>
  );
}
