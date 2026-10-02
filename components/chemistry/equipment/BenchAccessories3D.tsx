"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BenchAccessoriesProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Authentic Laboratory Bench Accessories
 * 12-well porcelain spot test plate with colorful micro-reactions,
 * borosilicate watch glass with crystalline reagent precipitate,
 * stainless steel chemical micro-spatula, beaker with glass stirring rods,
 * digital laboratory countdown timer, and laboratory glassware marker.
 */
export function BenchAccessories3D({
  position = [0.08, 0.005, -0.15],
  rotation = [0, 0, 0],
}: BenchAccessoriesProps) {
  const groupRef = useRef<THREE.Group>(null);

  const porcelainMaterial = new THREE.MeshStandardMaterial({
    color: "#f8fafc",
    roughness: 0.18,
    metalness: 0.05,
  });

  const steelMaterial = new THREE.MeshStandardMaterial({
    color: "#e2e8f0",
    roughness: 0.2,
    metalness: 0.92,
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ─────────────────────────────────────────────────────────────
          1. PORCELAIN 12-WELL SPOT TEST REACTION PLATE
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.005, 0]}>
        {/* Porcelain Glazed Tile Body (12cm x 9cm x 1cm) */}
        <mesh receiveShadow castShadow material={porcelainMaterial}>
          <boxGeometry args={[0.13, 0.01, 0.095]} />
        </mesh>

        {/* 3x4 Array of Hemispherical Reaction Cavity Depressions */}
        {[-0.045, -0.015, 0.015, 0.045].map((wx, xi) =>
          [-0.03, 0, 0.03].map((wz, zi) => {
            // A couple of wells contain active test reagents!
            const hasLiquid = (xi + zi) % 2 === 0;
            const liquidColors = ["#f43f5e", "#0284c7", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
            const color = liquidColors[(xi * 3 + zi) % liquidColors.length];

            return (
              <group key={`well-${xi}-${zi}`} position={[wx, 0.005, wz]}>
                {/* Concave Cavity Rim */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.009, 0.011, 20]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.3} side={THREE.DoubleSide} />
                </mesh>
                {/* Micro-droplet test solution */}
                {hasLiquid && (
                  <mesh position={[0, 0.001, 0]}>
                    <circleGeometry args={[0.0085, 20]} />
                    <meshPhysicalMaterial
                      color={color}
                      transparent
                      opacity={0.85}
                      roughness={0.1}
                    />
                  </mesh>
                )}
              </group>
            );
          })
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. WATCH GLASS WITH CRYSTALLINE CHEMICAL POWDER (NaCl / CuSO4)
         ───────────────────────────────────────────────────────────── */}
      <group position={[0.11, 0.005, 0.01]}>
        {/* Curved Convex Glass Dish */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[0.035, 24, 16, 0, Math.PI * 2, 0, 0.45]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.38}
            roughness={0.06}
            transmission={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* White / Cyan Crystalline Salt Precipitate Powder Mound */}
        <mesh position={[0, 0.002, 0]}>
          <coneGeometry args={[0.018, 0.008, 16]} />
          <meshStandardMaterial color="#f0fdf4" roughness={0.95} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. STAINLESS STEEL MICRO-SPATULA SPOON
         ───────────────────────────────────────────────────────────── */}
      <group position={[0.11, 0.006, -0.045]} rotation={[0, 0.35, 0]}>
        {/* Flat Stem Shaft */}
        <mesh castShadow material={steelMaterial}>
          <boxGeometry args={[0.12, 0.0015, 0.005]} />
        </mesh>
        {/* Flat Scoop Blade (Left) */}
        <mesh position={[-0.065, 0, 0]} material={steelMaterial}>
          <boxGeometry args={[0.016, 0.001, 0.009]} />
        </mesh>
        {/* Spoon Curvature (Right) */}
        <mesh position={[0.065, 0.001, 0]} material={steelMaterial}>
          <boxGeometry args={[0.016, 0.002, 0.008]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. SMALL BEAKER WITH GLASS STIRRING RODS
         ───────────────────────────────────────────────────────────── */}
      <group position={[-0.11, 0.005, 0.02]}>
        {/* 50mL Tall Glass Beaker */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 24, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.32}
            roughness={0.06}
            transmission={0.94}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Beaker Bottom */}
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.004, 24]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} transmission={0.94} />
        </mesh>

        {/* 3 Glass Stirring Rods leaning at natural angles */}
        {[-0.25, 0.15, 0.35].map((angle, ri) => (
          <mesh
            key={`rod-${ri}`}
            position={[Math.sin(angle) * 0.006, 0.05, Math.cos(angle) * 0.006]}
            rotation={[angle * 0.5, 0, angle]}
            castShadow
          >
            <cylinderGeometry args={[0.0025, 0.0025, 0.11, 12]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.4}
              roughness={0.05}
              transmission={0.92}
            />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. DIGITAL LABORATORY BENCH COUNTDOWN TIMER
         ───────────────────────────────────────────────────────────── */}
      <group position={[-0.1, 0.005, -0.045]} rotation={[-0.2, 0.2, 0]}>
        {/* Matte Plastic Enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.055, 0.018, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Backlit Digital LCD Screen */}
        <mesh position={[0, 0.01, -0.006]}>
          <planeGeometry args={[0.042, 0.018]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
        {/* Digital Time Telemetry Display */}
        <Text
          position={[0, 0.011, -0.006]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.01}
          color="#4ade80"
          anchorX="center"
          anchorY="middle"
        >
          {"04:25"}
        </Text>
        {/* Rubber Start/Stop Buttons */}
        {[-0.014, 0, 0.014].map((btnX, bi) => (
          <mesh key={bi} position={[btnX, 0.01, 0.014]}>
            <cylinderGeometry args={[0.004, 0.004, 0.003, 12]} />
            <meshStandardMaterial color={bi === 0 ? "#ef4444" : bi === 1 ? "#3b82f6" : "#22c55e"} />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. GLASSWARE PERMANENT MARKER (SHARPIE)
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.005, 0.06]} rotation={[0, 0.85, 0]}>
        {/* Marker Body Barrel */}
        <mesh castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Silver Brand Band */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.0061, 0.0061, 0.012, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Black Cap with Pocket Clip */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.0065, 0.0065, 0.04, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.007, 0.042, 0]}>
          <boxGeometry args={[0.003, 0.028, 0.003]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
