"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface ReagentsProps {
  onAddIndicator?: () => void;
  hasIndicator?: boolean;
  isIndicatorHighlighted?: boolean;
}

export function ReagentBottles3D({
  onAddIndicator,
  hasIndicator = false,
  isIndicatorHighlighted = false,
}: ReagentsProps) {
  return (
    <group position={[-0.28, 0.005, 0.08]}>
      {/* 1. Phenolphthalein Indicator Dropper Bottle (Interactive) */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          chemistryAudio.playLiquidDrop();
          onAddIndicator?.();
        }}
      >
        {/* Amber Glass Cylindrical Bottle */}
        <mesh position={[0, 0.038, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.076, 24]} />
          <meshPhysicalMaterial
            color={isIndicatorHighlighted ? "#60a5fa" : "#78350f"}
            transparent
            opacity={0.88}
            roughness={0.12}
            transmission={0.4}
            ior={1.52}
          />
        </mesh>

        {/* Paper Chemical Label */}
        <mesh position={[0, 0.036, 0.0225]}>
          <planeGeometry args={[0.032, 0.042]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0.046, 0.023]}
          fontSize={0.0048}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          {"PHENOLPHTHALEIN"}
        </Text>
        <Text
          position={[0, 0.036, 0.023]}
          fontSize={0.0038}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          {"INDICATOR 1%"}
        </Text>
        <Text
          position={[0, 0.025, 0.023]}
          fontSize={0.0032}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          {hasIndicator ? "ADDED (3 DROPS)" : "[ CLICK TO ADD ]"}
        </Text>

        {/* Bottle Neck */}
        <mesh position={[0, 0.082, 0]}>
          <cylinderGeometry args={[0.011, 0.014, 0.015, 16]} />
          <meshPhysicalMaterial
            color="#78350f"
            transparent
            opacity={0.88}
            roughness={0.15}
          />
        </mesh>

        {/* Black Dropper Pipette Cap & Rubber Bulb */}
        <mesh position={[0, 0.094, 0]}>
          <cylinderGeometry args={[0.0125, 0.0125, 0.014, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.011, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. Standardized 0.100 M NaOH Stock Reagent Bottle */}
      <group position={[-0.08, 0, -0.06]}>
        {/* White HDPE Bottle Body */}
        <mesh position={[0, 0.065, 0]} castShadow>
          <cylinderGeometry args={[0.036, 0.036, 0.13, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Chemical Label */}
        <mesh position={[0, 0.065, 0.0365]}>
          <planeGeometry args={[0.048, 0.068]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0.08, 0.037]}
          fontSize={0.007}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          {"0.100 M NaOH"}
        </Text>
        <Text
          position={[0, 0.065, 0.037]}
          fontSize={0.004}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          {"TITRANT STANDARD"}
        </Text>
        <Text
          position={[0, 0.05, 0.037]}
          fontSize={0.0035}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          {"CORROSIVE · BASE"}
        </Text>
        {/* Blue Safety Screw Cap */}
        <mesh position={[0, 0.138, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 24]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. LDPE Distilled Water Wash Bottle with Curved Spout */}
      <group position={[-0.07, 0, 0.08]}>
        {/* Translucent Squeezable Bottle Body */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.12, 24]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.65}
            roughness={0.25}
            transmission={0.6}
            ior={1.4}
          />
        </mesh>
        {/* Red Cap with Angled Gooseneck Spout */}
        <mesh position={[0, 0.126, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.016, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Curved dispensing tube */}
        <mesh position={[0.012, 0.155, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.002, 0.002, 0.05, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
