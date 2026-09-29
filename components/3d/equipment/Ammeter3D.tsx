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
      {/* ========================================================================= */}
      {/* BENCHTOP HIGH-PRECISION AMMETER (Slanted Faceplate & Carrying Bail)       */}
      {/* ========================================================================= */}
      {/* Main Steel Housing (Light Slate Gray with Aluminum Trim) */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.6, 0.85]} />
        <meshStandardMaterial metalness={0.65} roughness={0.3} color="#475569" />
      </mesh>

      {/* Rubber anti-vibration feet (4 corners) */}
      {[
        [-0.45, 0.01, -0.35],
        [0.45, 0.01, -0.35],
        [-0.45, 0.01, 0.35],
        [0.45, 0.01, 0.35],
      ].map(([x, y, z], i) => (
        <mesh key={`foot-${i}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial roughness={0.9} color="#0f172a" />
        </mesh>
      ))}

      {/* Folding chrome benchtop prop bail handle */}
      <mesh position={[0, 0.06, -0.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.16, 0.02, 0.7]} />
        <meshStandardMaterial metalness={0.9} roughness={0.15} color="#cbd5e1" />
      </mesh>

      {/* Angled Front Faceplate Bezel (Anthracite Industrial Finish) */}
      <group position={[0, 0.32, 0.43]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.02, 0.52, 0.03]} />
          <meshStandardMaterial metalness={0.4} roughness={0.45} color="#1e293b" />
        </mesh>

        {/* Recessed Digital Display Glass Window */}
        <mesh position={[0, 0.1, 0.02]}>
          <boxGeometry args={[0.82, 0.28, 0.015]} />
          <meshStandardMaterial metalness={0.3} roughness={0.7} color="#090a0f" />
        </mesh>

        {/* Backlit Display Surface (Deep Cyan) */}
        <mesh position={[0, 0.1, 0.03]}>
          <planeGeometry args={[0.78, 0.24]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#083344"
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>

        {/* High-Contrast LCD 7-Segment Readout */}
        <Html position={[0, 0.1, 0.035]} transform distanceFactor={2.9} occlude>
          <div className="flex flex-col items-center justify-center w-56 bg-cyan-950/95 p-2 rounded font-mono select-none pointer-events-none border border-cyan-400/50 shadow-inner">
            <div className="flex w-full justify-between items-center text-[9.5px] text-cyan-300 font-bold border-b border-cyan-700/60 pb-1 mb-0.5">
              <span>SERIES PRECISION AMMETER</span>
              <span className="text-cyan-400 font-semibold">DC 10A</span>
            </div>
            <div className="flex items-baseline justify-center gap-1.5 my-0.5">
              <span
                className={`text-3xl font-extrabold tracking-widest ${
                  isHighCurrent
                    ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                    : "text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                }`}
              >
                {currentDisplay}
              </span>
              <span className="text-sm font-bold text-cyan-400">A</span>
            </div>
            <div className="flex w-full justify-between items-center text-[8.5px] text-cyan-300/80">
              <span>R_shunt: 0.05 Ω</span>
              <span className={reading > 0.0005 ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                {reading > 0.0005 ? "● FLOW ACTIVE" : "○ ZERO"}
              </span>
            </div>
          </div>
        </Html>

        {/* Rotary Range Selector Switch on lower left */}
        <group position={[-0.25, -0.14, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.065, 0.07, 0.04, 20]} />
            <meshStandardMaterial metalness={0.7} roughness={0.3} color="#334155" />
          </mesh>
          <mesh position={[0, 0.024, -0.04]}>
            <boxGeometry args={[0.012, 0.01, 0.035]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Zero-Adjustment Calibration Screw */}
        <mesh position={[0.25, -0.14, 0.03]}>
          <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#94a3b8" />
        </mesh>
      </group>

      {/* Terminals placed at Canonical Coordinates */}
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
