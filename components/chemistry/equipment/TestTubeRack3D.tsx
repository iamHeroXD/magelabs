"use client";

import { useRef, Suspense } from "react";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { LabVesselState } from "./InteractiveVessels";
import { TestTubeRackGLB } from "./ModelGlassware3D";

export interface TestTubeSolution {
  id: string;
  name: string;
  chemicalFormula: string;
  color: string;
  volumeMl: number;
  pH: number;
  hasReaction?: boolean;
}

export const DEFAULT_TEST_TUBES: TestTubeSolution[] = [
  {
    id: "tube-kmno4",
    name: "Potassium Permanganate",
    chemicalFormula: "KMnO₄ (0.05 M)",
    color: "#6b21a8", // Intense violet/purple
    volumeMl: 15,
    pH: 6.8,
  },
  {
    id: "tube-fecl3",
    name: "Iron(III) Chloride",
    chemicalFormula: "FeCl₃ (0.1 M)",
    color: "#d97706", // Amber gold
    volumeMl: 18,
    pH: 2.1,
  },
  {
    id: "tube-cuso4",
    name: "Copper(II) Sulfate",
    chemicalFormula: "CuSO₄ (0.2 M)",
    color: "#0284c7", // Vivid cyan blue
    volumeMl: 20,
    pH: 4.2,
  },
  {
    id: "tube-niso4",
    name: "Nickel(II) Sulfate",
    chemicalFormula: "NiSO₄ (0.1 M)",
    color: "#059669", // Emerald green
    volumeMl: 16,
    pH: 5.5,
  },
  {
    id: "tube-mo",
    name: "Methyl Orange Indicator",
    chemicalFormula: "C₁₄H₁₄N₃NaO₃S",
    color: "#ea580c", // Vibrant orange
    volumeMl: 12,
    pH: 3.8,
  },
  {
    id: "tube-effervescent",
    name: "Reacting Carbonate Mix",
    chemicalFormula: "HCl + NaHCO₃ (Active Fizz)",
    color: "#f8fafc",
    volumeMl: 14,
    pH: 4.0,
    hasReaction: true,
  },
];

interface TestTubeRackProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  tubes?: TestTubeSolution[];
  heldVesselId?: string | null;
  onPickUpTube?: (tube: TestTubeSolution) => void;
  onPourIntoTube?: (tubeId: string) => void;
}

/**
 * Professional 6-Well Chemical Test Tube Rack
 * High-durability acrylic rack with 6 colorful chemical reaction tubes,
 * borosilicate glass refraction, graduation markings, and interactive pickup.
 */
export function TestTubeRack3D({
  position = [-0.18, 0.005, -0.16],
  rotation = [0, 0.12, 0],
  tubes = DEFAULT_TEST_TUBES,
  heldVesselId = null,
  onPickUpTube,
  onPourIntoTube,
}: TestTubeRackProps) {
  const rackRef = useRef<THREE.Group>(null);

  // Acrylic / Polypropylene rack material
  const rackMaterial = new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    roughness: 0.35,
    metalness: 0.15,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    transmission: 0.94,
    ior: 1.52,
    thickness: 0.002,
    side: THREE.DoubleSide,
  });

  return (
    <group ref={rackRef} position={position} rotation={rotation}>
      {/* ─────────────────────────────────────────────────────────────
          1. ACRYLIC TEST TUBE RACK FRAMEWORK
         ───────────────────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <group>
            <mesh position={[0, 0.006, 0]} receiveShadow castShadow material={rackMaterial}>
              <boxGeometry args={[0.32, 0.012, 0.09]} />
            </mesh>
            <mesh position={[0, 0.09, 0]} castShadow material={rackMaterial}>
              <boxGeometry args={[0.32, 0.008, 0.09]} />
            </mesh>
            <mesh position={[-0.155, 0.048, 0]} castShadow material={rackMaterial}>
              <boxGeometry args={[0.01, 0.096, 0.09]} />
            </mesh>
            <mesh position={[0.155, 0.048, 0]} castShadow material={rackMaterial}>
              <boxGeometry args={[0.01, 0.096, 0.09]} />
            </mesh>
            {[-0.125, -0.075, -0.025, 0.025, 0.075, 0.125].map((px, pi) => (
              <group key={`pin-${pi}`} position={[px, 0.012, -0.032]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.003, 0.003, 0.08, 12]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.042, 0]}>
                  <sphereGeometry args={[0.004, 12, 12]} />
                  <meshStandardMaterial color="#3b82f6" roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        }
      >
        <TestTubeRackGLB position={[0, 0, 0]} scale={0.15} />
      </Suspense>

      {/* ─────────────────────────────────────────────────────────────
          2. SIX CHEMICAL REACTION TEST TUBES
         ───────────────────────────────────────────────────────────── */}
      {tubes.map((tube, idx) => {
        const tx = -0.125 + idx * 0.05;
        const isTubeHeld = heldVesselId === tube.id;

        if (isTubeHeld) return null; // Tube is in the player's or robot's hand!

        const liquidHeight = Math.min(0.09, (tube.volumeMl / 25) * 0.09);

        return (
          <group
            key={tube.id}
            position={[tx, 0.01, 0.015]}
            onClick={(e) => {
              e.stopPropagation();
              if (heldVesselId && heldVesselId !== tube.id) {
                onPourIntoTube?.(tube.id);
              } else {
                onPickUpTube?.(tube);
              }
            }}
          >
            {/* Borosilicate Glass Tube Body */}
            <mesh position={[0, 0.065, 0]} castShadow material={glassMaterial}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 24, 1, true]} />
            </mesh>

            {/* Hemispherical Rounded Glass Bottom */}
            <mesh position={[0, 0.008, 0]} material={glassMaterial}>
              <sphereGeometry args={[0.012, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            </mesh>

            {/* Flanged Lip Rim */}
            <mesh position={[0, 0.125, 0]}>
              <torusGeometry args={[0.0125, 0.0015, 12, 24]} />
              <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0.05} />
            </mesh>

            {/* Colorful Chemical Solution Inside Tube */}
            {tube.volumeMl > 0 && (
              <group position={[0, 0.008, 0]}>
                {/* Hemispherical solution bottom */}
                <mesh>
                  <sphereGeometry args={[0.011, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                  <meshPhysicalMaterial
                    color={tube.color}
                    transparent
                    opacity={0.88}
                    roughness={0.1}
                    transmission={0.65}
                    ior={1.34}
                  />
                </mesh>
                {/* Cylindrical solution column */}
                <mesh position={[0, liquidHeight / 2, 0]}>
                  <cylinderGeometry args={[0.011, 0.011, liquidHeight, 20]} />
                  <meshPhysicalMaterial
                    color={tube.color}
                    transparent
                    opacity={0.88}
                    roughness={0.1}
                    transmission={0.65}
                    ior={1.34}
                  />
                </mesh>

                {/* Effervescent Micro-Bubbles (For active reaction tubes) */}
                {tube.hasReaction && (
                  <group position={[0, liquidHeight * 0.4, 0]}>
                    {[0, 1, 2, 3, 4, 5].map((bi) => (
                      <mesh
                        key={bi}
                        position={[
                          Math.sin(bi * 1.3) * 0.006,
                          (bi * 0.007) % liquidHeight,
                          Math.cos(bi * 1.3) * 0.006,
                        ]}
                      >
                        <sphereGeometry args={[0.0012, 8, 8]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
                      </mesh>
                    ))}
                  </group>
                )}
              </group>
            )}

            {/* Hover / Identification Tag with Billboard */}
            <Billboard position={[0, 0.145, 0]}>
              <mesh position={[0, 0, -0.001]}>
                <planeGeometry args={[0.048, 0.018]} />
                <meshBasicMaterial color="#090d16" transparent opacity={0.8} />
              </mesh>
              <Text
                fontSize={0.010}
                color="#38bdf8"
                anchorX="center"
                anchorY="middle"
              >
                {tube.chemicalFormula}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
