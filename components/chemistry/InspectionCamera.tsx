"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type InspectViewMode = "overview" | "meniscus" | "flask";

interface InspectionCameraProps {
  isInspecting: boolean;
  viewMode?: InspectViewMode;
}

export function InspectionCamera({
  isInspecting,
  viewMode = "overview",
}: InspectionCameraProps) {
  const { camera } = useThree();

  // Multi-Angle Macro Camera Positions & Targets
  const cameraPresets: Record<
    InspectViewMode,
    { pos: THREE.Vector3; target: THREE.Vector3; fov: number }
  > = {
    // 1. Overview: Flask, stopcock, pH meter, and reagent dropper
    overview: {
      pos: new THREE.Vector3(0, 1.30, 0.76),
      target: new THREE.Vector3(0, 0.98, 0.06),
      fov: 52,
    },
    // 2. Meniscus Eye-Level: Parallax-free reading of 0.1 mL graduations
    meniscus: {
      pos: new THREE.Vector3(0, 1.28, 0.42),
      target: new THREE.Vector3(0, 1.27, 0.0),
      fov: 38,
    },
    // 3. Flask Swirl: Macro top-down view into fluid vortex and color transition
    flask: {
      pos: new THREE.Vector3(0, 1.18, 0.36),
      target: new THREE.Vector3(0, 0.95, 0.02),
      fov: 44,
    },
  };

  useFrame((_, delta) => {
    if (isInspecting) {
      const activePreset = cameraPresets[viewMode] || cameraPresets.overview;

      // Smoothly dolly closer to the apparatus
      camera.position.lerp(activePreset.pos, 7 * delta);

      // Smooth slerp quaternion toward look target
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(activePreset.target);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat).slerp(targetQuat, 7 * delta);

      const persCam = camera as THREE.PerspectiveCamera;
      if (persCam.fov && Math.abs(persCam.fov - activePreset.fov) > 0.1) {
        persCam.fov = THREE.MathUtils.lerp(persCam.fov, activePreset.fov, 7 * delta);
        persCam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
