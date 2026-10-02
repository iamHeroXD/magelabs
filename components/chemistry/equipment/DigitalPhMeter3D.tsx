"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface PhMeterProps {
  currentPh: number;
  temperatureC?: number;
  isHighlighted?: boolean;
}

/**
 * Precision Digital Laboratory Bench pH / mV Meter
 * High-accuracy digital glass combination electrode with Automatic Temperature Compensation (ATC),
 * live electrochemical Nernst equation millivolt telemetry, and interactive mode button.
 */
export function DigitalPhMeter3D({
  currentPh,
  temperatureC = 25.0,
  isHighlighted = false,
}: PhMeterProps) {
  const [displayMode, setDisplayMode] = useState<"pH" | "mV">("pH");
  const [liveJitter, setLiveJitter] = useState(0);

  // Micro-fluctuation in sensor reading (real-world electrode noise ~ ±0.005)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    setLiveJitter(Math.sin(t * 8.2) * 0.004 + Math.cos(t * 4.7) * 0.003);
  });

  const effectivePh = Math.max(0, Math.min(14, currentPh + liveJitter));
  const formattedPh = effectivePh.toFixed(2);

  // Nernst Equation slope at 25°C: E = (7.0 - pH) * 59.16 mV
  const calculatedMv = ((7.0 - effectivePh) * 59.16).toFixed(1);

  const toggleMode = (e: any) => {
    e.stopPropagation();
    chemistryAudio.playBeep();
    setDisplayMode((prev) => (prev === "pH" ? "mV" : "pH"));
  };

  return (
    <group
      position={[0.26, 0.005, 0.05]}
      onClick={toggleMode}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BENCHTOP METER CHASSIS & CONSOLE
         ───────────────────────────────────────────────────────────── */}
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

      {/* Rubber Anti-Slip Feet */}
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
        {/* Dark LCD Bezel Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.11, 0.002, 0.065]} />
          <meshStandardMaterial color="#090a0f" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Backlit Display Face (Cyan Electroluminescent Glass) */}
        <mesh position={[0, 0.002, 0]}>
          <planeGeometry args={[0.098, 0.052]} />
          <meshBasicMaterial color="#082f49" />
        </mesh>

        {/* Primary Digital Telemetry Readout */}
        <Text
          position={[0, 0.004, -0.005]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.022}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {displayMode === "pH" ? `${formattedPh} pH` : `${calculatedMv} mV`}
        </Text>

        {/* Secondary Info: ATC and Calibration Status */}
        <Text
          position={[0, 0.004, 0.016]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.008}
          color="#7dd3fc"
          anchorX="center"
          anchorY="middle"
        >
          {`ATC ${temperatureC.toFixed(1)}°C · ${displayMode} MODE · CAL OK`}
        </Text>

        {/* Membrane Keypad Buttons */}
        {[-0.032, 0, 0.032].map((btnX, i) => (
          <mesh key={i} position={[btnX, 0.001, 0.04]}>
            <boxGeometry args={[0.022, 0.002, 0.012]} />
            <meshStandardMaterial color={i === 1 ? "#0284c7" : "#334155"} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ARTICULATED ELECTRODE STAND ARM
         ───────────────────────────────────────────────────────────── */}
      <group position={[-0.085, 0, -0.02]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.04, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Chrome Vertical Column */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.0045, 0.0045, 0.2, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Horizontal Bracket Arm Reaching toward titration flask */}
        <mesh position={[-0.08, 0.21, 0.01]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.18, 0.007, 0.007]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. GLASS COMBINATION pH ELECTRODE WITH BULB & REFERENCE
         ───────────────────────────────────────────────────────────── */}
      <group position={[-0.26, 0.08, -0.05]}>
        {/* Coaxial BNC Cable Connector */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.02, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} />
        </mesh>
        {/* Glass Electrode Body Shaft */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.1, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            roughness={0.05}
            transmission={0.9}
            ior={1.52}
          />
        </mesh>
        {/* Inner KCl Electrolyte Column */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.09, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} />
        </mesh>
        {/* Sensitive Glass Membrane Bulb Tip (Dipped in solution) */}
        <mesh position={[0, -0.042, 0]}>
          <sphereGeometry args={[0.005, 16, 16]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.8}
            roughness={0.02}
            transmission={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}
