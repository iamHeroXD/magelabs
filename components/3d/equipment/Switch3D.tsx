"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { labAudio } from "@/lib/audio/sound-effects";
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
  const [hovered, setHovered] = useState(false);
  const bladeGroupRef = useRef<THREE.Group>(null);

  // Smooth mechanical animation of the knife blade arm
  useFrame((_, delta) => {
    if (!bladeGroupRef.current) return;
    const targetAngle = isOpen ? -Math.PI / 3.4 : 0;
    bladeGroupRef.current.rotation.z = THREE.MathUtils.damp(
      bladeGroupRef.current.rotation.z,
      targetAngle,
      14,
      delta
    );
  });

  const handleBladeClick = (e: any) => {
    e.stopPropagation();
    labAudio.playSwitchClack(isOpen);
    onToggleSwitch?.();
  };

  const t1 = component.terminals[0];
  const t2 = component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Heavy Glazed White Porcelain Insulator Base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 0.6]} />
        <meshStandardMaterial roughness={0.2} metalness={0.05} color="#f8fafc" />
      </mesh>

      {/* Brass Corner Mounting Studs */}
      {[
        [-0.52, 0.081, -0.22],
        [0.52, 0.081, -0.22],
        [-0.52, 0.081, 0.22],
        [0.52, 0.081, 0.22],
      ].map(([x, y, z], i) => (
        <mesh key={`screw-${i}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#eab308" />
        </mesh>
      ))}

      {/* Polished Machined Brass Nameplate */}
      <group position={[0, 0.082, -0.18]}>
        <mesh>
          <planeGeometry args={[0.55, 0.14]} />
          <meshStandardMaterial metalness={0.92} roughness={0.25} color="#ca8a04" />
        </mesh>
      </group>

      {/* Left Hinge Pillar (Solid Machined Brass Block) */}
      <mesh position={[-0.35, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.09, 0.12]} />
        <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
      </mesh>

      {/* Right Contact Spring Jaw Clip (Dual Phosphor Bronze Leaf Springs) */}
      <group position={[0.35, 0.13, 0]}>
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[0.04, 0.12, 0.015]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.04, 0.12, 0.015]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
        {/* Flared Entry Lips */}
        <mesh position={[-0.01, 0.065, -0.03]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.02, 0.02, 0.015]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
        <mesh position={[-0.01, 0.065, 0.03]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.02, 0.02, 0.015]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
      </group>

      {/* Pivoting Knife Arm Assembly - Directly Interactive */}
      <group
        ref={bladeGroupRef}
        position={[-0.35, 0.15, 0]}
        onClick={handleBladeClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        {/* Solid Heavy Copper Knife Blade */}
        <mesh position={[0.35, 0.015, 0]} castShadow>
          <boxGeometry args={[0.72, 0.032, 0.018]} />
          <meshStandardMaterial
            metalness={0.94}
            roughness={hovered ? 0.12 : 0.2}
            color={hovered ? "#fbbf24" : "#b45309"}
            emissive={hovered ? "#b45309" : "#000000"}
            emissiveIntensity={hovered ? 0.35 : 0}
          />
        </mesh>

        {/* Lathe-Turned Insulated Hardwood Handle */}
        <group position={[0.82, 0.015, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.036, 0.032, 0.22, 16]} />
            <meshStandardMaterial
              roughness={0.4}
              metalness={0.1}
              color={hovered ? "#92400e" : "#78350f"}
              emissive={hovered ? "#451a03" : "#000000"}
              emissiveIntensity={hovered ? 0.25 : 0}
            />
          </mesh>
          {/* Polished brass ferrule collar */}
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.038, 0.038, 0.02, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.2} color="#eab308" />
          </mesh>
        </group>

        {/* Pivot Hinge Pin Rivet */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.07, 16]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#cbd5e1" />
        </mesh>
      </group>

      {/* Terminals placed at Canonical Coordinates */}
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
