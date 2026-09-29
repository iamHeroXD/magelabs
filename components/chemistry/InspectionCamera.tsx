"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface InspectionCameraProps {
  isInspecting: boolean;
}

export function InspectionCamera({ isInspecting }: InspectionCameraProps) {
  const { camera } = useThree();

  // Ergonomic close inspection angle looking down directly at flask, stopcock, and pH meter
  const inspectionPos = new THREE.Vector3(0, 1.30, 0.76);
  const targetLook = new THREE.Vector3(0, 0.97, 0.06);

  useFrame((_, delta) => {
    if (isInspecting) {
      // Smoothly dolly closer to the apparatus
      camera.position.lerp(inspectionPos, 6 * delta);
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(targetLook);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat).slerp(targetQuat, 6 * delta);

      const persCam = camera as THREE.PerspectiveCamera;
      if (persCam.fov && Math.abs(persCam.fov - 54) > 0.1) {
        persCam.fov = THREE.MathUtils.lerp(persCam.fov, 54, 6 * delta);
        persCam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
