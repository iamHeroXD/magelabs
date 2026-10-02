"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface BalanceProps {
  currentWeightG?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * 4-Decimal Analytical Laboratory Balance (0.0001 g Resolution)
 * Microbalance with glass draft shield enclosure, interactive sliding draft door,
 * working Tare zeroing button, live thermal micro-drift, and backlit fluorescent display.
 */
export function AnalyticalBalance3D({
  currentWeightG = 0.0,
  position = [0.68, 0.005, -0.08],
  rotation = [0, -0.15, 0],
}: BalanceProps) {
  const [tareOffset, setTareOffset] = useState(0);
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const netWeight = Math.max(0, currentWeightG - tareOffset);
  const formattedWeight = netWeight.toFixed(4);

  const handleTare = (e: any) => {
    e.stopPropagation();
    chemistryAudio.playTareChime();
    setTareOffset(currentWeightG);
  };

  const handleToggleDoor = (e: any) => {
    e.stopPropagation();
    chemistryAudio.playStopcockClick();
    setIsDoorOpen((prev) => !prev);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* ─────────────────────────────────────────────────────────────
          1. CAST ALUMINUM BASE HOUSING & LEVELING FEET
         ───────────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.07, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.25} />
      </mesh>

      {/* Spirit Level Bubble Vial on corner */}
      <group position={[0.08, 0.072, 0.11]}>
        <mesh>
          <cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.002, 0]}>
          <circleGeometry args={[0.006, 16]} />
          <meshBasicMaterial color="#84cc16" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. FRONT ANGLED TELEMETRY CONSOLE & TARE BUTTONS
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.05, 0.09]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.005, 0.055]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Backlit Vacuum Fluorescent / Green Matrix Display */}
        <mesh position={[0, 0.003, -0.006]}>
          <planeGeometry args={[0.14, 0.026]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
        <Text
          position={[0, 0.005, -0.006]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.015}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          {`${formattedWeight} g`}
        </Text>

        {/* Tare and Zero Buttons */}
        <group position={[-0.045, 0.003, 0.015]} onClick={handleTare}>
          <mesh>
            <boxGeometry args={[0.026, 0.002, 0.012]} />
            <meshStandardMaterial color="#059669" roughness={0.4} />
          </mesh>
          <Text
            position={[0, 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.005}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {"TARE"}
          </Text>
        </group>

        <group position={[0.045, 0.003, 0.015]} onClick={handleToggleDoor}>
          <mesh>
            <boxGeometry args={[0.026, 0.002, 0.012]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          <Text
            position={[0, 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.005}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {isDoorOpen ? "CLOSE" : "DOOR"}
          </Text>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. GLASS DRAFT SHIELD ENCLOSURE WITH SLIDING DOOR
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.17, -0.03]} onClick={handleToggleDoor}>
        {/* Fixed Glass Panels (Rear, Top, Left) */}
        <mesh>
          <boxGeometry args={[0.18, 0.2, 0.18]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.25}
            roughness={0.05}
            transmission={0.95}
            ior={1.52}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Sliding Right Door (Animated open / closed position) */}
        <mesh position={[0.091, 0, isDoorOpen ? 0.08 : 0]}>
          <boxGeometry args={[0.003, 0.19, 0.17]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.95}
            ior={1.52}
          />
        </mesh>

        {/* Aluminum Corner Framework Columns */}
        {[-0.09, 0.09].map((px, pxi) =>
          [-0.09, 0.09].map((pz, pzi) => (
            <mesh key={`${pxi}-${pzi}`} position={[px, 0, pz]}>
              <boxGeometry args={[0.004, 0.2, 0.004]} />
              <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.85} />
            </mesh>
          ))
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. STAINLESS STEEL CIRCULAR WEIGHING PAN
         ───────────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.076, -0.03]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.004, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.96} />
      </mesh>
    </group>
  );
}
