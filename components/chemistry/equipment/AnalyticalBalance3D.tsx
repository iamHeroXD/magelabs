"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BalanceProps {
  currentWeightG?: number;
  isDraftShieldClosed?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function AnalyticalBalance3D({
  currentWeightG = 0.0,
  isDraftShieldClosed = true,
  position = [0.68, 0.005, -0.08],
  rotation = [0, -0.15, 0],
}: BalanceProps) {
  const formattedWeight = currentWeightG.toFixed(4);

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Base Housing */}
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.07, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.25} />
      </mesh>

      {/* Front Angled Display Console */}
      <group position={[0, 0.05, 0.09]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.005, 0.055]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Backlit Vacuum Fluorescent / LED Display */}
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
        {[-0.045, 0.045].map((bx, bi) => (
          <mesh key={bi} position={[bx, 0.003, 0.015]}>
            <boxGeometry args={[0.026, 0.002, 0.012]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 2. Glass Draft Shield Enclosure */}
      <group position={[0, 0.17, -0.03]}>
        {/* Glass Box Chamber */}
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
        {/* Aluminum Corner Framework Pillars */}
        {[-0.09, 0.09].map((px, pxi) =>
          [-0.09, 0.09].map((pz, pzi) => (
            <mesh key={`${pxi}-${pzi}`} position={[px, 0, pz]}>
              <boxGeometry args={[0.004, 0.2, 0.004]} />
              <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.85} />
            </mesh>
          ))
        )}
      </group>

      {/* 3. Stainless Steel Circular Weighing Pan */}
      <mesh position={[0, 0.076, -0.03]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.004, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.96} />
      </mesh>
    </group>
  );
}
