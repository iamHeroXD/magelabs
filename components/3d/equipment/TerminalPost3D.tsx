"use client";

import { useState } from "react";
import { TerminalPolarity } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface TerminalPost3DProps {
  id: string;
  name: string;
  label: string;
  polarity: TerminalPolarity;
  position: [number, number, number];
  isActiveWiringSource?: boolean;
  onTerminalClick?: (terminalId: string) => void;
}

export function TerminalPost3D({
  id,
  name,
  label,
  polarity,
  position,
  isActiveWiringSource,
  onTerminalClick,
}: TerminalPost3DProps) {
  const [hovered, setHovered] = useState(false);

  // Polarity color
  const baseColor =
    polarity === "positive"
      ? "#ef4444" // red
      : polarity === "negative"
      ? "#18181b" // black
      : "#d97706"; // amber / brass

  const collarColor = polarity === "positive" ? "#b91c1c" : polarity === "negative" ? "#09090b" : "#b45309";

  return (
    <group position={position}>
      {/* Clickable interaction hitbox */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onTerminalClick?.(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        position={[0, 0.12, 0]}
      >
        <cylinderGeometry args={[0.09, 0.09, 0.28, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Terminal post base brass washer */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.075, 0.08, 0.03, 24]} />
        <meshStandardMaterial metalness={0.85} roughness={0.25} color="#eab308" />
      </mesh>

      {/* Insulated collar cap */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.065, 0.07, 0.08, 24]} />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.1}
          color={hovered || isActiveWiringSource ? "#f59e0b" : baseColor}
          emissive={isActiveWiringSource ? "#f59e0b" : hovered ? "#b45309" : "#000000"}
          emissiveIntensity={isActiveWiringSource ? 0.6 : hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Top knurled brass cap */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.055, 0.06, 0.05, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.3} color="#eab308" />
      </mesh>

      {/* Central banana jack hole */}
      <mesh position={[0, 0.156, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
        <meshBasicMaterial color="#090a0f" />
      </mesh>

      {/* Pulsing ring indicator if active wiring source */}
      {isActiveWiringSource && (
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.13, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover tooltip label */}
      {hovered && (
        <Html position={[0, 0.35, 0]} center distanceFactor={7}>
          <div className="pointer-events-none rounded bg-zinc-950/95 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-100 shadow-xl border border-zinc-700/80 whitespace-nowrap">
            {name} ({label})
          </div>
        </Html>
      )}
    </group>
  );
}
