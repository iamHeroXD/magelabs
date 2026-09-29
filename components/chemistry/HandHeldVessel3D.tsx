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

    // Follow camera rigidly in front of player (aligned with right hand grip)
    const offset = new THREE.Vector3(0.18, -0.08, -0.32);
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

  const fillFraction = Math.min(1, Math.max(0.08, heldVessel.currentVolumeMl / heldVessel.capacityMl));
  const liquidHeight = fillFraction * 0.07;

  return (
    <group ref={groupRef}>
      {/* Hand-Held Glass Beaker / Flask Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.038, 0.038, 0.09, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.42}
          roughness={0.06}
          transmission={0.92}
          ior={1.52}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.045, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.005, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0.05} />
      </mesh>
      {/* Flanged Lip */}
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry args={[0.039, 0.002, 12, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.55} roughness={0.04} />
      </mesh>

      {/* Liquid inside */}
      {heldVessel.currentVolumeMl > 0 && (
        <group position={[0, -0.045 + liquidHeight / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.036, 0.036, liquidHeight, 24]} />
            <meshPhysicalMaterial
              color={heldVessel.solutionColor}
              transparent
              opacity={0.85}
              roughness={0.1}
              transmission={0.65}
              ior={1.34}
            />
          </mesh>
          {/* Surface Meniscus */}
          <mesh position={[0, liquidHeight / 2, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.001, 24]} />
            <meshPhysicalMaterial
              color={heldVessel.solutionColor}
              transparent
              opacity={0.9}
              roughness={0.05}
            />
          </mesh>
        </group>
      )}

      {/* Pouring stream droplet when pouring */}
      {isPouring && (
        <group position={[-0.04, -0.05, 0]}>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.0025, 0.0015, 0.14, 12]} />
            <meshPhysicalMaterial
              color={heldVessel.solutionColor}
              transparent
              opacity={0.92}
              roughness={0.05}
            />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <sphereGeometry args={[0.003, 12, 12]} />
            <meshPhysicalMaterial
              color={heldVessel.solutionColor}
              transparent
              opacity={0.95}
              roughness={0.05}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
