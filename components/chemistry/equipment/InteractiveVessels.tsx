"use client";

import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { BeakerGLB, ConicalFlaskGLB, MeasuringCylinderGLB } from "./ModelGlassware3D";

export interface LabVesselState {
  id: string;
  name: string;
  type: "beaker" | "flask" | "cylinder" | "dropper";
  capacityMl: number;
  currentVolumeMl: number;
  solutionId: string;
  solutionColor: string;
  pH: number;
  temperatureC?: number;
  isReacting?: boolean;
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

/**
 * Animated Reactive Liquid Column with Effervescence Bubbles & Meniscus Shimmer
 */
function ReactiveFluidColumn({
  radiusTop,
  radiusBottom,
  height,
  color,
  isReacting = false,
}: {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  color: string;
  isReacting?: boolean;
}) {
  const bubblesRef = useRef<THREE.Group>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);

  // Generate 8 procedural bubble offsets
  const bubbleSeeds = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      x: (Math.sin(i * 1.7) * 0.7) * radiusTop,
      z: (Math.cos(i * 2.3) * 0.7) * radiusTop,
      speed: 0.08 + (i % 4) * 0.04,
      offset: i * 0.25,
      scale: 0.0012 + (i % 3) * 0.0006,
    }));
  }, [radiusTop]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle fluid meniscus shimmer
    if (meniscusRef.current) {
      meniscusRef.current.position.y = height + Math.sin(t * 3.5) * 0.0003;
    }

    // Animate rising effervescence micro-bubbles
    if (bubblesRef.current && isReacting) {
      bubblesRef.current.children.forEach((child, idx) => {
        const seed = bubbleSeeds[idx];
        const bubbleY = ((t * seed.speed + seed.offset) % height);
        child.position.y = bubbleY;
      });
    }
  });

  return (
    <group>
      {/* Cylindrical / Conical Solution Mass */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radiusTop, radiusBottom, height, 24]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.84}
          roughness={0.08}
          transmission={0.65}
          ior={1.34}
        />
      </mesh>

      {/* Glossy Top Fluid Meniscus Surface */}
      <mesh ref={meniscusRef} position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radiusTop * 0.99, 24]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.92}
          roughness={0.04}
          transmission={0.7}
        />
      </mesh>

      {/* Effervescent Rising Micro-Bubbles (when reacting or boiling) */}
      {isReacting && (
        <group ref={bubblesRef}>
          {bubbleSeeds.map((seed, i) => (
            <mesh key={i} position={[seed.x, 0, seed.z]}>
              <sphereGeometry args={[seed.scale, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
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
        const temp = v.temperatureC ?? 25.0;

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
                {/* Authentic 3D Beaker Model with Procedural Fallback */}
                <Suspense
                  fallback={
                    <group>
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
                      <mesh position={[0, 0.003, 0]}>
                        <cylinderGeometry args={[0.038, 0.038, 0.006, 32]} />
                        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} roughness={0.05} transmission={0.92} />
                      </mesh>
                    </group>
                  }
                >
                  <BeakerGLB
                    size={v.capacityMl === 100 ? 100 : v.capacityMl === 500 ? 500 : 250}
                  />
                </Suspense>

                {/* Reactive Liquid Contents */}
                {v.currentVolumeMl > 0 && (
                  <group position={[0, 0.004, 0]}>
                    <ReactiveFluidColumn
                      radiusTop={0.036}
                      radiusBottom={0.036}
                      height={heightScale * 0.08}
                      color={v.solutionColor}
                      isReacting={v.isReacting || temp > 50}
                    />
                  </group>
                )}

                {/* Floating Telemetry Badge with Camera-Facing Billboard */}
                <Billboard position={[0, 0.125, 0]}>
                  <mesh position={[0, 0.002, -0.002]}>
                    <planeGeometry args={[0.16, 0.04]} />
                    <meshBasicMaterial color="#090d16" transparent opacity={0.78} />
                  </mesh>
                  <Text
                    position={[0, 0.011, 0]}
                    fontSize={0.013}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`${v.name} (${v.currentVolumeMl.toFixed(0)} mL)`}
                  </Text>
                  <Text
                    position={[0, -0.007, 0]}
                    fontSize={0.010}
                    color={v.pH < 7 ? "#f43f5e" : v.pH > 7 ? "#38bdf8" : "#4ade80"}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`pH ${v.pH.toFixed(1)} · ${temp.toFixed(1)}°C`}
                  </Text>
                </Billboard>
              </group>
            )}

            {/* 2. GRADUATED CYLINDER MODEL */}
            {v.type === "cylinder" && (
              <group position={[0, 0, 0]}>
                <Suspense
                  fallback={
                    <group>
                      <mesh position={[0, 0.005, 0]} receiveShadow>
                        <cylinderGeometry args={[0.032, 0.035, 0.01, 6]} />
                        <meshStandardMaterial color="#334155" roughness={0.4} />
                      </mesh>
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
                    </group>
                  }
                >
                  <MeasuringCylinderGLB />
                </Suspense>
                {/* Liquid */}
                {v.currentVolumeMl > 0 && (
                  <group position={[0, 0.01, 0]}>
                    <ReactiveFluidColumn
                      radiusTop={0.016}
                      radiusBottom={0.016}
                      height={heightScale * 0.18}
                      color={v.solutionColor}
                      isReacting={v.isReacting}
                    />
                  </group>
                )}
                <Billboard position={[0, 0.24, 0]}>
                  <mesh position={[0, 0.002, -0.002]}>
                    <planeGeometry args={[0.15, 0.038]} />
                    <meshBasicMaterial color="#090d16" transparent opacity={0.78} />
                  </mesh>
                  <Text
                    position={[0, 0.01, 0]}
                    fontSize={0.013}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`${v.name}`}
                  </Text>
                  <Text
                    position={[0, -0.007, 0]}
                    fontSize={0.01}
                    color="#38bdf8"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`pH ${v.pH.toFixed(1)} · ${v.currentVolumeMl.toFixed(0)} mL`}
                  </Text>
                </Billboard>
              </group>
            )}

            {/* 3. FLASK MODEL */}
            {v.type === "flask" && (
              <group position={[0, 0, 0]}>
                <Suspense
                  fallback={
                    <group>
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
                    </group>
                  }
                >
                  <ConicalFlaskGLB size="small" scale={0.65} />
                </Suspense>
                {v.currentVolumeMl > 0 && (
                  <group position={[0, 0.004, 0]}>
                    <ReactiveFluidColumn
                      radiusTop={0.025}
                      radiusBottom={0.048}
                      height={heightScale * 0.06}
                      color={v.solutionColor}
                      isReacting={v.isReacting}
                    />
                  </group>
                )}
                <Billboard position={[0, 0.125, 0]}>
                  <mesh position={[0, 0.002, -0.002]}>
                    <planeGeometry args={[0.16, 0.04]} />
                    <meshBasicMaterial color="#090d16" transparent opacity={0.78} />
                  </mesh>
                  <Text
                    position={[0, 0.011, 0]}
                    fontSize={0.013}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`${v.name} (${v.currentVolumeMl.toFixed(0)} mL)`}
                  </Text>
                  <Text
                    position={[0, -0.007, 0]}
                    fontSize={0.010}
                    color="#38bdf8"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`pH ${v.pH.toFixed(1)} · ${temp.toFixed(1)}°C`}
                  </Text>
                </Billboard>
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
                <Billboard position={[0, 0.12, 0]}>
                  <mesh position={[0, 0, -0.002]}>
                    <planeGeometry args={[0.14, 0.024]} />
                    <meshBasicMaterial color="#090d16" transparent opacity={0.78} />
                  </mesh>
                  <Text
                    position={[0, 0, 0]}
                    fontSize={0.012}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {v.name}
                  </Text>
                </Billboard>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
