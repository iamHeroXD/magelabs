"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PhMeterProps {
  currentPh: number;
  temperatureC?: number;
  isHighlighted?: boolean;
}

export function DigitalPhMeter3D({
  currentPh,
  temperatureC = 25.0,
  isHighlighted = false,
}: PhMeterProps) {
  const formattedPh = currentPh.toFixed(2);

  return (
    <group position={[0.26, 0.005, 0.05]}>
      {/* 1. Benchtop Meter Chassis */}
      <mesh
        position={[0, 0.032, 0]}
        rotation={[-0.18, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.15, 0.05, 0.17]} />
        <meshStandardMaterial
          color={isHighlighted ? "#bfdbfe" : "#f1f5f9"}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Rubber anti-slip feet */}
      {[-0.06, 0.06].map((x, xi) =>
        [-0.06, 0.06].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 0.004, z]}>
            <cylinderGeometry args={[0.008, 0.008, 0.008, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Recessed Backlit LCD Panel */}
      <group position={[0, 0.058, -0.015]} rotation={[-0.18, 0, 0]}>
        {/* Dark LCD Bezel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.11, 0.002, 0.065]} />
          <meshStandardMaterial color="#090a0f" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Backlit Display Face (Cyan / Green tinted) */}
        <mesh position={[0, 0.002, 0]}>
          <planeGeometry args={[0.098, 0.052]} />
          <meshBasicMaterial color="#0c2e3b" />
        </mesh>

        {/* Primary Digital pH Readout */}
        <Text
          position={[0, 0.004, -0.005]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.024}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {`${formattedPh} pH`}
        </Text>

        {/* Secondary Info: ATC and Temp */}
        <Text
          position={[0, 0.004, 0.016]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.0085}
          color="#7dd3fc"
          anchorX="center"
          anchorY="middle"
        >
          {`ATC 25.0°C · CAL OK`}
        </Text>

        {/* Membrane Keypad Buttons */}
        {[-0.032, 0, 0.032].map((btnX, i) => (
          <mesh key={i} position={[btnX, 0.001, 0.04]}>
            <boxGeometry args={[0.022, 0.002, 0.012]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 2. Articulated Electrode Stand */}
      <group position={[-0.085, 0, -0.02]}>
        {/* Base bracket */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.04, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Vertical chrome rod */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.0045, 0.0045, 0.2, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Articulated horizontal arm extending left toward the flask */}
        <mesh position={[-0.08, 0.21, 0.01]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.18, 0.007, 0.007]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* 3. Glass Combination pH Electrode (suspended into flask) */}
      <group position={[-0.26, 0.08, -0.05]}>
        {/* Blue cap & BNC cable connector */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.02, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} />
        </mesh>
        {/* Glass electrode stem */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.1, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.65}
            roughness={0.05}
            transmission={0.9}
            ior={1.5}
          />
        </mesh>
        {/* Glass bulb measuring tip (submerged in analyte solution) */}
        <mesh position={[0, -0.042, 0]}>
          <sphereGeometry args={[0.005, 16, 16]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.8}
            roughness={0.1}
            transmission={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}
