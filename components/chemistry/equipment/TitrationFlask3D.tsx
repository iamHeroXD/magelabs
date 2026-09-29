"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

  // Volume scale: 25mL is ~0.038m height, 75mL is ~0.065m height
  const liquidHeight = Math.max(0.015, Math.min(0.075, 0.015 + (totalVolumeMl / 250) * 0.08));
  const liquidBottomRadius = 0.056;
  const liquidTopRadius = 0.056 - (liquidHeight * 0.45);

  useFrame((state) => {
    // Spin magnetic stir bar inside flask
    if (stirBarRef.current && isStirring) {
      stirBarRef.current.rotation.y = state.clock.getElapsedTime() * 12;
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
      {/* 1. Conical Glass Flask Body */}
      {/* Conical Lower Walls */}
      <mesh position={[0, 0.046, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.058, 0.082, 32, 1, true]} />
        <meshPhysicalMaterial
          color={isHighlighted ? "#bfdbfe" : "#ffffff"}
          transparent
          opacity={0.35}
          roughness={0.06}
          metalness={0.05}
          transmission={0.92}
          ior={1.52}
          thickness={0.003}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flat Glass Bottom */}
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.004, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.42}
          roughness={0.05}
          transmission={0.92}
          ior={1.52}
        />
      </mesh>

      {/* Cylindrical Neck */}
      <mesh position={[0, 0.105, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.038, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.92}
          ior={1.52}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flanged Rim Lip */}
      <mesh position={[0, 0.124, 0]}>
        <torusGeometry args={[0.023, 0.0025, 12, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          roughness={0.04}
          transmission={0.92}
          ior={1.52}
        />
      </mesh>

      {/* White Ceramic Etched Graduations (50, 100, 150, 200 mL) */}
      {[0.032, 0.048, 0.064, 0.078].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <ringGeometry args={[0.036 - (y - 0.03) * 0.2, 0.038 - (y - 0.03) * 0.2, 24]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      ))}

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
      </group>

      {/* 3. PTFE Magnetic Stir Bar */}
      <mesh ref={stirBarRef} position={[0, 0.008, 0]}>
        <capsuleGeometry args={[0.003, 0.016, 8, 16]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}
