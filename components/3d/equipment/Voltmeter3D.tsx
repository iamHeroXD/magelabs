"use client";

import React from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Voltmeter3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  reading?: number; // Volts
}

export function Voltmeter3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  reading = 0,
}: Voltmeter3DProps) {
  const tPos = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const tNeg = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];

  const formattedReading = Math.abs(reading) < 0.001 ? "0.00" : reading.toFixed(2);
  const isNegative = reading < -0.005;

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Ruggedized yellow/amber protective rubber holster */}
      <mesh position={[0, 0.25, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.02, 0.54, 0.82]} />
        <meshStandardMaterial metalness={0.15} roughness={0.65} color="#d97706" />
      </mesh>

      {/* Dark textured instrument inner case */}
      <mesh position={[0, 0.28, 0.32]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.92, 0.46, 0.04]} />
        <meshStandardMaterial metalness={0.4} roughness={0.5} color="#18181b" />
      </mesh>

      {/* Recessed LCD Screen Bezel */}
      <mesh position={[0, 0.34, 0.345]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.74, 0.28, 0.02]} />
        <meshStandardMaterial metalness={0.3} roughness={0.8} color="#090a0f" />
      </mesh>

      {/* Multimeter LCD Screen Surface */}
      <Html position={[0, 0.34, 0.355]} transform distanceFactor={3.2} rotation={[-0.2, 0, 0]} occlude>
        <div className="flex flex-col items-center justify-center w-52 bg-zinc-950 p-2 rounded font-mono select-none pointer-events-none border border-zinc-800/80 shadow-inner">
          <div className="flex w-full justify-between items-center text-[9px] text-zinc-400 border-b border-zinc-800 pb-0.5 mb-0.5">
            <span className="font-bold text-amber-400 tracking-wider">MAGE DMM-880</span>
            <span className="text-zinc-500 font-semibold">DC V AUTO</span>
          </div>
          <div className="flex items-baseline justify-center gap-1.5 my-0.5">
            {isNegative && <span className="text-xl font-bold text-amber-500">-</span>}
            <span className="text-3xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]">
              {formattedReading}
            </span>
            <span className="text-sm font-bold text-amber-500">V</span>
          </div>
          <div className="flex w-full justify-between items-center text-[8.5px] text-zinc-500">
            <span>Hi-Z (10MΩ)</span>
            <span className="text-zinc-400 font-semibold">ΔV PROBE</span>
          </div>
        </div>
      </Html>

      {/* Rotary Selection Dial */}
      <group position={[0, 0.12, 0.38]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.045, 24]} />
          <meshStandardMaterial metalness={0.7} roughness={0.35} color="#27272a" />
        </mesh>
        {/* Dial pointer notch */}
        <mesh position={[0, 0.024, -0.05]}>
          <boxGeometry args={[0.012, 0.01, 0.04]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Terminals at Canonical Coordinates */}
      {tPos && (
        <TerminalPost3D
          id={tPos.id}
          name={tPos.name}
          label={tPos.label}
          polarity="positive"
          position={tPos.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === tPos.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {tNeg && (
        <TerminalPost3D
          id={tNeg.id}
          name={tNeg.name}
          label={tNeg.label}
          polarity="negative"
          position={tNeg.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === tNeg.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
