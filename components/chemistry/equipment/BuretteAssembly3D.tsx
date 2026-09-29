"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface BuretteProps {
  dispensedMl: number; // 0 to 50 mL
  capacityMl?: number;
  stopcockAngle: number; // 0 (closed) to 90 (stream)
  isFlowing: boolean;
  onToggleStopcock?: () => void;
  isHighlighted?: boolean;
}

export function BuretteAssembly3D({
  dispensedMl,
  capacityMl = 50,
  stopcockAngle,
  isFlowing,
  onToggleStopcock,
  isHighlighted = false,
}: BuretteProps) {
  const dropletRef = useRef<THREE.Group>(null);
  const stopcockHandleRef = useRef<THREE.Group>(null);

  // Remaining liquid volume fraction (0 = empty, 1 = full 50mL)
  const remainingFraction = Math.max(0, Math.min(1, (capacityMl - dispensedMl) / capacityMl));
  const buretteTubeHeight = 0.58; // meters in 3D scale
  const liquidHeight = buretteTubeHeight * remainingFraction;
  const liquidCenterY = 0.32 - (buretteTubeHeight - liquidHeight) / 2;

  useFrame((state) => {
    // Animate falling droplets if flowing
    if (dropletRef.current && isFlowing) {
      const t = (state.clock.getElapsedTime() * 4.5) % 1;
      dropletRef.current.position.y = 0.02 - t * 0.14;
      dropletRef.current.scale.setScalar(1 - t * 0.3);
      dropletRef.current.visible = true;
    } else if (dropletRef.current) {
      dropletRef.current.visible = false;
    }

    // Smooth stopcock rotation
    if (stopcockHandleRef.current) {
      const targetRad = (stopcockAngle * Math.PI) / 180;
      stopcockHandleRef.current.rotation.z = THREE.MathUtils.lerp(
        stopcockHandleRef.current.rotation.z,
        targetRad,
        0.18
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Heavy Cast-Iron Retort Stand Base */}
      <mesh position={[0, 0.015, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.025, 0.36]} />
        <meshStandardMaterial color="#1f232b" roughness={0.7} metalness={0.85} />
      </mesh>

      {/* Retort Stand Chrome Rod */}
      <mesh position={[0.09, 0.45, 0.12]} castShadow>
        <cylinderGeometry args={[0.0065, 0.0065, 0.88, 24]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Cast Iron Support Bosshead & Dual V-Jaw Burette Clamp */}
      <group position={[0.045, 0.42, 0.06]}>
        {/* Bosshead sleeve */}
        <mesh position={[0.045, 0, 0.06]}>
          <boxGeometry args={[0.024, 0.032, 0.024]} />
          <meshStandardMaterial color="#27272a" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Extension arm */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.09, 16]} />
          <meshStandardMaterial color="#d4d4d8" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Rubber-sleeved clamp jaws */}
        <mesh position={[-0.045, 0, -0.06]}>
          <boxGeometry args={[0.022, 0.024, 0.028]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* 2. Glass Burette Body (50 mL capacity) */}
      <group position={[0, 0.32, 0]}>
        {/* Outer Borosilicate Glass Cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.011, 0.011, buretteTubeHeight, 32, 1, true]} />
          <meshPhysicalMaterial
            color={isHighlighted ? "#bfdbfe" : "#ffffff"}
            transparent
            opacity={0.35}
            roughness={0.06}
            metalness={0.05}
            transmission={0.94}
            ior={1.52}
            thickness={0.002}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Etched Volume Graduations along barrel */}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = buretteTubeHeight / 2 - (i / 10) * buretteTubeHeight;
          const isMajor = i % 2 === 0;
          return (
            <mesh key={i} position={[0, y, 0]}>
              <ringGeometry args={[0.0112, 0.0116, 24]} />
              <meshBasicMaterial
                color="#ffffff"
                side={THREE.DoubleSide}
                transparent
                opacity={isMajor ? 0.85 : 0.45}
              />
            </mesh>
          );
        })}

        {/* Inner Fluid Column (NaOH Solution) */}
        {liquidHeight > 0.001 && (
          <group position={[0, liquidCenterY - 0.32, 0]}>
            <mesh>
              <cylinderGeometry args={[0.0098, 0.0098, liquidHeight, 24]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transparent
                opacity={0.7}
                roughness={0.1}
                transmission={0.8}
                ior={1.33}
              />
            </mesh>
            {/* Concave Meniscus Ring */}
            <mesh position={[0, liquidHeight / 2, 0]}>
              <cylinderGeometry args={[0.0098, 0.0098, 0.0015, 24]} />
              <meshPhysicalMaterial
                color="#bae6fd"
                transparent
                opacity={0.9}
                roughness={0.05}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* 3. Precision PTFE Stopcock Assembly */}
      <group position={[0, 0.028, 0]}>
        {/* Glass Stopcock Barrel Housing */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.024, 24]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.08}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Rotating PTFE Stopcock Plug & Handle (Interactive Click) */}
        <group
          ref={stopcockHandleRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStopcock?.();
          }}
        >
          {/* White Teflon Central Plug */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0065, 0.0065, 0.028, 24]} />
            <meshStandardMaterial color="#f4f4f5" roughness={0.3} metalness={0.05} />
          </mesh>

          {/* Ergonomic Blue/Red Stopcock Handle Wings */}
          <mesh position={[0, 0, 0.016]}>
            <boxGeometry args={[0.007, 0.038, 0.008]} />
            <meshStandardMaterial
              color={stopcockAngle > 0 ? "#2563eb" : "#dc2626"}
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>
        </group>

        {/* Drawn Glass Capillary Jet Tip */}
        <mesh position={[0, -0.022, 0]}>
          <cylinderGeometry args={[0.005, 0.0018, 0.026, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.05}
            transmission={0.94}
            ior={1.52}
          />
        </mesh>
      </group>

      {/* 4. Active Droplet Stream when stopcock is open */}
      <group ref={dropletRef} position={[0, 0, 0]} visible={false}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.003, 16, 16]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.85}
            roughness={0.05}
            transmission={0.8}
          />
        </mesh>
      </group>

      {/* White Ceramic Contrast Tile below flask */}
      <mesh position={[0, 0.003, 0]} receiveShadow>
        <boxGeometry args={[0.16, 0.006, 0.16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.05} />
      </mesh>
    </group>
  );
}
