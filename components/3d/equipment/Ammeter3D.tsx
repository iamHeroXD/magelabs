"use client";

import React from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Ammeter3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  reading?: number; // Current in Amperes
}

export function Ammeter3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  reading = 0,
}: Ammeter3DProps) {
  const tIn = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const tOut = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];

  const currentDisplay = Math.abs(reading) < 0.0005 ? "0.000" : reading.toFixed(3);
  const isHighCurrent = reading > 2.5;

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Slanted desktop instrument chassis */}
      <mesh position={[0, 0.28, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.55, 0.85]} />
        <meshStandardMaterial metalness={0.5} roughness={0.4} color="#181e28" />
      </mesh>

      {/* Front bezel panel */}
      <mesh position={[0, 0.32, 0.36]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.98, 0.48, 0.02]} />
        <meshStandardMaterial metalness={0.3} roughness={0.6} color="#0f131a" />
      </mesh>

      {/* Recessed LCD Screen Bezel */}
      <mesh position={[0, 0.36, 0.375]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.76, 0.28, 0.02]} />
        <meshStandardMaterial metalness={0.3} roughness={0.8} color="#090a0f" />
      </mesh>

      {/* High-contrast Digital LCD Screen */}
      <Html position={[0, 0.36, 0.385]} transform distanceFactor={3.2} rotation={[-0.2, 0, 0]} occlude>
        <div className="flex flex-col items-center justify-center w-52 bg-zinc-950 p-2.5 rounded font-mono select-none pointer-events-none border border-zinc-800/80 shadow-inner">
          <div className="flex w-full justify-between items-center text-[9.5px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
            <span className="font-bold text-cyan-400 tracking-wider">MAGE AM-300</span>
            <span className="text-zinc-500 font-semibold">SERIES 10A</span>
          </div>
          <div className="flex items-baseline justify-center gap-1.5 my-0.5">
            <span
              className={`text-3xl font-bold tracking-widest ${
                isHighCurrent
                  ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]"
                  : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]"
              }`}
            >
              {currentDisplay}
            </span>
            <span className="text-sm font-bold text-cyan-500">A</span>
          </div>
          <div className="flex w-full justify-between items-center text-[8.5px] text-zinc-500 mt-1">
            <span>R_shunt: 0.05 Ω</span>
            <span className={reading > 0.0005 ? "text-emerald-400 font-bold" : "text-zinc-600"}>
              {reading > 0.0005 ? "FLOW ACTIVE" : "ZERO DETECTED"}
            </span>
          </div>
        </div>
      </Html>

      {/* Terminals (+A and -COM) at Canonical Coordinates */}
      {tIn && (
        <TerminalPost3D
          id={tIn.id}
          name={tIn.name}
          label={tIn.label}
          polarity="positive"
          position={tIn.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === tIn.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {tOut && (
        <TerminalPost3D
          id={tOut.id}
          name={tOut.name}
          label={tOut.label}
          polarity="negative"
          position={tOut.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === tOut.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
