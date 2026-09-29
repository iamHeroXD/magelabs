"use client";

import { useRef } from "react";
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

  // Inertia and sway vectors
  const prevCamPos = useRef(new THREE.Vector3());
  const prevCamRot = useRef(new THREE.Euler());
  const swayOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (!handsContainerRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Follow camera position and rotation with subtle physical lag/damping
    handsContainerRef.current.position.copy(camera.position);
    handsContainerRef.current.quaternion.copy(camera.quaternion);

    // 2. Natural breathing & walking bob
    const idleBobY = Math.sin(t * 1.8) * 0.0035;
    const idleBobX = Math.cos(t * 0.9) * 0.0025;

    // 3. Left Hand: Holding glassware or resting ready
    if (leftHandRef.current) {
      if (heldVessel) {
        // Positioned under held glassware to support it
        const targetPos = isPouring
          ? new THREE.Vector3(-0.16, -0.19 + idleBobY, -0.42)
          : new THREE.Vector3(-0.2, -0.22 + idleBobY, -0.45);
        leftHandRef.current.position.lerp(targetPos, 8 * delta);

        const targetRot = isPouring
          ? new THREE.Euler(0.4, 0.2, -0.7)
          : new THREE.Euler(0.2, 0.1, -0.25);
        leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, targetRot.x, 8 * delta);
        leftHandRef.current.rotation.y = THREE.MathUtils.lerp(leftHandRef.current.rotation.y, targetRot.y, 8 * delta);
        leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, targetRot.z, 8 * delta);
      } else {
        // Relaxed natural hand pose hovering over bench
        const targetPos = new THREE.Vector3(-0.28 + idleBobX, -0.28 + idleBobY, -0.48);
        leftHandRef.current.position.lerp(targetPos, 5 * delta);
        leftHandRef.current.rotation.set(0.12, 0.15, -0.15);
      }
    }

    // 4. Right Hand: Poised to interact with burette stopcock, droppers, and dials
    if (rightHandRef.current) {
      const targetPos = isPouring
        ? new THREE.Vector3(0.12, -0.16 + idleBobY, -0.38)
        : isInspecting
        ? new THREE.Vector3(0.22, -0.21 + idleBobY, -0.42)
        : new THREE.Vector3(0.28 - idleBobX, -0.28 + idleBobY, -0.48);

      rightHandRef.current.position.lerp(targetPos, 6 * delta);

      const targetRot = isPouring
        ? new THREE.Euler(0.5, -0.3, 0.8)
        : isInspecting
        ? new THREE.Euler(0.25, -0.18, 0.3)
        : new THREE.Euler(0.12, -0.15, 0.15);

      rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 6 * delta);
      rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 6 * delta);
      rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 6 * delta);
    }
  });

  // Common Nitrile Glove Material: Soft-sheen Medical/Laboratory Cyan-Blue
  const gloveMaterial = (
    <meshStandardMaterial
      color="#0284c7"
      roughness={0.32}
      metalness={0.06}
      bumpScale={0.002}
    />
  );

  return (
    <group ref={handsContainerRef}>
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT HAND (Nitrile Laboratory Glove)
         ───────────────────────────────────────────────────────────── */}
      <group ref={leftHandRef} position={[-0.28, -0.28, -0.48]}>
        {/* Forearm / Sleeve */}
        <mesh position={[0, -0.16, 0.14]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.046, 0.052, 0.22, 16]} />
          {gloveMaterial}
        </mesh>

        {/* Rolled Glove Cuff */}
        <mesh position={[0, -0.06, 0.08]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.048, 0.008, 12, 24]} />
          {gloveMaterial}
        </mesh>

        {/* Palm Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.075, 0.045, 0.09]} />
          {gloveMaterial}
        </mesh>

        {/* Thumb */}
        <group position={[0.045, 0.012, -0.015]} rotation={[0, -0.35, 0.4]}>
          <mesh position={[0, 0, -0.025]}>
            <capsuleGeometry args={[0.012, 0.038, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[0.026, 0.005, -0.05]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.026]}>
            <capsuleGeometry args={[0.011, 0.042, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[0.009, 0.005, -0.052]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.028]}>
            <capsuleGeometry args={[0.0115, 0.045, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[-0.01, 0.003, -0.05]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.026]}>
            <capsuleGeometry args={[0.0105, 0.04, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[-0.028, 0, -0.045]} rotation={[-0.28, 0, 0]}>
          <mesh position={[0, 0, -0.022]}>
            <capsuleGeometry args={[0.0095, 0.034, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. RIGHT HAND (Nitrile Laboratory Glove)
         ───────────────────────────────────────────────────────────── */}
      <group ref={rightHandRef} position={[0.28, -0.28, -0.48]}>
        {/* Forearm / Sleeve */}
        <mesh position={[0, -0.16, 0.14]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.046, 0.052, 0.22, 16]} />
          {gloveMaterial}
        </mesh>

        {/* Rolled Glove Cuff */}
        <mesh position={[0, -0.06, 0.08]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.048, 0.008, 12, 24]} />
          {gloveMaterial}
        </mesh>

        {/* Palm Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.075, 0.045, 0.09]} />
          {gloveMaterial}
        </mesh>

        {/* Thumb */}
        <group position={[-0.045, 0.012, -0.015]} rotation={[0, 0.35, -0.4]}>
          <mesh position={[0, 0, -0.025]}>
            <capsuleGeometry args={[0.012, 0.038, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[-0.026, 0.005, -0.05]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.026]}>
            <capsuleGeometry args={[0.011, 0.042, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[-0.009, 0.005, -0.052]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.028]}>
            <capsuleGeometry args={[0.0115, 0.045, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[0.01, 0.003, -0.05]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.026]}>
            <capsuleGeometry args={[0.0105, 0.04, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[0.028, 0, -0.045]} rotation={[-0.28, 0, 0]}>
          <mesh position={[0, 0, -0.022]}>
            <capsuleGeometry args={[0.0095, 0.034, 8, 12]} />
            {gloveMaterial}
          </mesh>
        </group>
      </group>
    </group>
  );
}
