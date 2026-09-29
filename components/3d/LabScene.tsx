"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { LabCamera, CameraMode, CameraStation } from "./LabCamera";
import { LabRoom3D } from "./LabRoom3D";
import { PowerSupply3D } from "./equipment/PowerSupply3D";
import { Switch3D } from "./equipment/Switch3D";
import { Resistor3D } from "./equipment/Resistor3D";
import { Ammeter3D } from "./equipment/Ammeter3D";
import { Voltmeter3D } from "./equipment/Voltmeter3D";
import { LightBulb3D } from "./equipment/LightBulb3D";
import { Wire3D } from "./Wire3D";
import {
  CircuitComponent,
  WireConnection,
  CircuitSimulationResult,
} from "@/lib/experiments/types";
import { labAudio } from "@/lib/audio/sound-effects";
import * as THREE from "three";

interface LabSceneProps {
  components: CircuitComponent[];
  wires: WireConnection[];
  simulationResult: CircuitSimulationResult;
  cameraMode?: CameraMode;
  cameraStation?: CameraStation;
  onCameraModeChange?: (mode: CameraMode) => void;
  onCameraStationChange?: (station: CameraStation) => void;
  onToggleSwitch?: () => void;
  onVoltageChange?: (v: number) => void;
  onResistanceChange?: (r: number) => void;
  onWireConnect?: (fromTermId: string, toTermId: string) => void;
  onWireDisconnect?: (wireId: string) => void;
}

export function LabScene({
  components,
  wires,
  simulationResult,
  cameraMode = "orbit",
  cameraStation = "circuits",
  onCameraModeChange,
  onCameraStationChange,
  onToggleSwitch,
  onVoltageChange,
  onResistanceChange,
  onWireConnect,
  onWireDisconnect,
}: LabSceneProps) {
  const [activeWiringTerminalId, setActiveWiringTerminalId] = useState<string | null>(null);

  // Compute world coordinates of each terminal for wire routing
  const terminalWorldPositions = useMemo(() => {
    const map = new Map<string, [number, number, number]>();

    for (const comp of components) {
      const compPos = new THREE.Vector3(...comp.position);
      const euler = new THREE.Euler(...comp.rotation);
      const rotMat = new THREE.Matrix4().makeRotationFromEuler(euler);

      for (const term of comp.terminals) {
        const localPos = new THREE.Vector3(...term.position);
        localPos.applyMatrix4(rotMat);
        const worldPos = compPos.clone().add(localPos);
        map.set(term.id, [worldPos.x, worldPos.y, worldPos.z]);
      }
    }

    return map;
  }, [components]);

  const handleTerminalClick = (terminalId: string) => {
    if (!activeWiringTerminalId) {
      // Start wire routing
      labAudio.playKnobClick();
      setActiveWiringTerminalId(terminalId);
    } else {
      if (activeWiringTerminalId === terminalId) {
        // Deselect if clicked same terminal
        labAudio.playKnobClick();
        setActiveWiringTerminalId(null);
      } else {
        // Connect wire between activeWiringTerminalId and terminalId
        labAudio.playPlugSnap();
        onWireConnect?.(activeWiringTerminalId, terminalId);
        setActiveWiringTerminalId(null);
      }
    }
  };

  const handleDisconnectWire = (wireId: string) => {
    labAudio.playPlugUnplug();
    onWireDisconnect?.(wireId);
  };

  return (
    <div className="relative h-full w-full bg-[#0a0c10] select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        camera={{ position: [0, 2.4, 2.6], fov: 48 }}
        onPointerMissed={() => {
          // Deselect active wire routing when clicking empty space
          if (activeWiringTerminalId) setActiveWiringTerminalId(null);
        }}
      >
        <LabCamera
          mode={cameraMode}
          station={cameraStation}
          onModeChange={onCameraModeChange}
          onStationChange={onCameraStationChange}
        />

        {/* ========================================================================= */}
        {/* BRIGHT, AUTHENTIC LABORATORY STUDIO LIGHTING (No Dark Void)              */}
        {/* ========================================================================= */}
        <ambientLight intensity={1.1} color="#f8fafc" />
        <hemisphereLight args={["#e0f2fe", "#475569", 0.9]} />

        {/* Primary Sun & Key Lighting */}
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        {/* Fill Lights from Windows and Corners */}
        <directionalLight position={[-8, 8, -4]} intensity={0.9} color="#cbd5e1" />
        <directionalLight position={[8, 6, 2]} intensity={1.2} color="#bae6fd" />
        <directionalLight position={[0, 5, 8]} intensity={0.7} color="#f1f5f9" />

        {/* Open Physics Laboratory Architecture & Equipment Stations */}
        <LabRoom3D />

        {/* Render Circuit Components on Main Bench */}
        {components.map((comp) => {
          switch (comp.type) {
            case "power-supply":
              return (
                <PowerSupply3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  onVoltageChange={onVoltageChange}
                />
              );
            case "switch":
              return (
                <Switch3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  onToggleSwitch={onToggleSwitch}
                />
              );
            case "resistor":
              return (
                <Resistor3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  onResistanceChange={onResistanceChange}
                  reading={simulationResult.componentReadings[comp.id]}
                />
              );
            case "ammeter":
              return (
                <Ammeter3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  reading={simulationResult.ammeterReading}
                />
              );
            case "voltmeter":
              return (
                <Voltmeter3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  reading={simulationResult.voltmeterReading}
                />
              );
            case "light-bulb":
              return (
                <LightBulb3D
                  key={comp.id}
                  component={comp}
                  activeWiringTerminalId={activeWiringTerminalId}
                  onTerminalClick={handleTerminalClick}
                  reading={simulationResult.componentReadings[comp.id]}
                />
              );
            default:
              return null;
          }
        })}

        {/* Render 3D Wires */}
        {wires.map((wire) => {
          const start = terminalWorldPositions.get(wire.fromTerminalId);
          const end = terminalWorldPositions.get(wire.toTerminalId);

          if (!start || !end) return null;

          return (
            <Wire3D
              key={wire.id}
              id={wire.id}
              startPos={start}
              endPos={end}
              color={wire.color}
              onDisconnect={handleDisconnectWire}
            />
          );
        })}
      </Canvas>

      {/* Active wiring helper banner */}
      {activeWiringTerminalId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-cyan-950/90 px-4 py-1.5 border border-cyan-500/50 text-cyan-200 text-xs font-mono shadow-2xl backdrop-blur-md animate-pulse">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Wiring Active: Click another terminal post to connect patch cable. Click bench to cancel.
        </div>
      )}
    </div>
  );
}
