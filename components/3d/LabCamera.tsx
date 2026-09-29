"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type CameraPreset = "default" | "top" | "circuit" | "multimeter";

interface LabCameraProps {
  preset: CameraPreset;
}

const PRESET_CONFIGS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  default: {
    position: [0, 4.2, 4.8],
    target: [0, 0.2, -0.2]
  },
  top: {
    position: [0, 7.5, 0.05],
    target: [0, 0, 0]
  },
  circuit: {
    position: [0, 2.5, 2.8],
    target: [0, 0.2, -0.4]
  },
  multimeter: {
    position: [1.2, 2.0, 1.8],
    target: [1.2, 0.35, -0.2]
  }
};

export function LabCamera({ preset }: LabCameraProps) {
  const controlsRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3(...PRESET_CONFIGS.default.position));
  const targetLook = useRef(new THREE.Vector3(...PRESET_CONFIGS.default.target));

  useEffect(() => {
    const cfg = PRESET_CONFIGS[preset] || PRESET_CONFIGS.default;
    targetPos.current.set(...cfg.position);
    targetLook.current.set(...cfg.target);
  }, [preset]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;
    const lerpFactor = Math.min(1.0, delta * 3.5);

    state.camera.position.lerp(targetPos.current, lerpFactor);
    controlsRef.current.target.lerp(targetLook.current, lerpFactor);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={1.8}
      maxDistance={9.5}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent moving camera under the table
      minPolarAngle={0.08}
      dampingFactor={0.08}
      enableDamping
    />
  );
}
