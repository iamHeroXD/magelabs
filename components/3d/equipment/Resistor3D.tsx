"use client";

import { useMemo } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";

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

  // Derive 4-band EIA color codes from resistance value
  const bands = useMemo(() => {
    let r = Math.round(resistance);
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
      {/* Phenolic mounting board */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.08, 0.65]} />
        <meshStandardMaterial roughness={0.7} metalness={0.1} color="#1c1917" />
      </mesh>

      {/* Resistor axial lead wires */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.9, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.2} color="#d4d4d8" />
      </mesh>

      {/* Main ceramic body */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.44, 24]} />
        <meshStandardMaterial roughness={0.5} metalness={0.1} color="#d6c5a5" />
      </mesh>

      {/* End caps */}
      <mesh position={[-0.2, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.088, 0.088, 0.04, 24]} />
        <meshStandardMaterial metalness={0.8} roughness={0.3} color="#a1a1aa" />
      </mesh>
      <mesh position={[0.2, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.088, 0.088, 0.04, 24]} />
        <meshStandardMaterial metalness={0.8} roughness={0.3} color="#a1a1aa" />
      </mesh>

      {/* Band 1 */}
      <mesh position={[-0.12, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.087, 0.087, 0.035, 24]} />
        <meshStandardMaterial color={bands.band1} roughness={0.3} />
      </mesh>

      {/* Band 2 */}
      <mesh position={[-0.04, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.087, 0.087, 0.035, 24]} />
        <meshStandardMaterial color={bands.band2} roughness={0.3} />
      </mesh>

      {/* Band 3 (Multiplier) */}
      <mesh position={[0.04, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.087, 0.087, 0.035, 24]} />
        <meshStandardMaterial color={bands.band3} roughness={0.3} />
      </mesh>

      {/* Band 4 (Tolerance - Gold) */}
      <mesh position={[0.13, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.087, 0.087, 0.035, 24]} />
        <meshStandardMaterial color={bands.band4} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Terminals */}
      {t1 && (
        <TerminalPost3D
          id={t1.id}
          name={t1.name}
          label={t1.label}
          polarity="neutral"
          position={[-0.45, 0.08, 0]}
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
          position={[0.45, 0.08, 0]}
          isActiveWiringSource={activeWiringTerminalId === t2.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {/* Resistance readout plate */}
      <Html position={[0, 0.38, 0]} transform distanceFactor={3.6}>
        <div className="flex flex-col items-center bg-zinc-950/90 px-2 py-1 rounded border border-zinc-800 text-center font-mono pointer-events-none select-none shadow-md">
          <span className="text-xs font-bold text-amber-400">{resistance} Ω (±5%)</span>
          {reading && reading.power > 0 && (
            <span className="text-[10px] text-zinc-400">
              {reading.voltageDrop.toFixed(2)}V · {reading.power.toFixed(2)}W
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}
