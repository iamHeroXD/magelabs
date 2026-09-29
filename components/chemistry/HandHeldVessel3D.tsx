"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LabVesselState } from "./equipment/InteractiveVessels";

interface HandHeldProps {
  heldVessel: LabVesselState | null;
  isPouring: boolean;
}

export function HandHeldVessel3D({ heldVessel, isPouring }: HandHeldProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !heldVessel) return;

    // Follow camera rigidly in front of player
    const offset = new THREE.Vector3(0.24, -0.22, -0.48);
    offset.applyQuaternion(camera.quaternion);
    const targetPos = camera.position.clone().add(offset);
    groupRef.current.position.copy(targetPos);

    // Target rotation: match camera rotation + gentle hand breathing motion
    const t = state.clock.getElapsedTime();
    const targetQuat = camera.quaternion.clone();

    // If pouring, tilt the vessel forward/left
    if (isPouring) {
      const tiltEuler = new THREE.Euler(0.2, 0, -0.75, "YXZ");
      const tiltQuat = new THREE.Quaternion().setFromEuler(tiltEuler);
      targetQuat.multiply(tiltQuat);
    } else {
      // Gentle subtle breathing bob
      const bobEuler = new THREE.Euler(
        Math.sin(t * 2) * 0.02,
        Math.cos(t * 1.5) * 0.02,
        0,
        "YXZ"
      );
      const bobQuat = new THREE.Quaternion().setFromEuler(bobEuler);
      targetQuat.multiply(bobQuat);
    }

    groupRef.current.quaternion.slerp(targetQuat, 14 * delta);
  });

  if (!heldVessel) return null;

  return (
    <group ref={groupRef}>
      {/* Hand-Held Glass Beaker / Flask Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.1, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          roughness={0.06}
          transmission={0.92}
          ior={1.52}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.006, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0.05} />
      </mesh>
      {/* Liquid inside */}
      {heldVessel.currentVolumeMl > 0 && (
        <mesh position={[0, -0.048 + 0.04, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.075, 24]} />
          <meshPhysicalMaterial
            color={heldVessel.solutionColor}
            transparent
            opacity={0.85}
            roughness={0.1}
            transmission={0.65}
          />
        </mesh>
      )}
      {/* Pouring stream droplet when pouring */}
      {isPouring && (
        <mesh position={[-0.05, -0.08, 0]}>
          <cylinderGeometry args={[0.003, 0.002, 0.16, 12]} />
          <meshPhysicalMaterial
            color={heldVessel.solutionColor}
            transparent
            opacity={0.9}
            roughness={0.05}
          />
        </mesh>
      )}
    </group>
  );
}
