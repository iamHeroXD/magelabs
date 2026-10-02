"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ConicalFlaskGLB } from "./ModelGlassware3D";

interface FlaskProps {
  totalVolumeMl: number; // e.g. 25mL initial up to 75mL
  solutionColor: string; // e.g. '#f8fafc', '#fbcfe8', '#ec4899'
  hasIndicator: boolean;
  isStirring?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

export function TitrationFlask3D({
  totalVolumeMl,
  solutionColor,
  hasIndicator,
  isStirring = true,
  isHighlighted = false,
  onClick,
}: FlaskProps) {
  const stirBarRef = useRef<THREE.Mesh>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const vortexMeshRef = useRef<THREE.Mesh>(null);

  // Volume scale: 25mL is ~0.038m height, 75mL is ~0.065m height
  const liquidHeight = Math.max(0.015, Math.min(0.075, 0.015 + (totalVolumeMl / 250) * 0.08));
  const liquidBottomRadius = 0.056;
  const liquidTopRadius = 0.056 - (liquidHeight * 0.45);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Spin magnetic stir bar inside flask
    if (stirBarRef.current && isStirring) {
      stirBarRef.current.rotation.y = t * 14;
    }
    // Rotate and animate fluid vortex depression cone
    if (vortexMeshRef.current && isStirring) {
      vortexMeshRef.current.rotation.y = -t * 14;
      const swirlWobble = Math.sin(t * 8) * 0.001;
      vortexMeshRef.current.position.y = liquidHeight / 2 - 0.004 + swirlWobble;
    }
  });

  return (
    <group
      position={[0, 0.008, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Porcelain White Contrast Plate (Standard Analytical Titration Practice) */}
      <mesh position={[0, -0.004, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.006, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.05} />
      </mesh>
      {/* 1. Realistic Erlenmeyer Flask 3D Model with Fallback */}
      <Suspense
        fallback={
          <group>
            <mesh position={[0, 0.046, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.058, 0.082, 32, 1, true]} />
              <meshPhysicalMaterial
                color={isHighlighted ? "#bfdbfe" : "#ffffff"}
                transparent
                opacity={0.35}
                roughness={0.06}
                transmission={0.92}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.004, 0]}>
              <cylinderGeometry args={[0.058, 0.058, 0.004, 32]} />
              <meshPhysicalMaterial color="#ffffff" transparent opacity={0.42} roughness={0.05} transmission={0.92} />
            </mesh>
            <mesh position={[0, 0.105, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.038, 32, 1, true]} />
              <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} roughness={0.05} transmission={0.92} side={THREE.DoubleSide} />
            </mesh>
          </group>
        }
      >
        <ConicalFlaskGLB size="small" scale={0.72} isHighlighted={isHighlighted} />
      </Suspense>

      {/* 2. Dynamic Liquid Body with Phenolphthalein Color State */}
      <group position={[0, 0.004 + liquidHeight / 2, 0]}>
        <mesh ref={liquidMeshRef}>
          <cylinderGeometry args={[liquidTopRadius, liquidBottomRadius, liquidHeight, 32]} />
          <meshPhysicalMaterial
            color={solutionColor}
            transparent
            opacity={hasIndicator && solutionColor !== "#f8fafc" ? 0.78 : 0.35}
            roughness={0.12}
            transmission={hasIndicator && solutionColor !== "#f8fafc" ? 0.55 : 0.88}
            ior={1.33}
          />
        </mesh>

        {/* Meniscus Top Surface */}
        <mesh position={[0, liquidHeight / 2, 0]}>
          <cylinderGeometry args={[liquidTopRadius, liquidTopRadius, 0.001, 32]} />
          <meshPhysicalMaterial
            color={solutionColor}
            transparent
            opacity={0.8}
            roughness={0.05}
          />
        </mesh>

        {/* Dynamic Center Swirl Vortex Funnel (Formed by magnetic stirring) */}
        {isStirring && (
          <mesh
            ref={vortexMeshRef}
            position={[0, liquidHeight / 2 - 0.004, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[liquidTopRadius * 0.42, 0.016, 24, 1, true]} />
            <meshPhysicalMaterial
              color={solutionColor}
              transparent
              opacity={0.88}
              roughness={0.04}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* 3. PTFE Magnetic Stir Bar */}
      <mesh ref={stirBarRef} position={[0, 0.008, 0]}>
        <capsuleGeometry args={[0.003, 0.016, 8, 16]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}
