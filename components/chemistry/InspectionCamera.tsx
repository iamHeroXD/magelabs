"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type InspectViewMode =
  | "overview"
  | "meniscus"
  | "flask"
  | "balance"
  | "hotplate"
  | "tubes";

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
    // 1. Panoramic Full Workbench Overview: Full table framing all instruments
    overview: {
      pos: new THREE.Vector3(0, 1.48, 1.25),
      target: new THREE.Vector3(0, 0.95, -0.05),
      fov: 62,
    },
    // 2. Meniscus Eye-Level: Parallax-free reading of 0.1 mL graduations
    meniscus: {
      pos: new THREE.Vector3(0, 1.28, 0.42),
      target: new THREE.Vector3(0, 1.27, 0.0),
      fov: 40,
    },
    // 3. Flask Swirl: Macro top-down view into fluid vortex and color transition
    flask: {
      pos: new THREE.Vector3(0, 1.18, 0.38),
      target: new THREE.Vector3(0, 0.95, 0.02),
      fov: 46,
    },
    // 4. Analytical Balance: Focus on 4-decimal digital display and draft shield
    balance: {
      pos: new THREE.Vector3(0.68, 1.26, 0.36),
      target: new THREE.Vector3(0.68, 1.02, -0.08),
      fov: 44,
    },
    // 5. Hotplate Stirrer: Thermal plate, digital temp gauge, and magnetic vortex
    hotplate: {
      pos: new THREE.Vector3(-0.82, 1.26, 0.36),
      target: new THREE.Vector3(-0.82, 1.02, -0.08),
      fov: 44,
    },
    // 6. Test Tube Reaction Rack & Micropipettes
    tubes: {
      pos: new THREE.Vector3(-0.32, 1.26, 0.38),
      target: new THREE.Vector3(-0.32, 1.02, -0.16),
      fov: 46,
    },
  };

  useFrame((_, delta) => {
    const persCam = camera as THREE.PerspectiveCamera;
    if (isInspecting) {
      const activePreset = cameraPresets[viewMode] || cameraPresets.overview;

      // Smoothly dolly closer to the apparatus
      camera.position.lerp(activePreset.pos, 7 * delta);

      // Smooth slerp quaternion toward look target
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(activePreset.target);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat).slerp(targetQuat, 7 * delta);

      if (persCam.fov && Math.abs(persCam.fov - activePreset.fov) > 0.1) {
        persCam.fov = THREE.MathUtils.lerp(persCam.fov, activePreset.fov, 7 * delta);
        persCam.updateProjectionMatrix();
      }
    } else {
      // Restore standard ergonomic laboratory FOV when returning to walk mode
      if (persCam.fov && Math.abs(persCam.fov - 58) > 0.1) {
        persCam.fov = THREE.MathUtils.lerp(persCam.fov, 58, 6 * delta);
        persCam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
