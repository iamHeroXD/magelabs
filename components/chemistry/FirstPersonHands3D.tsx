"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { LabVesselState } from "./equipment/InteractiveVessels";

interface FirstPersonHandsProps {
  heldVessel: LabVesselState | null;
  isPouring: boolean;
  isInspecting: boolean;
}

/**
 * Procedural First-Person Hands:
 * Features tailored white lab coat sleeves with rolled cuffs and MageLabs patch,
 * an interactive bio/lab telemetry smartwatch on the left wrist with live readouts,
 * reinforced carbon-fiber knuckle shield plates, and high-fidelity cyan medical nitrile gloves.
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

  // Shared Materials
  const gloveMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0284c7", // Laboratory Cyan-Blue Nitrile
        roughness: 0.35,
        metalness: 0.05,
      }),
    []
  );

  const coatMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f8fafc", // Crisp White Lab Coat
        roughness: 0.75,
        metalness: 0.02,
      }),
    []
  );

  const watchBezelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  );

  const carbonArmorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#090d16",
        roughness: 0.3,
        metalness: 0.7,
      }),
    []
  );

  const gripPadMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0369a1", // Dark tactile friction grip ridges
        roughness: 0.65,
        metalness: 0.1,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!handsContainerRef.current) return;
    const t = state.clock.getElapsedTime();

    // Attach container directly to camera position and rotation
    handsContainerRef.current.position.copy(camera.position);
    handsContainerRef.current.quaternion.copy(camera.quaternion);

    // Subtle idle breathing and walking bob
    const idleBobY = Math.sin(t * 2.0) * 0.0025;
    const idleBobX = Math.cos(t * 1.0) * 0.0018;

    // ─────────────────────────────────────────────────────────────
    // 1. RIGHT HAND (Dominant Manipulator & Glassware Holder)
    // ─────────────────────────────────────────────────────────────
    if (rightHandRef.current) {
      if (heldVessel) {
        // Holding beaker in view
        const targetPos = isPouring
          ? new THREE.Vector3(0.16, -0.07 + idleBobY, -0.32)
          : new THREE.Vector3(0.18, -0.08 + idleBobY, -0.32);
        rightHandRef.current.position.lerp(targetPos, 12 * delta);

        const targetRot = isPouring
          ? new THREE.Euler(0.2, 0, -0.75)
          : new THREE.Euler(0.14, -0.1, 0.1);
        rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 12 * delta);
        rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 12 * delta);
        rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 12 * delta);
      } else if (isInspecting) {
        // Reached forward toward stopcock
        const targetPos = new THREE.Vector3(0.14, -0.11 + idleBobY, -0.30);
        rightHandRef.current.position.lerp(targetPos, 8 * delta);

        const targetRot = new THREE.Euler(0.22, -0.18, 0.25);
        rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 8 * delta);
        rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 8 * delta);
        rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 8 * delta);
      } else {
        // Natural resting first-person lower right pose (framing bottom right corner)
        const targetPos = new THREE.Vector3(0.20 - idleBobX, -0.135 + idleBobY, -0.34);
        rightHandRef.current.position.lerp(targetPos, 6 * delta);

        const targetRot = new THREE.Euler(0.15, -0.15, 0.12);
        rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetRot.x, 6 * delta);
        rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, targetRot.y, 6 * delta);
        rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, targetRot.z, 6 * delta);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. LEFT HAND (Secondary Hand with Wrist Monitor)
    // ─────────────────────────────────────────────────────────────
    if (leftHandRef.current) {
      if (heldVessel && isPouring) {
        // Poised guiding gesture near target
        const targetPos = new THREE.Vector3(0.04, -0.12 + idleBobY, -0.32);
        leftHandRef.current.position.lerp(targetPos, 10 * delta);

        const targetRot = new THREE.Euler(0.25, 0.35, -0.2);
        leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, targetRot.x, 10 * delta);
        leftHandRef.current.rotation.y = THREE.MathUtils.lerp(leftHandRef.current.rotation.y, targetRot.y, 10 * delta);
        leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, targetRot.z, 10 * delta);
      } else if (heldVessel) {
        // Supportive resting posture
        const targetPos = new THREE.Vector3(-0.16 + idleBobX, -0.14 + idleBobY, -0.34);
        leftHandRef.current.position.lerp(targetPos, 6 * delta);

        const targetRot = new THREE.Euler(0.12, 0.15, -0.1);
        leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, targetRot.x, 6 * delta);
        leftHandRef.current.rotation.y = THREE.MathUtils.lerp(leftHandRef.current.rotation.y, targetRot.y, 6 * delta);
        leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, targetRot.z, 6 * delta);
      } else {
        // Natural resting first-person lower left pose (framing bottom left corner)
        const targetPos = new THREE.Vector3(-0.20 + idleBobX, -0.135 + idleBobY, -0.34);
        leftHandRef.current.position.lerp(targetPos, 6 * delta);

        const targetRot = new THREE.Euler(0.15, 0.15, -0.12);
        leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, targetRot.x, 6 * delta);
        leftHandRef.current.rotation.y = THREE.MathUtils.lerp(leftHandRef.current.rotation.y, targetRot.y, 6 * delta);
        leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, targetRot.z, 6 * delta);
      }
    }
  });

  return (
    <group ref={handsContainerRef}>
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT HAND: Nitrile Glove, White Lab Coat Sleeve & Smartwatch
         ───────────────────────────────────────────────────────────── */}
      <group ref={leftHandRef} position={[-0.20, -0.135, -0.34]}>
        {/* Lab Coat Sleeve (White Fabric) */}
        <mesh position={[0, -0.12, 0.11]} rotation={[0.45, 0, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.046, 0.055, 0.18, 16]} />
        </mesh>
        {/* MageLabs Forearm Insignia Patch */}
        <mesh position={[-0.048, -0.11, 0.11]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Rolled White Sleeve Cuff */}
        <mesh position={[0, -0.045, 0.06]} rotation={[0.45, 0, 0]} material={coatMaterial}>
          <torusGeometry args={[0.046, 0.007, 12, 24]} />
        </mesh>

        {/* Telemetry Smartwatch on Wrist */}
        <group position={[0, -0.025, 0.04]} rotation={[0.45, 0, 0]}>
          {/* Watch Strap */}
          <mesh material={watchBezelMat}>
            <cylinderGeometry args={[0.043, 0.043, 0.022, 24]} />
          </mesh>
          {/* Watch Body / Screen Housing */}
          <mesh position={[0, 0.038, 0]}>
            <boxGeometry args={[0.028, 0.008, 0.034]} />
            <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Glowing Cyan OLED Display */}
          <mesh position={[0, 0.043, 0]}>
            <planeGeometry args={[0.024, 0.03]} />
            <meshBasicMaterial color="#0c4a6e" />
          </mesh>
          <Text
            position={[0, 0.044, -0.007]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.0045}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            {"HR 74 · O2 99%"}
          </Text>
          <Text
            position={[0, 0.044, 0.007]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.004}
            color="#34d399"
            anchorX="center"
            anchorY="middle"
          >
            {"ISO-5 // CLEAN"}
          </Text>
        </group>

        {/* Rolled Nitrile Glove Wrist Cuff */}
        <mesh position={[0, -0.015, 0.02]} rotation={[0.45, 0, 0]} material={gloveMaterial}>
          <torusGeometry args={[0.04, 0.005, 12, 24]} />
        </mesh>

        {/* Glove Palm Body */}
        <mesh position={[0, 0, 0]} material={gloveMaterial}>
          <boxGeometry args={[0.065, 0.036, 0.075]} />
        </mesh>

        {/* Tactical Carbon Fiber Knuckle Plate */}
        <mesh position={[0, 0.021, -0.015]} material={carbonArmorMat}>
          <boxGeometry args={[0.062, 0.008, 0.026]} />
        </mesh>

        {/* Thumb */}
        <group position={[0.038, 0.008, -0.012]} rotation={[0, -0.32, 0.38]}>
          <mesh position={[0, 0, -0.02]} material={gloveMaterial}>
            <capsuleGeometry args={[0.01, 0.03, 8, 12]} />
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[0.022, 0.004, -0.04]} rotation={[-0.18, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.009, 0.034, 8, 12]} />
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[0.007, 0.004, -0.042]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.024]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0095, 0.036, 8, 12]} />
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[-0.008, 0.002, -0.04]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0085, 0.032, 8, 12]} />
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[-0.024, 0, -0.036]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.018]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0075, 0.026, 8, 12]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. RIGHT HAND: Nitrile Glove, White Lab Coat Sleeve
         ───────────────────────────────────────────────────────────── */}
      <group ref={rightHandRef} position={[0.20, -0.135, -0.34]}>
        {/* Lab Coat Sleeve (White Fabric) */}
        <mesh position={[0, -0.12, 0.11]} rotation={[0.45, 0, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.046, 0.055, 0.18, 16]} />
        </mesh>
        {/* MageLabs Forearm Insignia Patch */}
        <mesh position={[0.048, -0.11, 0.11]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Rolled White Sleeve Cuff */}
        <mesh position={[0, -0.045, 0.06]} rotation={[0.45, 0, 0]} material={coatMaterial}>
          <torusGeometry args={[0.046, 0.007, 12, 24]} />
        </mesh>

        {/* Rolled Nitrile Glove Wrist Cuff */}
        <mesh position={[0, -0.015, 0.02]} rotation={[0.45, 0, 0]} material={gloveMaterial}>
          <torusGeometry args={[0.04, 0.005, 12, 24]} />
        </mesh>

        {/* Glove Palm Body */}
        <mesh position={[0, 0, 0]} material={gloveMaterial}>
          <boxGeometry args={[0.065, 0.036, 0.075]} />
        </mesh>

        {/* Tactical Carbon Fiber Knuckle Plate */}
        <mesh position={[0, 0.021, -0.015]} material={carbonArmorMat}>
          <boxGeometry args={[0.062, 0.008, 0.026]} />
        </mesh>

        {/* Thumb */}
        <group position={[-0.038, 0.008, -0.012]} rotation={[0, 0.32, -0.38]}>
          <mesh position={[0, 0, -0.02]} material={gloveMaterial}>
            <capsuleGeometry args={[0.01, 0.03, 8, 12]} />
          </mesh>
        </group>

        {/* Index Finger */}
        <group position={[-0.022, 0.004, -0.04]} rotation={[-0.18, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.009, 0.034, 8, 12]} />
          </mesh>
        </group>

        {/* Middle Finger */}
        <group position={[-0.007, 0.004, -0.042]} rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0, -0.024]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0095, 0.036, 8, 12]} />
          </mesh>
        </group>

        {/* Ring Finger */}
        <group position={[0.008, 0.002, -0.04]} rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0, -0.022]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0085, 0.032, 8, 12]} />
          </mesh>
        </group>

        {/* Pinky Finger */}
        <group position={[0.024, 0, -0.036]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, -0.018]} material={gloveMaterial}>
            <capsuleGeometry args={[0.0075, 0.026, 8, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
