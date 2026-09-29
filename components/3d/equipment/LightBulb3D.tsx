"use client";

import { useMemo } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface LightBulb3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  reading?: { current: number; voltageDrop: number; power: number; brightness?: number };
}

export function LightBulb3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  reading,
}: LightBulb3DProps) {
  const brightness = reading?.brightness ?? 0;
  const power = reading?.power ?? 0;

  // Filament emissive color interpolation based on temperature/brightness
  const filamentColor = useMemo(() => {
    if (brightness <= 0.01) return "#27272a";
    if (brightness < 0.2) return "#991b1b"; // Deep red
    if (brightness < 0.5) return "#ea580c"; // Warm orange
    if (brightness < 0.8) return "#facc15"; // Bright yellow
    return "#fffbeb"; // Incandescent white
  }, [brightness]);

  const t1 = component.terminals[0];
  const t2 = component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy circular porcelain socket base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.1, 32]} />
        <meshStandardMaterial roughness={0.8} metalness={0.1} color="#27272a" />
      </mesh>

      {/* Brass screw collar */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.14, 24]} />
        <meshStandardMaterial metalness={0.85} roughness={0.3} color="#ca8a04" />
      </mesh>

      {/* Glass bulb envelope */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshPhysicalMaterial
          roughness={0.1}
          metalness={0.05}
          transmission={0.92}
          thickness={0.4}
          transparent
          opacity={0.85}
          color={brightness > 0.1 ? "#fef3c7" : "#e2e8f0"}
        />
      </mesh>

      {/* Filament support lead wires */}
      <mesh position={[-0.05, 0.32, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.18, 8]} />
        <meshStandardMaterial metalness={0.9} roughness={0.2} color="#94a3b8" />
      </mesh>
      <mesh position={[0.05, 0.32, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.18, 8]} />
        <meshStandardMaterial metalness={0.9} roughness={0.2} color="#94a3b8" />
      </mesh>

      {/* Coiled Tungsten Filament */}
      <mesh position={[0, 0.41, 0]}>
        <torusGeometry args={[0.05, 0.012, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={filamentColor}
          emissive={filamentColor}
          emissiveIntensity={brightness * 2.8}
          roughness={0.3}
        />
      </mesh>

      {/* Dynamic 3D Point Light when illuminated */}
      {brightness > 0.05 && (
        <pointLight
          position={[0, 0.42, 0]}
          color="#ffedd5"
          intensity={brightness * 4.5}
          distance={4.5}
          decay={2}
          castShadow
        />
      )}

      {/* Terminals */}
      {t1 && (
        <TerminalPost3D
          id={t1.id}
          name={t1.name}
          label={t1.label}
          polarity="neutral"
          position={[-0.26, 0.1, 0]}
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
          position={[0.26, 0.1, 0]}
          isActiveWiringSource={activeWiringTerminalId === t2.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {/* Power status badge */}
      <Html position={[0, 0.72, 0]} transform distanceFactor={3.6}>
        <div className="flex flex-col items-center bg-zinc-950/90 px-2 py-0.5 rounded border border-zinc-800 text-center font-mono pointer-events-none select-none shadow">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Filament Lamp</span>
          <span className={`text-xs font-bold ${brightness > 0.05 ? "text-amber-400" : "text-zinc-500"}`}>
            {brightness > 0.05 ? `${power.toFixed(1)} W · ${(brightness * 100).toFixed(0)}%` : "0.0 W (OFF)"}
          </span>
        </div>
      </Html>
    </group>
  );
}
