"use client";

import React, { useMemo } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
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

  // Filament emissive blackbody color interpolation
  const filamentColor = useMemo(() => {
    if (brightness <= 0.01) return "#27272a";
    if (brightness < 0.2) return "#991b1b"; // Deep cherry red
    if (brightness < 0.5) return "#ea580c"; // Warm orange
    if (brightness < 0.8) return "#facc15"; // Incandescent warm yellow
    return "#fffbeb"; // Brilliant white-hot
  }, [brightness]);

  const t1 = component.terminals[0];
  const t2 = component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy circular porcelain socket base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.1, 32]} />
        <meshStandardMaterial roughness={0.7} metalness={0.1} color="#27272a" />
      </mesh>

      {/* Brass screw collar with rolled threads */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.14, 24]} />
        <meshStandardMaterial metalness={0.88} roughness={0.25} color="#ca8a04" />
      </mesh>

      {/* Glass bulb envelope with physical transmission */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshPhysicalMaterial
          roughness={0.08}
          metalness={0.05}
          transmission={0.94}
          thickness={0.35}
          transparent
          opacity={0.88}
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

      {/* Coiled Tungsten Filament with dynamic blackbody thermal glow */}
      <mesh position={[0, 0.41, 0]}>
        <torusGeometry args={[0.052, 0.014, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={filamentColor}
          emissive={filamentColor}
          emissiveIntensity={brightness * 3.5}
          roughness={0.2}
        />
      </mesh>

      {/* Dynamic 3D Point Light casting warm real-time illumination onto the workbench */}
      {brightness > 0.05 && (
        <pointLight
          position={[0, 0.42, 0]}
          color="#ffedd5"
          intensity={brightness * 5.0}
          distance={4.8}
          decay={2}
          castShadow
        />
      )}

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
