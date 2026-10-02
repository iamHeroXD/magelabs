"use client";

import { useRef } from "react";
import * as THREE from "three";

interface PipetteCarouselProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Professional Laboratory Pipette Carousel & Sterile Tip Box
 * Rotating carousel stand holding three micropipettes (10 µL, 200 µL, 1000 µL)
 * with digital volume display dials, push plungers, and tip ejection buttons.
 */
export function PipetteCarousel3D({
  position = [-0.46, 0.005, -0.16],
  rotation = [0, -0.2, 0],
}: PipetteCarouselProps) {
  const groupRef = useRef<THREE.Group>(null);

  const standMaterial = new THREE.MeshStandardMaterial({
    color: "#f8fafc",
    roughness: 0.35,
    metalness: 0.2,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: "#e2e8f0",
    roughness: 0.15,
    metalness: 0.95,
  });

  const pipettes = [
    { volume: "10 µL", color: "#60a5fa", angle: 0 },
    { volume: "200 µL", color: "#facc15", angle: (2 * Math.PI) / 3 },
    { volume: "1000 µL", color: "#3b82f6", angle: (4 * Math.PI) / 3 },
  ];

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ─────────────────────────────────────────────────────────────
          1. CIRCULAR WEIGHTED STAND BASE & SUPPORT COLUMN
         ───────────────────────────────────────────────────────────── */}
      {/* Weighted Disc Base */}
      <mesh position={[0, 0.008, 0]} receiveShadow castShadow material={standMaterial}>
        <cylinderGeometry args={[0.07, 0.075, 0.016, 32]} />
      </mesh>

      {/* Chrome Vertical Column */}
      <mesh position={[0, 0.14, 0]} castShadow material={chromeMaterial}>
        <cylinderGeometry args={[0.008, 0.008, 0.26, 16]} />
      </mesh>

      {/* Rotating Upper Head Carousel Disc */}
      <mesh position={[0, 0.26, 0]} castShadow material={standMaterial}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 32]} />
      </mesh>
      {/* Chrome Top Finial Knob */}
      <mesh position={[0, 0.28, 0]} material={chromeMaterial}>
        <sphereGeometry args={[0.012, 16, 16]} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. THREE MICROPIPETTES HANGING ON THE CAROUSEL
         ───────────────────────────────────────────────────────────── */}
      {pipettes.map((p, idx) => {
        const radius = 0.05;
        const px = Math.cos(p.angle) * radius;
        const pz = Math.sin(p.angle) * radius;

        return (
          <group
            key={idx}
            position={[px, 0.16, pz]}
            rotation={[0, -p.angle, 0]}
          >
            {/* Pipette Ergonomic Body Grip */}
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.008, 0.16, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>

            {/* Finger Hook Rest */}
            <mesh position={[0, 0.07, 0.012]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.018, 0.02, 0.012]} />
              <meshStandardMaterial color={p.color} roughness={0.3} />
            </mesh>

            {/* Top Push Plunger Button with Volume Color Coding */}
            <mesh position={[0, 0.095, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.015, 16]} />
              <meshStandardMaterial color={p.color} roughness={0.3} />
            </mesh>

            {/* Digital Volume Counter Window */}
            <mesh position={[0, 0.03, 0.009]}>
              <boxGeometry args={[0.012, 0.022, 0.004]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.03, 0.011]}>
              <planeGeometry args={[0.009, 0.018]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Slim Lower Ejector Shaft */}
            <mesh position={[0, -0.11, 0]} castShadow>
              <cylinderGeometry args={[0.004, 0.0025, 0.08, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* ─────────────────────────────────────────────────────────────
          3. STERILE DISPOSABLE PIPETTE TIP BOX BESIDE STAND
         ───────────────────────────────────────────────────────────── */}
      <group position={[0.13, 0.02, 0]}>
        {/* Base Polypropylene Box */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 0.04, 0.07]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* White Tip Grid Insert */}
        <mesh position={[0, 0.021, 0]}>
          <boxGeometry args={[0.086, 0.004, 0.066]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Array of Yellow/Blue Pipette Tips in Grid */}
        {[-0.03, -0.015, 0, 0.015, 0.03].map((tx, ti) =>
          [-0.02, 0, 0.02].map((tz, zi) => (
            <mesh key={`tip-${ti}-${zi}`} position={[tx, 0.032, tz]}>
              <cylinderGeometry args={[0.002, 0.0008, 0.018, 8]} />
              <meshPhysicalMaterial
                color={ti % 2 === 0 ? "#facc15" : "#60a5fa"}
                transparent
                opacity={0.85}
                roughness={0.2}
              />
            </mesh>
          ))
        )}
        {/* Hinged Clear Lid (Ajar) */}
        <mesh position={[0, 0.048, -0.01]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.092, 0.004, 0.072]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            roughness={0.1}
            transmission={0.9}
          />
        </mesh>
      </group>
    </group>
  );
}
