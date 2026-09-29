"use client";

import React, { useRef, useState } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import { labAudio } from "@/lib/audio/sound-effects";
import * as THREE from "three";

interface PowerSupply3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  onVoltageChange?: (voltage: number) => void;
}

export function PowerSupply3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  onVoltageChange,
}: PowerSupply3DProps) {
  const [isOn, setIsOn] = useState(Boolean(component.properties.isOn ?? true));
  const voltage = Number(component.properties.voltage ?? 12.0);
  const maxVoltage = Number(component.properties.maxVoltage ?? 24.0);

  const coarseKnobRef = useRef<THREE.Group>(null);
  const fineKnobRef = useRef<THREE.Group>(null);

  const posTerm = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const negTerm = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];
  const gndTerm = component.terminals.find((t) => t.polarity === "neutral");

  // Rotary Knob Rotation Angles
  const coarseAngle = (voltage / maxVoltage) * Math.PI * 1.5 - Math.PI * 0.75;
  const fineAngle = ((voltage % 2) / 2) * Math.PI * 1.5 - Math.PI * 0.75;

  const handleCoarseClick = (e: any) => {
    e.stopPropagation();
    labAudio.playKnobClick();
    const nextV = Math.round((voltage + 2.0) * 10) / 10;
    const finalV = nextV > maxVoltage ? 1.0 : nextV;
    onVoltageChange?.(finalV);
  };

  const handleFineClick = (e: any) => {
    e.stopPropagation();
    labAudio.playKnobClick();
    const nextV = Math.round((voltage + 0.2) * 10) / 10;
    const finalV = nextV > maxVoltage ? 0.2 : nextV;
    onVoltageChange?.(finalV);
  };

  const handleTogglePower = (e: any) => {
    e.stopPropagation();
    labAudio.playSwitchClack(!isOn);
    setIsOn(!isOn);
  };

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy gauge metal benchtop chassis */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.9, 0.95]} />
        <meshStandardMaterial metalness={0.7} roughness={0.3} color="#181c24" />
      </mesh>

      {/* Recessed anodized aluminum front faceplate */}
      <mesh position={[0, 0.45, 0.48]}>
        <boxGeometry args={[1.24, 0.84, 0.03]} />
        <meshStandardMaterial metalness={0.4} roughness={0.45} color="#222834" />
      </mesh>

      {/* Ventilation slots on top chassis */}
      {[-0.3, -0.1, 0.1, 0.3].map((x) => (
        <mesh key={`vent-${x}`} position={[x, 0.902, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.5]} />
          <meshStandardMaterial roughness={0.9} color="#0c0e12" />
        </mesh>
      ))}

      {/* Digital LED Display Recessed Bezel Window */}
      <mesh position={[0, 0.65, 0.496]}>
        <boxGeometry args={[0.96, 0.34, 0.015]} />
        <meshStandardMaterial metalness={0.2} roughness={0.8} color="#0a0c10" />
      </mesh>

      {/* Digital LED Segment Display (Emissive dark red filter glass) */}
      <mesh position={[0, 0.65, 0.505]}>
        <planeGeometry args={[0.92, 0.3]} />
        <meshStandardMaterial roughness={0.2} metalness={0.1} color="#1a0505" />
      </mesh>

      {/* Physical 3D LED Digital Numbers */}
      <Html position={[0, 0.65, 0.51]} transform distanceFactor={3.2} occlude>
        <div className="flex w-64 items-center justify-between bg-black/95 px-3 py-2 rounded font-mono select-none pointer-events-none border border-red-950/60 shadow-inner">
          <div className="flex flex-col items-start">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">DC VOLTAGE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">
                {isOn ? voltage.toFixed(1).padStart(4, "0") : "00.0"}
              </span>
              <span className="text-xs font-bold text-red-600">V</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-zinc-800" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">CURRENT LIMIT</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-widest text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                {isOn ? "5.00" : "0.00"}
              </span>
              <span className="text-xs font-bold text-emerald-600">A</span>
            </div>
          </div>
        </div>
      </Html>

      {/* CV / CC Status LED Indicators */}
      {/* CV (Constant Voltage) - Green LED */}
      <group position={[-0.42, 0.48, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
          <meshStandardMaterial
            color={isOn ? "#22c55e" : "#14532d"}
            emissive={isOn ? "#22c55e" : "#000000"}
            emissiveIntensity={isOn ? 1.5 : 0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* CC (Constant Current Limit) - Amber LED */}
      <group position={[-0.32, 0.48, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
          <meshStandardMaterial
            color="#78350f"
            emissive="#000000"
            emissiveIntensity={0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Rotary Voltage Knob (Coarse) - Clickable & Rotatable */}
      <group
        ref={coarseKnobRef}
        position={[-0.25, 0.32, 0.51]}
        onClick={handleCoarseClick}
        onWheel={(e: any) => {
          e.stopPropagation();
          labAudio.playKnobClick();
          const delta = e.deltaY < 0 ? 0.5 : -0.5;
          const nextV = Math.max(0, Math.min(maxVoltage, Math.round((voltage + delta) * 10) / 10));
          onVoltageChange?.(nextV);
        }}
      >
        {/* Knob fluted body */}
        <mesh rotation={[Math.PI / 2, coarseAngle, 0]}>
          <cylinderGeometry args={[0.08, 0.085, 0.065, 24]} />
          <meshStandardMaterial metalness={0.8} roughness={0.25} color="#334155" />
        </mesh>
        {/* White pointer groove notch */}
        <mesh position={[Math.sin(coarseAngle) * 0.06, Math.cos(coarseAngle) * 0.06, 0.034]}>
          <boxGeometry args={[0.012, 0.03, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Rotary Voltage Knob (Fine) */}
      <group
        ref={fineKnobRef}
        position={[0.1, 0.32, 0.51]}
        onClick={handleFineClick}
        onWheel={(e: any) => {
          e.stopPropagation();
          labAudio.playKnobClick();
          const delta = e.deltaY < 0 ? 0.1 : -0.1;
          const nextV = Math.max(0, Math.min(maxVoltage, Math.round((voltage + delta) * 10) / 10));
          onVoltageChange?.(nextV);
        }}
      >
        <mesh rotation={[Math.PI / 2, fineAngle, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.055, 24]} />
          <meshStandardMaterial metalness={0.8} roughness={0.25} color="#334155" />
        </mesh>
        <mesh position={[Math.sin(fineAngle) * 0.045, Math.cos(fineAngle) * 0.045, 0.029]}>
          <boxGeometry args={[0.01, 0.025, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Power Rocker Switch */}
      <group position={[0.42, 0.32, 0.505]} onClick={handleTogglePower}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.11, 0.02]} />
          <meshStandardMaterial roughness={0.7} color="#0f172a" />
        </mesh>
        <mesh position={[0, isOn ? 0.015 : -0.015, 0.012]} rotation={[isOn ? -0.2 : 0.2, 0, 0]}>
          <boxGeometry args={[0.065, 0.08, 0.025]} />
          <meshStandardMaterial
            color={isOn ? "#ef4444" : "#450a0a"}
            emissive={isOn ? "#ef4444" : "#000000"}
            emissiveIntensity={isOn ? 0.5 : 0}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Terminals using Canonical Offsets */}
      {posTerm && (
        <TerminalPost3D
          id={posTerm.id}
          name={posTerm.name}
          label={posTerm.label}
          polarity="positive"
          position={posTerm.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === posTerm.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {negTerm && (
        <TerminalPost3D
          id={negTerm.id}
          name={negTerm.name}
          label={negTerm.label}
          polarity="negative"
          position={negTerm.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === negTerm.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {gndTerm && (
        <TerminalPost3D
          id={gndTerm.id}
          name={gndTerm.name}
          label={gndTerm.label}
          polarity="neutral"
          position={gndTerm.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === gndTerm.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
