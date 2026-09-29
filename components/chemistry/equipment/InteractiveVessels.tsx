"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

export interface LabVesselState {
  id: string;
  name: string;
  type: "beaker" | "flask" | "cylinder" | "dropper";
  capacityMl: number;
  currentVolumeMl: number;
  solutionId: string;
  solutionColor: string;
  pH: number;
  indicator?: string;
  position: [number, number, number];
  isHeld?: boolean;
}

interface VesselsProps {
  vessels: LabVesselState[];
  heldVesselId: string | null;
  onPickUpVessel: (id: string) => void;
  onPourIntoVessel: (targetId: string) => void;
}

export function InteractiveVessels({
  vessels,
  heldVesselId,
  onPickUpVessel,
  onPourIntoVessel,
}: VesselsProps) {
  return (
    <group>
      {vessels.map((v) => {
        if (v.id === heldVesselId) return null; // Rendered in first-person hand view

        const heightScale = Math.min(1, Math.max(0.1, v.currentVolumeMl / v.capacityMl));

        return (
          <group
            key={v.id}
            position={v.position}
            onClick={(e) => {
              e.stopPropagation();
              if (heldVesselId && heldVesselId !== v.id) {
                onPourIntoVessel(v.id);
              } else {
                onPickUpVessel(v.id);
              }
            }}
          >
            {/* 1. BEAKER MODEL */}
            {v.type === "beaker" && (
              <group position={[0, 0, 0]}>
                {/* Clear Borosilicate Glass Cylinder */}
                <mesh position={[0, 0.045, 0]} castShadow>
                  <cylinderGeometry args={[0.038, 0.038, 0.09, 32, 1, true]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.35}
                    roughness={0.06}
                    transmission={0.92}
                    ior={1.52}
                    thickness={0.002}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Glass Bottom */}
                <mesh position={[0, 0.003, 0]}>
                  <cylinderGeometry args={[0.038, 0.038, 0.006, 32]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.4}
                    roughness={0.05}
                    transmission={0.92}
                  />
                </mesh>
                {/* Flanged Lip Spout */}
                <mesh position={[0, 0.09, 0]}>
                  <torusGeometry args={[0.039, 0.0025, 12, 32]} />
                  <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0.04} />
                </mesh>
                {/* Graduations */}
                {[0.025, 0.045, 0.065].map((y, idx) => (
                  <mesh key={idx} position={[0, y, 0]}>
                    <ringGeometry args={[0.0382, 0.0388, 24]} />
                    <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
                  </mesh>
                ))}
                {/* Liquid Contents */}
                {v.currentVolumeMl > 0 && (
                  <mesh position={[0, 0.003 + (heightScale * 0.08) / 2, 0]}>
                    <cylinderGeometry args={[0.036, 0.036, heightScale * 0.08, 24]} />
                    <meshPhysicalMaterial
                      color={v.solutionColor}
                      transparent
                      opacity={0.82}
                      roughness={0.1}
                      transmission={0.65}
                      ior={1.34}
                    />
                  </mesh>
                )}
                {/* Floating Name Label */}
                <Text
                  position={[0, 0.115, 0]}
                  fontSize={0.015}
                  color="#f8fafc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`${v.name} (${v.currentVolumeMl.toFixed(0)}mL)`}
                </Text>
              </group>
            )}

            {/* 2. GRADUATED CYLINDER MODEL */}
            {v.type === "cylinder" && (
              <group position={[0, 0, 0]}>
                {/* Hexagonal Polypropylene Base */}
                <mesh position={[0, 0.005, 0]} receiveShadow>
                  <cylinderGeometry args={[0.032, 0.035, 0.01, 6]} />
                  <meshStandardMaterial color="#334155" roughness={0.4} />
                </mesh>
                {/* Tall Glass Cylinder Tube */}
                <mesh position={[0, 0.11, 0]} castShadow>
                  <cylinderGeometry args={[0.018, 0.018, 0.2, 24, 1, true]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.35}
                    roughness={0.06}
                    transmission={0.92}
                    ior={1.52}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Liquid */}
                {v.currentVolumeMl > 0 && (
                  <mesh position={[0, 0.01 + (heightScale * 0.18) / 2, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, heightScale * 0.18, 24]} />
                    <meshPhysicalMaterial
                      color={v.solutionColor}
                      transparent
                      opacity={0.8}
                      roughness={0.1}
                      transmission={0.7}
                    />
                  </mesh>
                )}
                <Text
                  position={[0, 0.22, 0]}
                  fontSize={0.014}
                  color="#f8fafc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`${v.name}`}
                </Text>
              </group>
            )}

            {/* 3. FLASK MODEL */}
            {v.type === "flask" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.045, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.05, 0.08, 32, 1, true]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.35}
                    roughness={0.06}
                    transmission={0.92}
                    ior={1.52}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Flask Glass Bottom */}
                <mesh position={[0, 0.003, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.006, 32]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.4}
                    roughness={0.05}
                    transmission={0.92}
                  />
                </mesh>
                {v.currentVolumeMl > 0 && (
                  <mesh position={[0, 0.003 + (heightScale * 0.06) / 2, 0]}>
                    <cylinderGeometry args={[0.025, 0.048, heightScale * 0.06, 24]} />
                    <meshPhysicalMaterial
                      color={v.solutionColor}
                      transparent
                      opacity={0.8}
                      roughness={0.1}
                      transmission={0.65}
                    />
                  </mesh>
                )}
                <Text
                  position={[0, 0.115, 0]}
                  fontSize={0.015}
                  color="#f8fafc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`${v.name} (${v.currentVolumeMl.toFixed(0)}mL)`}
                </Text>
              </group>
            )}

            {/* 4. DROPPER BOTTLE MODEL */}
            {v.type === "dropper" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.035, 0]} castShadow>
                  <cylinderGeometry args={[0.018, 0.018, 0.07, 24]} />
                  <meshPhysicalMaterial color="#78350f" transparent opacity={0.85} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.085, 0]}>
                  <sphereGeometry args={[0.01, 16, 16]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.8} />
                </mesh>
                <Text
                  position={[0, 0.11, 0]}
                  fontSize={0.014}
                  color="#f8fafc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {v.name}
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
