"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Switch3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  onToggleSwitch?: () => void;
}

export function Switch3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  onToggleSwitch,
}: Switch3DProps) {
  const isOpen = Boolean(component.properties.isOpen);
  const bladeGroupRef = useRef<THREE.Group>(null);

  // Smooth mechanical animation of the knife blade arm
  useFrame((_, delta) => {
    if (!bladeGroupRef.current) return;
    const targetAngle = isOpen ? -Math.PI / 3.2 : 0;
    bladeGroupRef.current.rotation.z = THREE.MathUtils.damp(
      bladeGroupRef.current.rotation.z,
      targetAngle,
      12,
      delta
    );
  });

  const t1 = component.terminals[0];
  const t2 = component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy bakelite / porcelain base plate */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 0.6]} />
        <meshStandardMaterial roughness={0.8} metalness={0.1} color="#18181b" />
      </mesh>

      {/* Hinge pillar (left side) */}
      <mesh position={[-0.35, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.09, 0.12]} />
        <meshStandardMaterial metalness={0.85} roughness={0.25} color="#eab308" />
      </mesh>

      {/* Contact Jaw spring clip (right side) */}
      <group position={[0.35, 0.13, 0]}>
        {/* Left prong */}
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[0.04, 0.12, 0.015]} />
          <meshStandardMaterial metalness={0.85} roughness={0.25} color="#eab308" />
        </mesh>
        {/* Right prong */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.04, 0.12, 0.015]} />
          <meshStandardMaterial metalness={0.85} roughness={0.25} color="#eab308" />
        </mesh>
      </group>

      {/* Pivoting Knife Arm Assembly */}
      <group
        ref={bladeGroupRef}
        position={[-0.35, 0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSwitch?.();
        }}
      >
        {/* Copper knife blade */}
        <mesh position={[0.35, 0.015, 0]} castShadow>
          <boxGeometry args={[0.72, 0.03, 0.018]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#b45309" />
        </mesh>

        {/* Insulated cylinder handle */}
        <mesh position={[0.78, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.18, 16]} />
          <meshStandardMaterial roughness={0.6} metalness={0.1} color="#451a03" />
        </mesh>

        {/* Pivot rivet */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.07, 16]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#d4d4d8" />
        </mesh>
      </group>

      {/* Terminals */}
      {t1 && (
        <TerminalPost3D
          id={t1.id}
          name={t1.name}
          label={t1.label}
          polarity="neutral"
          position={[-0.35, 0.08, 0.2]}
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
          position={[0.35, 0.08, 0.2]}
          isActiveWiringSource={activeWiringTerminalId === t2.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {/* Interactive Switch State Badge */}
      <Html position={[0, 0.45, 0]} transform distanceFactor={3.5}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSwitch?.();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-lg border transition-all cursor-pointer select-none ${
            isOpen
              ? "bg-red-950/80 text-red-400 border-red-700/80 hover:bg-red-900"
              : "bg-emerald-950/80 text-emerald-400 border-emerald-700/80 hover:bg-emerald-900"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-red-500" : "bg-emerald-400"}`} />
          {isOpen ? "SWITCH: OPEN (Click to close)" : "SWITCH: CLOSED (Click to open)"}
        </button>
      </Html>
    </group>
  );
}
