"use client";

import React, { useRef } from "react";
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
      {/* ========================================================================= */}
      {/* 25-DEGREE TILTED MULTIMETER BENCH ASSEMBLY                                */}
      {/* ========================================================================= */}
      <group rotation={[-0.45, 0, 0]} position={[0, 0.22, 0]}>
        {/* Rear Wire/Steel Fold-Out Kickstand */}
        <mesh position={[0, -0.15, -0.22]} rotation={[0.65, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.45]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#cbd5e1" />
        </mesh>

        {/* Outer Rugged Industrial Rubber Shock Holster (Safety Yellow) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.82, 1.25, 0.24]} />
          <meshStandardMaterial roughness={0.5} metalness={0.08} color="#eab308" />
        </mesh>

        {/* Ergonomic Molded Side Rib Grips (Dark Gray) */}
        {[-0.41, 0.41].map((x) =>
          [-0.2, -0.05, 0.1].map((y) => (
            <mesh key={`grip-${x}-${y}`} position={[x, y, 0]}>
              <boxGeometry args={[0.03, 0.08, 0.18]} />
              <meshStandardMaterial roughness={0.7} color="#1e293b" />
            </mesh>
          ))
        )}

        {/* Inner Front Faceplate Recessed Bezel (Anthracite Gray) */}
        <mesh position={[0, 0.02, 0.08]}>
          <boxGeometry args={[0.74, 1.15, 0.1]} />
          <meshStandardMaterial roughness={0.4} metalness={0.2} color="#18181b" />
        </mesh>

        {/* Digital LCD Window Bezel */}
        <mesh position={[0, 0.35, 0.132]}>
          <boxGeometry args={[0.62, 0.34, 0.02]} />
          <meshStandardMaterial metalness={0.5} roughness={0.2} color="#090a0f" />
        </mesh>

        {/* Backlit LCD Screen Surface */}
        <mesh position={[0, 0.35, 0.144]}>
          <planeGeometry args={[0.58, 0.3]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.35}
            roughness={0.15}
          />
        </mesh>

        {/* High-Contrast Digital Reading */}
        <Html position={[0, 0.35, 0.148]} transform distanceFactor={2.8} occlude>
          <div className="flex flex-col items-center justify-center w-52 bg-sky-950/90 p-2 rounded font-mono select-none pointer-events-none border border-cyan-500/40 shadow-inner">
            <div className="flex w-full justify-between items-center text-[9px] text-cyan-300 font-bold border-b border-cyan-800/60 pb-0.5 mb-0.5">
              <span>MAGE-DMM 87V</span>
              <span className="text-cyan-400">AUTO DC-V</span>
            </div>
            <div className="flex items-baseline justify-center gap-1.5 my-0.5">
              {isNegative && <span className="text-2xl font-bold text-amber-300">-</span>}
              <span className="text-3xl font-extrabold tracking-widest text-cyan-200 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]">
                {formattedReading}
              </span>
              <span className="text-sm font-bold text-cyan-400">V</span>
            </div>
            <div className="flex w-full justify-between items-center text-[8.5px] text-cyan-400/80">
              <span>Hi-Z (10MΩ)</span>
              <span>ΔV PROBE</span>
            </div>
          </div>
        </Html>

        {/* Rotary Range Selector Switch with 12 Positions */}
        <group position={[0, -0.05, 0.14]}>
          {/* Knob circular body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.14, 0.05, 24]} />
            <meshStandardMaterial metalness={0.7} roughness={0.3} color="#27272a" />
          </mesh>
          {/* Knob pointer bar */}
          <mesh position={[0, 0.06, 0.026]}>
            <boxGeometry args={[0.02, 0.1, 0.015]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Circular range tick ring */}
          <mesh position={[0, 0, -0.002]}>
            <ringGeometry args={[0.16, 0.22, 24]} />
            <meshStandardMaterial roughness={0.5} color="#38bdf8" />
          </mesh>
        </group>

        {/* Silkscreened Function Buttons */}
        {[-0.15, 0, 0.15].map((x) => (
          <mesh key={`btn-${x}`} position={[x, 0.14, 0.135]}>
            <boxGeometry args={[0.08, 0.04, 0.015]} />
            <meshStandardMaterial roughness={0.5} color="#eab308" />
          </mesh>
        ))}

        {/* Recessed Banana Jack Sockets on Front Bottom Panel */}
        {/* Red VΩ Jack Recess */}
        <mesh position={[0.22, -0.38, 0.13]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* Black COM Jack Recess */}
        <mesh position={[-0.22, -0.38, 0.13]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} />
        </mesh>
      </group>

      {/* Terminals placed at Canonical Coordinates */}
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
