"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LabVesselState } from "./equipment/InteractiveVessels";

interface FirstPersonHandsProps {
  heldVessel: LabVesselState | null;
  isPouring: boolean;
  isInspecting: boolean;
}

/**
 * Procedural First-Person Nitrile Lab Gloves (Left & Right Hands)
 * Attached directly to camera coordinate space to provide authentic
 * tactile immersion in first-person laboratory exploration.
 */
export function FirstPersonHands3D({
  heldVessel,
  isPouring,
  isInspecting,
}: FirstPersonHandsProps) {
  const { camera } = useThree();
  const handsContainerRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  // Single shared GPU material for nitrile gloves
  const gloveMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0284c7",
        roughness: 0.32,
        metalness: 0.06,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!handsContainerRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Follow camera position and rotation with subtle physical lag/damping
    handsContainerRef.current.position.copy(camera.position);
    handsContainerRef.current.quaternion.copy(camera.quaternion);

    // 2. Natural breathing & walking bob
    const idleBobY = Math.sin(t * 1.8) * 0.0035;
    const idleBobX = Math.cos(t * 0.9) * 0.0025;

    // 3. Right Hand: Grips the held vessel at [0.24, -0.22, -0.48] or rests ready
    if (rightHandRef.current) {
      if (heldVessel) {
        // Firmly holding the vessel body
        const targetPos = isPouring
          ? new THREE.Vector3(0.20, -0.19 + idleBobY, -0.44)
          : new THREE.Vector3(0.24, -0.22 + idleBobY, -0.48);
        rightHandRef.current.position.lerp(targetPos, 10 * delta);

        const targetRot = isPouring
          ? new THREE.Euler(0.35, -0.2, -0.7)
          : new THREE.Euler(0.18, -0.12, 0.12);
        rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 10 * delta);
        rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 10 * delta);
        rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 10 * delta);
      } else {
        const targetPos = isInspecting
          ? new THREE.Vector3(0.20, -0.20 + idleBobY, -0.42)
          : new THREE.Vector3(0.28 - idleBobX, -0.28 + idleBobY, -0.48);
        rightHandRef.current.position.lerp(targetPos, 6 * delta);

        const targetRot = isInspecting
          ? new THREE.Euler(0.25, -0.18, 0.3)
          : new THREE.Euler(0.12, -0.15, 0.15);
        rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 6 * delta);
        rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 6 * delta);
        rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 6 * delta);
      }
    }

    // 4. Left Hand: Poised to support during pouring, or hovering relaxed over bench
    if (leftHandRef.current) {
      if (heldVessel && isPouring) {
        // Poised guiding gesture near target
        const targetPos = new THREE.Vector3(-0.06, -0.24 + idleBobY, -0.44);
        leftHandRef.current.position.lerp(targetPos, 8 * delta);
        leftHandRef.current.rotation.set(0.3, 0.35, -0.2);
      } else if (heldVessel) {
        // Prepared supportive posture
        const targetPos = new THREE.Vector3(-0.22 + idleBobX, -0.26 + idleBobY, -0.46);
        leftHandRef.current.position.lerp(targetPos, 6 * delta);
        leftHandRef.current.rotation.set(0.15, 0.18, -0.12);
      } else {
        // Relaxed natural hand pose hovering over bench
        const targetPos = new THREE.Vector3(-0.28 + idleBobX, -0.28 + idleBobY, -0.48);
        leftHandRef.current.position.lerp(targetPos, 5 * delta);
        leftHandRef.current.rotation.set(0.12, 0.15, -0.15);
      }
    }
  });

  return (
    <group ref={handsContainerRef}>
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT HAND (Nitrile Laboratory Glove)
         ───────────────────────────────────────────────────────────── */}
      <group ref={leftHandRef} position={[-0.28, -0.28, -0.48]}>
        {/* Forearm / Sleeve */}
        <mesh position={[0, -0.16, 0.14]} rotation={[0.4, 0, 0]} material={gloveMaterial}>
          <cylinderGeometry args={[0.046, 0.052, 0.22, 16]} />
        </mesh>

        {/* Rolled Glove Cuff */}
        <mesh position={[0, -0.06, 0.08]} rotation={[0.4, 0, 0]} material={gloveMaterial}>
          <torusGeometry args={[0.048, 0.008, 12, 24]} />
        </mesh>

        {/* Palm Body */}
        <mesh position={[0, 0, 0]} material={gloveMaterial}>
          <boxGeometry args={[0.075, 0.045, 0.09]} />
        </mesh>

        {/* Thumb */}
        <group position={[0.045, 0.012, -0.015]} rotation={[0, -0.35, 0.4]}>
          <mesh position={[0, 0, -0.025]} material={gloveMaterial}>
            <capsuleGeometry args={[0.012, 0.038, 8, 12]} />
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[0.026, 0.005, -0.05]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.026]} material={gloveMaterial}>
            <capsuleGeometry args={[0.011, 0.042, 8, 12]} />
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[0.009, 0.005, -0.052]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.028]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0115, 0.045, 8, 12]} />
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[-0.01, 0.003, -0.05]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.026]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0105, 0.04, 8, 12]} />
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[-0.028, 0, -0.045]} rotation={[-0.28, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0095, 0.034, 8, 12]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. RIGHT HAND (Nitrile Laboratory Glove)
         ───────────────────────────────────────────────────────────── */}
      <group ref={rightHandRef} position={[0.28, -0.28, -0.48]}>
        {/* Forearm / Sleeve */}
        <mesh position={[0, -0.16, 0.14]} rotation={[0.4, 0, 0]} material={gloveMaterial}>
          <cylinderGeometry args={[0.046, 0.052, 0.22, 16]} />
        </mesh>

        {/* Rolled Glove Cuff */}
        <mesh position={[0, -0.06, 0.08]} rotation={[0.4, 0, 0]} material={gloveMaterial}>
          <torusGeometry args={[0.048, 0.008, 12, 24]} />
        </mesh>

        {/* Palm Body */}
        <mesh position={[0, 0, 0]} material={gloveMaterial}>
          <boxGeometry args={[0.075, 0.045, 0.09]} />
        </mesh>

        {/* Thumb */}
        <group position={[-0.045, 0.012, -0.015]} rotation={[0, 0.35, -0.4]}>
          <mesh position={[0, 0, -0.025]} material={gloveMaterial}>
            <capsuleGeometry args={[0.012, 0.038, 8, 12]} />
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[-0.026, 0.005, -0.05]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.026]} material={gloveMaterial}>
            <capsuleGeometry args={[0.011, 0.042, 8, 12]} />
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[-0.009, 0.005, -0.052]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.028]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0115, 0.045, 8, 12]} />
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[0.01, 0.003, -0.05]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.026]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0105, 0.04, 8, 12]} />
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[0.028, 0, -0.045]} rotation={[-0.28, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0095, 0.034, 8, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
