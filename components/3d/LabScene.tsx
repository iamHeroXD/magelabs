"use client";

import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { LabCamera, CameraPreset } from "./LabCamera";
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
import * as THREE from "three";

interface LabSceneProps {
  components: CircuitComponent[];
  wires: WireConnection[];
  simulationResult: CircuitSimulationResult;
  cameraPreset: CameraPreset;
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
  cameraPreset,
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
      setActiveWiringTerminalId(terminalId);
    } else {
      if (activeWiringTerminalId === terminalId) {
        // Deselect if clicked same terminal
        setActiveWiringTerminalId(null);
      } else {
        // Connect wire between activeWiringTerminalId and terminalId
        onWireConnect?.(activeWiringTerminalId, terminalId);
        setActiveWiringTerminalId(null);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-[#0a0c10] select-none">
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        camera={{ position: [0, 4.2, 4.8], fov: 46 }}
        onPointerMissed={() => {
          // Deselect active wire routing when clicking empty space
          if (activeWiringTerminalId) setActiveWiringTerminalId(null);
        }}
      >
        <LabCamera preset={cameraPreset} />

        {/* Studio Laboratory Lighting */}
        <ambientLight intensity={0.45} color="#cbd5e1" />
        <directionalLight
          position={[4, 8, 4]}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 5, -2]} intensity={0.4} color="#94a3b8" />
        <pointLight position={[0, 3, 0]} intensity={0.2} color="#f59e0b" />

        {/* Laboratory Bench Environment */}
        <group position={[0, 0, 0]}>
          {/* Epoxy resin lab table top */}
          <mesh position={[0, -0.05, 0]} receiveShadow>
            <boxGeometry args={[7.2, 0.1, 4.2]} />
            <meshStandardMaterial
              roughness={0.65}
              metalness={0.15}
              color="#13171f"
            />
          </mesh>

          {/* ESD Anti-Static Lab Work Mat */}
          <mesh position={[0, 0.002, 0]} receiveShadow>
            <planeGeometry args={[6.2, 3.4]} />
            <meshStandardMaterial
              roughness={0.8}
              metalness={0.05}
              color="#1a202c"
            />
          </mesh>

          {/* Table edge beveled wooden trim */}
          <mesh position={[0, -0.05, 2.12]}>
            <boxGeometry args={[7.24, 0.12, 0.04]} />
            <meshStandardMaterial roughness={0.7} color="#292524" />
          </mesh>
          <mesh position={[0, -0.05, -2.12]}>
            <boxGeometry args={[7.24, 0.12, 0.04]} />
            <meshStandardMaterial roughness={0.7} color="#292524" />
          </mesh>

          {/* Subtle room floor far below */}
          <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[25, 25]} />
            <meshStandardMaterial roughness={0.9} color="#08090b" />
          </mesh>

          {/* Back laboratory wall */}
          <mesh position={[0, 2.5, -4.5]}>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial roughness={0.95} color="#0f1117" />
          </mesh>
        </group>

        {/* Render Circuit Components */}
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

        {/* Render Wires */}
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
              onDisconnect={onWireDisconnect}
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
