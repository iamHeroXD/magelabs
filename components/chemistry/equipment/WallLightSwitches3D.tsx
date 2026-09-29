"use client";

import { Text } from "@react-three/drei";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface LightSwitchesProps {
  ceilingLightsOn: boolean;
  taskLightOn: boolean;
  onToggleCeiling: () => void;
  onToggleTask: () => void;
}

export function WallLightSwitches3D({
  ceilingLightsOn,
  taskLightOn,
  onToggleCeiling,
  onToggleTask,
}: LightSwitchesProps) {
  return (
    <group position={[-4.7, 1.4, -6.93]}>
      {/* Stainless Steel Dual Switch Wall Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.22, 0.012]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Switch 1: Ceiling Lights */}
      <group
        position={[-0.045, 0.015, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          chemistryAudio.playStopcockClick();
          onToggleCeiling();
        }}
      >
        <mesh rotation={[ceilingLightsOn ? 0.25 : -0.25, 0, 0]}>
          <boxGeometry args={[0.024, 0.05, 0.016]} />
          <meshStandardMaterial
            color={ceilingLightsOn ? "#f8fafc" : "#64748b"}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, -0.055, 0.002]}
          fontSize={0.011}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          {"ROOM"}
        </Text>
      </group>

      {/* Switch 2: Task Lighting */}
      <group
        position={[0.045, 0.015, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          chemistryAudio.playStopcockClick();
          onToggleTask();
        }}
      >
        <mesh rotation={[taskLightOn ? 0.25 : -0.25, 0, 0]}>
          <boxGeometry args={[0.024, 0.05, 0.016]} />
          <meshStandardMaterial
            color={taskLightOn ? "#f8fafc" : "#64748b"}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, -0.055, 0.002]}
          fontSize={0.011}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          {"BENCH"}
        </Text>
      </group>
    </group>
  );
}
