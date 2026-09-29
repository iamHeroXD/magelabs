"use client";

import React, { useMemo } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import * as THREE from "three";

interface Resistor3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  onResistanceChange?: (ohms: number) => void;
  reading?: { current: number; voltageDrop: number; power: number };
}

const COLOR_MAP: Record<number, string> = {
  0: "#18181b", // Black
  1: "#78350f", // Brown
  2: "#dc2626", // Red
  3: "#ea580c", // Orange
  4: "#eab308", // Yellow
  5: "#16a34a", // Green
  6: "#2563eb", // Blue
  7: "#7c3aed", // Violet
  8: "#4b5563", // Gray
  9: "#f4f4f5", // White
};

export function Resistor3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  onResistanceChange,
  reading,
}: Resistor3DProps) {
  const resistance = Number(component.properties.resistance ?? 10.0);
  const power = reading?.power ?? 0;
  const isHeating = power > 5.0; // Dissipating noticeable thermal wattage

  // Derive 4-band EIA color codes from resistance value
  const bands = useMemo(() => {
    const r = Math.round(resistance);
    const rStr = r.toString();
    const d1 = parseInt(rStr[0], 10) || 1;
    const d2 = parseInt(rStr[1], 10) || 0;
    const multiplier = Math.max(0, rStr.length - 2);

    return {
      band1: COLOR_MAP[d1] || "#78350f",
      band2: COLOR_MAP[d2] || "#18181b",
      band3: COLOR_MAP[multiplier] || "#18181b",
      band4: "#eab308", // Gold (5% tolerance)
    };
  }, [resistance]);

  const t1 = component.terminals[0];
  const t2 = component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy phenolic mounting board */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.08, 0.65]} />
        <meshStandardMaterial roughness={0.7} metalness={0.15} color="#1c1917" />
      </mesh>

      {/* Silkscreened PCB / Phenolic Label Plate */}
      <group position={[0, 0.082, 0.18]}>
        <mesh>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial roughness={0.5} color="#f8fafc" />
        </mesh>
      </group>

      {/* Resistor axial lead wires (pure tinned copper) */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.9, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.2} color="#d4d4d8" />
      </mesh>

      {/* Main ceramic vitrified enamel body */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.088, 0.088, 0.44, 24]} />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.08}
          color={isHeating ? "#c2410c" : "#e2d5be"}
          emissive={isHeating ? "#ea580c" : "#000000"}
          emissiveIntensity={Math.min(1.2, power * 0.05)}
        />
      </mesh>

      {/* Nickel-plated steel end caps */}
      <mesh position={[-0.2, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.092, 0.092, 0.045, 24]} />
        <meshStandardMaterial metalness={0.88} roughness={0.25} color="#a1a1aa" />
      </mesh>
      <mesh position={[0.2, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.092, 0.092, 0.045, 24]} />
        <meshStandardMaterial metalness={0.88} roughness={0.25} color="#a1a1aa" />
      </mesh>

      {/* EIA Color Band 1 (1st Significant Digit) */}
      <mesh position={[-0.12, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.089, 0.089, 0.038, 24]} />
        <meshStandardMaterial color={bands.band1} roughness={0.3} />
      </mesh>

      {/* EIA Color Band 2 (2nd Significant Digit) */}
      <mesh position={[-0.04, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.089, 0.089, 0.038, 24]} />
        <meshStandardMaterial color={bands.band2} roughness={0.3} />
      </mesh>

      {/* EIA Color Band 3 (Decimal Multiplier) */}
      <mesh position={[0.04, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.089, 0.089, 0.038, 24]} />
        <meshStandardMaterial color={bands.band3} roughness={0.3} />
      </mesh>

      {/* EIA Color Band 4 (Tolerance ±5% Gold) */}
      <mesh position={[0.13, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.089, 0.089, 0.038, 24]} />
        <meshStandardMaterial color={bands.band4} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Terminals at Canonical Coordinates */}
      {t1 && (
        <TerminalPost3D
          id={t1.id}
          name={t1.name}
          label={t1.label}
          polarity="neutral"
          position={t1.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === t1.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {t2 && (
        <TerminalPost3D
          id={t2.id}
          name={t2.name}
          label={t2.label}
          polarity="neutral"
          position={t2.position as [number, number, number]}
          isActiveWiringSource={activeWiringTerminalId === t2.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
