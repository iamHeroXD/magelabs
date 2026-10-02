"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

export type RobotTask =
  | "idle"
  | "titrating"
  | "heating"
  | "centrifuging"
  | "cleaning";

interface RobotProps {
  onOpenMenu: () => void;
  activeTask: RobotTask;
  onTaskProgress?: (task: RobotTask, step: number) => void;
  onTaskComplete?: (task: RobotTask) => void;
}

/**
 * DR. AURA // Autonomous Humanoid Laboratory Scientist
 * Full bipedal humanoid android wearing a tailored scientist laboratory coat,
 * articulated cervical neck with gaze tracking, expressive holographic visor,
 * 5-digit dexterous manipulator hands, dynamic item handling/pouring,
 * and procedural locomotion & player greeting animations.
 */
export function LabRobotAvatar3D({
  onOpenMenu,
  activeTask,
}: RobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftThighRef = useRef<THREE.Group>(null);
  const rightThighRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);
  const coatTailRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const voiceGrillRef = useRef<THREE.Mesh>(null);

  const prevTaskRef = useRef<RobotTask>(activeTask);
  const hasGreetedRef = useRef<boolean>(false);
  const isWavingRef = useRef<boolean>(false);
  const waveTimerRef = useRef<number>(0);

  // ─────────────────────────────────────────────────────────────
  // MATERIALS
  // ─────────────────────────────────────────────────────────────
  const coatMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.65,
        metalness: 0.05,
      }),
    []
  );

  const armorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.25,
        metalness: 0.45,
      }),
    []
  );

  const innerChassisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const jointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#475569",
        roughness: 0.25,
        metalness: 0.9,
      }),
    []
  );

  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.12,
        metalness: 0.98,
      }),
    []
  );

  const siliconeGripMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0284c7",
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  // Patrol waypoints across the laboratory bench
  const waypoints = useMemo(
    () => [
      new THREE.Vector3(0.45, 0, -1.25), // Opposite Titration Bench
      new THREE.Vector3(-0.82, 0, -1.22), // Opposite Hotplate Stirrer
      new THREE.Vector3(0.68, 0, -1.22),  // Opposite Analytical Balance
      new THREE.Vector3(1.15, 0, -1.22),  // Opposite Centrifuge
      new THREE.Vector3(1.85, 0, -0.4),   // Right counter corner
      new THREE.Vector3(-1.85, 0, -0.4),  // Left sink corner
    ],
    []
  );

  const currentWaypointIndex = useRef(0);
  const waypointTimerRef = useRef(0);

  // Audio feedback on task transition
  useEffect(() => {
    if (activeTask !== prevTaskRef.current) {
      if (activeTask !== "idle") {
        chemistryAudio.playRobotServo();
      } else {
        chemistryAudio.playRobotChime();
      }
      prevTaskRef.current = activeTask;
    }
  }, [activeTask]);

  useFrame((state, delta) => {
    if (!robotRef.current) return;
    const t = state.clock.getElapsedTime();

    // ─────────────────────────────────────────────────────────────
    // 1. AUTONOMOUS BIPEDAL NAVIGATION & WORKSTATION TARGETING
    // ─────────────────────────────────────────────────────────────
    let targetPos = waypoints[currentWaypointIndex.current];

    if (activeTask === "titrating") {
      targetPos = new THREE.Vector3(0.35, 0, -1.15); // Directly across Titration Stand
    } else if (activeTask === "heating") {
      targetPos = new THREE.Vector3(-0.82, 0, -1.15); // Directly across Hotplate Stirrer
    } else if (activeTask === "centrifuging") {
      targetPos = new THREE.Vector3(1.15, 0, -1.15); // Directly across Benchtop Centrifuge
    } else if (activeTask === "cleaning") {
      targetPos = new THREE.Vector3(-1.85, 0, -0.6); // Across Wet Sink
    }

    const currentPos = robotRef.current.position;
    const distToTarget = currentPos.distanceTo(targetPos);
    const isWalking = distToTarget > 0.08;

    // Player proximity detection
    const distToCamera = currentPos.distanceTo(state.camera.position);
    const isPlayerClose = distToCamera < 2.8;

    if (isPlayerClose && activeTask === "idle" && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      isWavingRef.current = true;
      waveTimerRef.current = 2.4;
      chemistryAudio.playRobotChime();
    } else if (!isPlayerClose) {
      hasGreetedRef.current = false;
    }

    if (waveTimerRef.current > 0) {
      waveTimerRef.current -= delta;
      if (waveTimerRef.current <= 0) {
        isWavingRef.current = false;
      }
    }
    const isWaving = isWavingRef.current;

    if (isWalking) {
      const dir = targetPos.clone().sub(currentPos).normalize();
      currentPos.addScaledVector(dir, 1.15 * delta);

      // Smooth body rotation facing movement direction
      const targetRotationY = Math.atan2(dir.x, dir.z);
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        targetRotationY,
        6 * delta
      );
    } else {
      // Facing bench and player when working at station
      let restRotationY = 0;
      if (activeTask === "titrating") {
        restRotationY = Math.atan2(0 - currentPos.x, 0 - currentPos.z);
      } else if (activeTask === "heating") {
        restRotationY = Math.atan2(-0.82 - currentPos.x, -0.08 - currentPos.z);
      } else if (activeTask === "centrifuging") {
        restRotationY = Math.atan2(1.15 - currentPos.x, -0.08 - currentPos.z);
      } else if (activeTask === "idle" && isPlayerClose) {
        // Face player when close
        restRotationY = Math.atan2(
          state.camera.position.x - currentPos.x,
          state.camera.position.z - currentPos.z
        );
      }

      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        restRotationY,
        5 * delta
      );

      if (activeTask === "idle" && !isWaving) {
        waypointTimerRef.current += delta;
        if (waypointTimerRef.current > 9.0) {
          waypointTimerRef.current = 0;
          currentWaypointIndex.current = (currentWaypointIndex.current + 1) % waypoints.length;
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. PROCEDURAL WALKING GAIT & HIP CADENCE
    // ─────────────────────────────────────────────────────────────
    const walkFreq = 7.5;
    if (isWalking) {
      const walkBounce = Math.abs(Math.sin(t * walkFreq)) * 0.025;
      robotRef.current.position.y = walkBounce;

      // Leg stride oscillation
      if (leftThighRef.current && rightThighRef.current) {
        leftThighRef.current.rotation.x = Math.sin(t * walkFreq) * 0.42;
        rightThighRef.current.rotation.x = -Math.sin(t * walkFreq) * 0.42;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.max(0, -Math.sin(t * walkFreq) * 0.65);
        rightKneeRef.current.rotation.x = Math.max(0, Math.sin(t * walkFreq) * 0.65);
      }

      // Coat tails flutter with walking stride
      if (coatTailRef.current) {
        coatTailRef.current.rotation.x = 0.15 + Math.sin(t * walkFreq) * 0.12;
      }

      // Arm counter-swing
      if (leftArmRef.current && rightArmRef.current && activeTask === "idle" && !isWaving) {
        leftArmRef.current.rotation.x = -Math.sin(t * walkFreq) * 0.35;
        rightArmRef.current.rotation.x = Math.sin(t * walkFreq) * 0.35;
      }
    } else {
      // Natural grounded stance
      robotRef.current.position.y = THREE.MathUtils.lerp(robotRef.current.position.y, 0, 8 * delta);

      if (leftThighRef.current) leftThighRef.current.rotation.x = THREE.MathUtils.lerp(leftThighRef.current.rotation.x, 0, 8 * delta);
      if (rightThighRef.current) rightThighRef.current.rotation.x = THREE.MathUtils.lerp(rightThighRef.current.rotation.x, 0, 8 * delta);
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, 0, 8 * delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, 0, 8 * delta);

      if (coatTailRef.current) {
        coatTailRef.current.rotation.x = THREE.MathUtils.lerp(coatTailRef.current.rotation.x, 0.05, 5 * delta);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. HUMAN SCIENTIST HEAD GAZE TRACKING & EMOTION
    // ─────────────────────────────────────────────────────────────
    if (headRef.current && robotRef.current) {
      const headWorldPos = new THREE.Vector3();
      headRef.current.getWorldPosition(headWorldPos);

      const toCamera = state.camera.position.clone().sub(headWorldPos);
      const camDist = toCamera.length();

      if (camDist < 8.0) {
        // Player nearby: Orient head and neck to look directly at the player
        const localToCam = toCamera.clone();
        localToCam.applyAxisAngle(new THREE.Vector3(0, 1, 0), -robotRef.current.rotation.y);

        const targetYaw = Math.atan2(localToCam.x, localToCam.z);
        const clampedYaw = THREE.MathUtils.clamp(targetYaw, -0.95, 0.95);

        const targetPitch = -Math.atan2(
          localToCam.y,
          Math.sqrt(localToCam.x * localToCam.x + localToCam.z * localToCam.z)
        );
        const clampedPitch = THREE.MathUtils.clamp(targetPitch, -0.42, 0.45);

        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, clampedYaw, 5.0 * delta);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, clampedPitch, 5.0 * delta);
      } else {
        // Idly observing workbench
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, Math.sin(t * 1.1) * 0.18, 3 * delta);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, isWalking ? 0.05 : Math.sin(t * 0.8) * 0.06, 3 * delta);
      }
    }

    // Dynamic Visor Blinking & Smiling Expressions
    const isBlinking = (t % 3.8) < 0.12;
    const pupilScaleY = isBlinking ? 0.1 : (isWaving ? 0.6 : 1.0);
    if (leftPupilRef.current) leftPupilRef.current.scale.set(1, pupilScaleY, 1);
    if (rightPupilRef.current) rightPupilRef.current.scale.set(1, pupilScaleY, 1);

    // Audio Voice Grille Pulse
    if (voiceGrillRef.current) {
      const voiceMat = voiceGrillRef.current.material as THREE.MeshStandardMaterial;
      voiceMat.emissiveIntensity = 0.4 + Math.sin(t * 8) * 0.25;
    }

    // ─────────────────────────────────────────────────────────────
    // 4. DEXTEROUS ARM MANIPULATION, WAVING & ITEM PICKING
    // ─────────────────────────────────────────────────────────────
    if (isWaving) {
      // Warm wave greeting to player
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.55;
        rightArmRef.current.rotation.z = 0.45;
      }
      if (rightHandRef.current) {
        rightHandRef.current.rotation.z = Math.sin(t * 9) * 0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.4, 4 * delta);
      }
    } else if (activeTask !== "idle") {
      // Precise scientific protocol manipulation
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.15 + Math.sin(t * 3.5) * 0.12;
        rightArmRef.current.rotation.z = -0.22 + Math.cos(t * 2.8) * 0.08;
      }
      if (rightHandRef.current) {
        // Subtle wrist swirling motion
        rightHandRef.current.rotation.z = Math.sin(t * 4) * 0.25;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.85 + Math.cos(t * 3.0) * 0.12;
        leftArmRef.current.rotation.z = 0.22;
      }
    } else if (!isWalking) {
      // Idle scientific stance holding digital tablet
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, Math.sin(t * 1.8) * 0.08, 4 * delta);
        rightArmRef.current.rotation.z = -0.12;
      }
      if (rightHandRef.current) {
        rightHandRef.current.rotation.z = 0;
      }
      if (leftArmRef.current) {
        // Left arm cradles tablet across chest
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.75, 4 * delta);
        leftArmRef.current.rotation.z = 0.35;
      }
    }

    // Visor Dynamic Emissive Glow
    if (visorRef.current) {
      const glow = 0.85 + Math.sin(t * 4.5) * 0.15;
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = glow;
      if (activeTask === "titrating") {
        mat.emissive.set("#f43f5e");
      } else if (activeTask === "heating") {
        mat.emissive.set("#f59e0b");
      } else if (activeTask === "centrifuging") {
        mat.emissive.set("#38bdf8");
      } else if (activeTask === "cleaning") {
        mat.emissive.set("#10b981");
      } else {
        mat.emissive.set(isWaving ? "#38bdf8" : "#0284c7");
      }
    }
  });

  const taskStatusLabel =
    activeTask === "idle"
      ? "[ CLICK OR PRESS R FOR PROTOCOLS ]"
      : activeTask === "titrating"
      ? "TITRATING TO EQUIVALENCE pH 8.2"
      : activeTask === "heating"
      ? "HEATING CuSO₄ REAGENT ON HOTPLATE"
      : activeTask === "centrifuging"
      ? "HIGH-SPEED CENTRIFUGATION (8,000 RPM)"
      : "SANITIZING BENCH & GLASSWARE";

  return (
    <group
      ref={robotRef}
      position={[0.45, 0, -1.25]}
      onClick={(e) => {
        e.stopPropagation();
        onOpenMenu();
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING HOLOGRAPHIC SCIENTIST BADGE
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 1.95, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.76, 0.16]} />
          <meshBasicMaterial color="#030712" transparent opacity={0.88} />
        </mesh>
        <Text
          position={[0, 0.03, 0.01]}
          fontSize={0.036}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {"DR. AURA // AI LAB FELLOW"}
        </Text>
        <Text
          position={[0, -0.03, 0.01]}
          fontSize={0.02}
          color={activeTask === "idle" ? "#94a3b8" : "#f59e0b"}
          anchorX="center"
          anchorY="middle"
        >
          {taskStatusLabel}
        </Text>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ANDROID SCIENTIST HEAD & CYBERNETIC VISOR (Y = 1.58m)
         ───────────────────────────────────────────────────────────── */}
      <group ref={headRef} position={[0, 1.58, 0]}>
        {/* Cranial Ceramic Skull Shell with Hairline Seams */}
        <mesh castShadow material={armorMaterial}>
          <sphereGeometry args={[0.11, 32, 32]} />
        </mesh>

        {/* Sculpted Humanoid Faceplate (Cheekplates & Nose Bridge Profile) */}
        <mesh position={[0, -0.02, 0.082]} material={innerChassisMaterial}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
        </mesh>
        {/* Nose Bridge Contour */}
        <mesh position={[0, 0.01, 0.104]} material={armorMaterial}>
          <coneGeometry args={[0.012, 0.035, 4]} />
        </mesh>
        {/* Chiseled Jaw & Chin Armor */}
        <mesh position={[0, -0.075, 0.05]} material={innerChassisMaterial}>
          <boxGeometry args={[0.08, 0.045, 0.07]} />
        </mesh>

        {/* Voice Speech Synthesizer Grille (Pulses when speaking) */}
        <mesh ref={voiceGrillRef} position={[0, -0.055, 0.098]}>
          <planeGeometry args={[0.036, 0.012]} />
          <meshStandardMaterial
            color="#0c4a6e"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Curved Panoramic Holographic Visor */}
        <mesh ref={visorRef} position={[0, 0.018, 0.092]}>
          <boxGeometry args={[0.145, 0.058, 0.03]} />
          <meshStandardMaterial
            color="#0c4a6e"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Expressive Visor Digital Pupil Capsules */}
        <mesh ref={leftPupilRef} position={[-0.034, 0.018, 0.11]}>
          <planeGeometry args={[0.025, 0.009]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        <mesh ref={rightPupilRef} position={[0.034, 0.018, 0.11]}>
          <planeGeometry args={[0.025, 0.009]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>

        {/* Headset Audio Earcups with Rotating Comms Dial */}
        {[-0.112, 0.112].map((ex, ei) => (
          <group key={ei} position={[ex, 0.02, 0]}>
            <mesh material={jointMaterial}>
              <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
            </mesh>
            <mesh position={[0, 0.025, 0]} material={chromeMaterial}>
              <sphereGeometry args={[0.007, 12, 12]} />
            </mesh>
            {/* Status LED */}
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.004, 12, 12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        ))}

        {/* Articulated Cervical Neck Cylinder & Hydraulic Pistons */}
        <mesh position={[0, -0.11, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.036, 0.044, 0.08, 16]} />
        </mesh>
        {[-0.025, 0.025].map((nx, ni) => (
          <mesh key={ni} position={[nx, -0.11, -0.02]} material={chromeMaterial}>
            <cylinderGeometry args={[0.005, 0.005, 0.07, 12]} />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN SCIENTIST TORSO & TAILORED LAB COAT (Y = 1.25m)
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 1.25, 0]}>
        {/* Inner Cybernetic Torso Chassis */}
        <mesh castShadow material={innerChassisMaterial}>
          <capsuleGeometry args={[0.12, 0.28, 16, 24]} />
        </mesh>

        {/* Inner Tactical Turtleneck Collar (Dark Navy Blue) */}
        <mesh position={[0, 0.18, 0.01]}>
          <cylinderGeometry args={[0.075, 0.085, 0.06, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        {/* Metallic Tie Clip / Collar Pin */}
        <mesh position={[0, 0.16, 0.082]} material={chromeMaterial}>
          <boxGeometry args={[0.018, 0.006, 0.004]} />
        </mesh>

        {/* Tailored Lab Coat Body */}
        <mesh position={[0, 0.02, 0.01]} castShadow receiveShadow material={coatMaterial}>
          <boxGeometry args={[0.29, 0.35, 0.22]} />
        </mesh>

        {/* Folded Coat Collar */}
        <mesh position={[0, 0.185, 0.02]} material={coatMaterial}>
          <boxGeometry args={[0.24, 0.05, 0.22]} />
        </mesh>

        {/* Realistic Notched Left & Right Lapels */}
        <mesh position={[-0.075, 0.08, 0.118]} rotation={[0, 0.18, -0.1]} material={coatMaterial}>
          <boxGeometry args={[0.07, 0.19, 0.015]} />
        </mesh>
        <mesh position={[0.075, 0.08, 0.118]} rotation={[0, -0.18, 0.1]} material={coatMaterial}>
          <boxGeometry args={[0.07, 0.19, 0.015]} />
        </mesh>

        {/* Front Coat Closure Buttons */}
        {[0.02, -0.04, -0.10].map((by, bi) => (
          <mesh key={bi} position={[-0.01, by, 0.124]} material={chromeMaterial}>
            <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
          </mesh>
        ))}

        {/* Scientist ID Badge Card on Left Lapel */}
        <group position={[-0.085, 0.02, 0.128]}>
          <mesh>
            <planeGeometry args={[0.045, 0.065]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.018, 0.001]}>
            <planeGeometry args={[0.038, 0.024]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -0.016, 0.001]}>
            <planeGeometry args={[0.038, 0.012]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Badge Clip */}
          <mesh position={[0, 0.035, 0.002]} material={chromeMaterial}>
            <boxGeometry args={[0.012, 0.008, 0.005]} />
          </mesh>
        </group>

        {/* MageLabs Breast Pocket Crest & Pens */}
        <group position={[0.085, 0.04, 0.126]}>
          <mesh>
            <planeGeometry args={[0.036, 0.036]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Silver & Red Laboratory Pens */}
          <mesh position={[-0.006, 0.025, 0.002]} rotation={[0, 0, -0.08]} material={chromeMaterial}>
            <cylinderGeometry args={[0.003, 0.003, 0.038, 12]} />
          </mesh>
          <mesh position={[0.006, 0.022, 0.001]} rotation={[0, 0, 0.06]}>
            <cylinderGeometry args={[0.003, 0.003, 0.034, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>

        {/* Dual Lower Hip Pockets with Flap Covers */}
        {[-0.09, 0.09].map((px, pi) => (
          <mesh key={pi} position={[px, -0.09, 0.12]} material={coatMaterial}>
            <boxGeometry args={[0.07, 0.05, 0.01]} />
          </mesh>
        ))}

        {/* Waist Belt Sash Band at Back */}
        <mesh position={[0, -0.08, -0.105]} material={coatMaterial}>
          <boxGeometry args={[0.26, 0.035, 0.015]} />
        </mesh>

        {/* Split Coat Tails Draping to Knees */}
        <group ref={coatTailRef} position={[0, -0.18, 0]}>
          <mesh position={[0, -0.16, -0.01]} material={coatMaterial}>
            <boxGeometry args={[0.3, 0.32, 0.22]} />
          </mesh>
          {/* Open Front Vent */}
          <mesh position={[-0.095, -0.16, 0.1]} material={coatMaterial}>
            <boxGeometry args={[0.095, 0.32, 0.02]} />
          </mesh>
          <mesh position={[0.095, -0.16, 0.1]} material={coatMaterial}>
            <boxGeometry args={[0.095, 0.32, 0.02]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. ARTICULATED HUMANOID ARMS & 5-DIGIT DEXTEROUS HANDS
         ───────────────────────────────────────────────────────────── */}
      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.185, 1.34, 0]}>
        {/* Shoulder Pauldron */}
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.042, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.02, 0]} material={coatMaterial}>
          <sphereGeometry args={[0.048, 16, 16]} />
        </mesh>

        {/* Upper Bicep Sleeve */}
        <mesh position={[0, -0.12, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.045, 0.042, 0.18, 16]} />
        </mesh>

        {/* Mechanical Elbow Pivot */}
        <mesh position={[0, -0.22, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.028, 0.028, 0.04, 16]} />
        </mesh>

        {/* Titanium Forearm Gauntlet */}
        <mesh position={[0, -0.32, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.032, 0.028, 0.16, 16]} />
        </mesh>
        {/* Forearm Telemetry Status Strip */}
        <mesh position={[0, -0.32, 0.03]}>
          <planeGeometry args={[0.015, 0.08]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 5-Digit Dexterous Left Hand & Holding Tablet */}
        <group position={[0, -0.42, 0]}>
          {/* Palm Chassis */}
          <mesh material={innerChassisMaterial}>
            <boxGeometry args={[0.038, 0.042, 0.018]} />
          </mesh>
          {/* 5 Articulated Fingers */}
          {[-0.013, -0.004, 0.005, 0.014].map((fx, fi) => (
            <mesh key={fi} position={[fx, -0.032, 0]} material={siliconeGripMaterial}>
              <boxGeometry args={[0.006, 0.025, 0.012]} />
            </mesh>
          ))}
          {/* Opposed Thumb */}
          <mesh position={[-0.022, -0.015, 0.008]} rotation={[0, 0.4, 0.3]} material={siliconeGripMaterial}>
            <boxGeometry args={[0.007, 0.02, 0.012]} />
          </mesh>

          {/* Diagnostic Laboratory Tablet (Held in left arm during idle patrol) */}
          {activeTask === "idle" && (
            <group position={[0.06, 0.05, 0.04]} rotation={[0.4, 0.2, -0.3]}>
              <mesh castShadow>
                <boxGeometry args={[0.14, 0.2, 0.008]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.005]}>
                <planeGeometry args={[0.12, 0.18]} />
                <meshBasicMaterial color="#0369a1" />
              </mesh>
              <Text
                position={[0, 0.06, 0.006]}
                fontSize={0.012}
                color="#e0f2fe"
                anchorX="center"
                anchorY="middle"
              >
                {"AURA OS // TELEMETRY"}
              </Text>
            </group>
          )}
        </group>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.185, 1.34, 0]}>
        {/* Shoulder Pauldron */}
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.042, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.02, 0]} material={coatMaterial}>
          <sphereGeometry args={[0.048, 16, 16]} />
        </mesh>

        {/* Upper Bicep Sleeve */}
        <mesh position={[0, -0.12, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.045, 0.042, 0.18, 16]} />
        </mesh>

        {/* Mechanical Elbow Pivot */}
        <mesh position={[0, -0.22, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.028, 0.028, 0.04, 16]} />
        </mesh>

        {/* Titanium Forearm Gauntlet */}
        <mesh position={[0, -0.32, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.032, 0.028, 0.16, 16]} />
        </mesh>
        <mesh position={[0, -0.32, 0.03]}>
          <planeGeometry args={[0.015, 0.08]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 5-Digit Dexterous Right Hand & Physical Item Slot */}
        <group ref={rightHandRef} position={[0, -0.42, 0]}>
          {/* Palm Chassis */}
          <mesh material={innerChassisMaterial}>
            <boxGeometry args={[0.038, 0.042, 0.018]} />
          </mesh>
          {/* 4 Fingers */}
          {[-0.014, -0.005, 0.004, 0.013].map((fx, fi) => (
            <mesh key={fi} position={[fx, -0.032, 0]} material={siliconeGripMaterial}>
              <boxGeometry args={[0.006, 0.025, 0.012]} />
            </mesh>
          ))}
          {/* Opposed Thumb */}
          <mesh position={[0.022, -0.015, 0.008]} rotation={[0, -0.4, -0.3]} material={siliconeGripMaterial}>
            <boxGeometry args={[0.007, 0.02, 0.012]} />
          </mesh>

          {/* ─────────────────────────────────────────────────────────
              IN-HAND PHYSICAL VESSEL / TOOL (Active Manipulation)
             ───────────────────────────────────────────────────────── */}
          {/* Titration Protocol: Holding Erlenmeyer Flask */}
          {activeTask === "titrating" && (
            <group position={[0, -0.06, 0.03]} rotation={[-0.2, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.015, 0.038, 0.065, 20]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.4}
                  roughness={0.06}
                  transmission={0.92}
                />
              </mesh>
              {/* Solution inside flask */}
              <mesh position={[0, -0.015, 0]}>
                <cylinderGeometry args={[0.018, 0.035, 0.03, 16]} />
                <meshPhysicalMaterial
                  color="#f43f5e"
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.7}
                />
              </mesh>
            </group>
          )}

          {/* Heating Protocol: Holding Reaction Beaker */}
          {activeTask === "heating" && (
            <group position={[0, -0.06, 0.03]} rotation={[-0.15, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.028, 0.028, 0.065, 20]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.4}
                  roughness={0.06}
                  transmission={0.92}
                />
              </mesh>
              {/* Azure CuSO4 Solution */}
              <mesh position={[0, -0.01, 0]}>
                <cylinderGeometry args={[0.026, 0.026, 0.04, 16]} />
                <meshPhysicalMaterial
                  color="#0284c7"
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.7}
                />
              </mesh>
            </group>
          )}

          {/* Centrifugation Protocol: Holding Eppendorf Centrifuge Tube */}
          {activeTask === "centrifuging" && (
            <group position={[0, -0.04, 0.02]} rotation={[-0.3, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.007, 0.002, 0.04, 16]} />
                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.022, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* Cleaning Protocol: Holding Deionized Squeeze Wash Bottle */}
          {activeTask === "cleaning" && (
            <group position={[0, -0.06, 0.03]} rotation={[-0.3, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.65} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.055, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.015, 16]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              <mesh position={[0.01, 0.08, 0]} rotation={[0, 0, -0.6]}>
                <cylinderGeometry args={[0.0025, 0.0025, 0.06, 12]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. ARTICULATED BIPEDAL LEGS & REINFORCED LAB BOOTS
         ───────────────────────────────────────────────────────────── */}
      {/* LEFT LEG */}
      <group ref={leftThighRef} position={[-0.09, 0.88, 0]}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.042, 16, 16]} />
        </mesh>
        {/* Upper Thigh Armor */}
        <mesh position={[0, -0.18, 0]} material={innerChassisMaterial}>
          <cylinderGeometry args={[0.044, 0.038, 0.32, 16]} />
        </mesh>

        {/* Knee Joint with Anatomical Patella Guard */}
        <group ref={leftKneeRef} position={[0, -0.34, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.038, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.032]} material={armorMaterial}>
            <boxGeometry args={[0.036, 0.045, 0.015]} />
          </mesh>
          {/* Hydraulic Piston Rod */}
          <mesh position={[0, 0.03, -0.025]} material={chromeMaterial}>
            <cylinderGeometry args={[0.006, 0.006, 0.07, 12]} />
          </mesh>

          {/* Lower Shin */}
          <mesh position={[0, -0.18, 0]} material={armorMaterial}>
            <cylinderGeometry args={[0.036, 0.032, 0.34, 16]} />
          </mesh>

          {/* Magnetic Laboratory Boot */}
          <mesh position={[0, -0.36, 0.035]}>
            <boxGeometry args={[0.08, 0.052, 0.165]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Rubber Tread Sole */}
          <mesh position={[0, -0.388, 0.035]}>
            <boxGeometry args={[0.084, 0.012, 0.17]} />
            <meshStandardMaterial color="#0284c7" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightThighRef} position={[0.09, 0.88, 0]}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.042, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.18, 0]} material={innerChassisMaterial}>
          <cylinderGeometry args={[0.044, 0.038, 0.32, 16]} />
        </mesh>

        <group ref={rightKneeRef} position={[0, -0.34, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.038, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.032]} material={armorMaterial}>
            <boxGeometry args={[0.036, 0.045, 0.015]} />
          </mesh>
          <mesh position={[0, 0.03, -0.025]} material={chromeMaterial}>
            <cylinderGeometry args={[0.006, 0.006, 0.07, 12]} />
          </mesh>

          <mesh position={[0, -0.18, 0]} material={armorMaterial}>
            <cylinderGeometry args={[0.036, 0.032, 0.34, 16]} />
          </mesh>

          <mesh position={[0, -0.36, 0.035]}>
            <boxGeometry args={[0.08, 0.052, 0.165]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.388, 0.035]}>
            <boxGeometry args={[0.084, 0.012, 0.17]} />
            <meshStandardMaterial color="#0284c7" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
