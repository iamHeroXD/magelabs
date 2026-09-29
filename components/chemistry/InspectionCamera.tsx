"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface InspectionCameraProps {
  isInspecting: boolean;
}

export function InspectionCamera({ isInspecting }: InspectionCameraProps) {
  const { camera } = useThree();

  const inspectionPos = new THREE.Vector3(0, 1.22, 0.68);
  const targetLook = new THREE.Vector3(0, 1.12, 0);

  useFrame((_, delta) => {
    if (isInspecting) {
      // Smoothly dolly closer to the apparatus
      camera.position.lerp(inspectionPos, 7 * delta);
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(targetLook);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat).slerp(targetQuat, 7 * delta);
    }
  });

  return null;
}
