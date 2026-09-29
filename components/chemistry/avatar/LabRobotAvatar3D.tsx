"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

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
 * Full humanoid bipedal android wearing a tailored scientist laboratory coat,
 * articulated walking legs with procedural gait locomotion,
 * dexterous manipulator hands, and expressive cybernetic visor.
 */
export function LabRobotAvatar3D({
  onOpenMenu,
  activeTask,
}: RobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftThighRef = useRef<THREE.Group>(null);
  const rightThighRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);
  const coatTailRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  // Shared Materials
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
        metalness: 0.4,
      }),
    []
  );

  const innerChassisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.4,
        metalness: 0.8,
      }),
    []
  );

  const jointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#475569",
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  // Patrol waypoints across the laboratory (North side of bench facing player, ground Y = 0)
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

  useFrame((state, delta) => {
    if (!robotRef.current) return;
    const t = state.clock.getElapsedTime();

    // ─────────────────────────────────────────────────────────────
    // 1. AUTONOMOUS BIPEDAL NAVIGATION & WAYPOINT TRACKING
    // ─────────────────────────────────────────────────────────────
    let targetPos = waypoints[currentWaypointIndex.current];

    if (activeTask === "titrating") {
      targetPos = new THREE.Vector3(0.35, 0, -1.15); // Across Titration Flask & Burette
    } else if (activeTask === "heating") {
      targetPos = new THREE.Vector3(-0.82, 0, -1.15); // Across Hotplate Stirrer
    } else if (activeTask === "centrifuging") {
      targetPos = new THREE.Vector3(1.15, 0, -1.15); // Across Benchtop Centrifuge
    } else if (activeTask === "cleaning") {
      targetPos = new THREE.Vector3(-1.85, 0, -0.6); // Across Wash Basin
    }

    const currentPos = robotRef.current.position;
    const distToTarget = currentPos.distanceTo(targetPos);
    const isWalking = distToTarget > 0.08;

    if (isWalking) {
      const dir = targetPos.clone().sub(currentPos).normalize();
      currentPos.addScaledVector(dir, 1.15 * delta);

      // Smooth body rotation to face movement direction
      const targetRotationY = Math.atan2(dir.x, dir.z);
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        targetRotationY,
        6 * delta
      );
    } else {
      // When stopped at workstation, face bench & player
      let restRotationY = 0; // Facing south toward table and player
      if (activeTask === "titrating") {
        restRotationY = Math.atan2(0 - currentPos.x, 0 - currentPos.z);
      } else if (activeTask === "heating") {
        restRotationY = Math.atan2(-0.82 - currentPos.x, -0.08 - currentPos.z);
      } else if (activeTask === "centrifuging") {
        restRotationY = Math.atan2(1.15 - currentPos.x, -0.08 - currentPos.z);
      }
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        restRotationY,
        5 * delta
      );

      if (activeTask === "idle") {
        // In idle mode, patrol to next station every 9 seconds
        waypointTimerRef.current += delta;
        if (waypointTimerRef.current > 8.5) {
          waypointTimerRef.current = 0;
          currentWaypointIndex.current = (currentWaypointIndex.current + 1) % waypoints.length;
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. PROCEDURAL WALKING GAIT LOCOMOTION
    // ─────────────────────────────────────────────────────────────
    const walkFreq = 7.5;
    if (isWalking) {
      // Hip bounce with walking cadence
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

      // Natural arm counter-swing
      if (leftArmRef.current && rightArmRef.current && activeTask === "idle") {
        leftArmRef.current.rotation.x = -Math.sin(t * walkFreq) * 0.35;
        rightArmRef.current.rotation.x = Math.sin(t * walkFreq) * 0.35;
      }
    } else {
      // Natural grounded resting stance
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
    // 3. SCIENTIST ASSISTANCE GESTURES & ARM MANIPULATION
    // ─────────────────────────────────────────────────────────────
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.1) * 0.18;
      headRef.current.rotation.x = isWalking ? 0.05 : Math.sin(t * 0.8) * 0.06;
    }

    if (activeTask !== "idle") {
      // Actively manipulating glassware / equipment on bench
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.1 + Math.sin(t * 3.5) * 0.18;
        rightArmRef.current.rotation.z = -0.25 + Math.cos(t * 2.8) * 0.1;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.85 + Math.cos(t * 3.0) * 0.15;
        leftArmRef.current.rotation.z = 0.2;
      }
    } else if (!isWalking) {
      // Idle relaxed arm sway
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, Math.sin(t * 1.8) * 0.08, 4 * delta);
        rightArmRef.current.rotation.z = -0.12;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -Math.sin(t * 1.8) * 0.08, 4 * delta);
        leftArmRef.current.rotation.z = 0.12;
      }
    }

    // Dynamic Visor Pulse & Emissive Hue
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
        mat.emissive.set("#0284c7");
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
          <planeGeometry args={[0.72, 0.16]} />
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
          2. ANDROID SCIENTIST HEAD & CYBERNETIC VISOR (Y = 1.62m)
         ───────────────────────────────────────────────────────────── */}
      <group ref={headRef} position={[0, 1.58, 0]}>
        {/* White Ceramic Skull Helmet */}
        <mesh castShadow material={armorMaterial}>
          <sphereGeometry args={[0.11, 32, 32]} />
        </mesh>

        {/* Chiseled Jaw & Chin Armor */}
        <mesh position={[0, -0.06, 0.04]} material={innerChassisMaterial}>
          <boxGeometry args={[0.09, 0.06, 0.08]} />
        </mesh>

        {/* Curved Expressive Holographic Visor */}
        <mesh ref={visorRef} position={[0, 0.012, 0.088]}>
          <boxGeometry args={[0.14, 0.055, 0.03]} />
          <meshStandardMaterial
            color="#0c4a6e"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Expressive Visor Digital Pupil Slits */}
        <mesh position={[-0.032, 0.012, 0.105]}>
          <planeGeometry args={[0.024, 0.007]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        <mesh position={[0.032, 0.012, 0.105]}>
          <planeGeometry args={[0.024, 0.007]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>

        {/* Ear Comms Antenna & Status LED */}
        <mesh position={[0.11, 0.02, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
        </mesh>
        <mesh position={[0.11, 0.05, 0]}>
          <sphereGeometry args={[0.006, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.11, 0.02, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
        </mesh>
        <mesh position={[-0.11, 0.05, 0]}>
          <sphereGeometry args={[0.006, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Neck Articulated Cylinder */}
        <mesh position={[0, -0.11, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.035, 0.042, 0.08, 16]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN SCIENTIST TORSO & TAILORED WHITE LAB COAT (Y = 1.25m)
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 1.25, 0]}>
        {/* Inner Cybernetic Torso Chassis */}
        <mesh castShadow material={innerChassisMaterial}>
          <capsuleGeometry args={[0.12, 0.28, 16, 24]} />
        </mesh>

        {/* Blue Power Core Glowing Reactor */}
        <mesh position={[0, 0.04, 0.122]}>
          <circleGeometry args={[0.028, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* White Laboratory Coat: Chest Body Wrap */}
        <mesh position={[0, 0.02, 0.01]} castShadow receiveShadow material={coatMaterial}>
          <boxGeometry args={[0.28, 0.34, 0.22]} />
        </mesh>

        {/* Left Lapel */}
        <mesh position={[-0.07, 0.08, 0.115]} rotation={[0, 0.15, -0.1]} material={coatMaterial}>
          <boxGeometry args={[0.065, 0.18, 0.015]} />
        </mesh>

        {/* Right Lapel */}
        <mesh position={[0.07, 0.08, 0.115]} rotation={[0, -0.15, 0.1]} material={coatMaterial}>
          <boxGeometry args={[0.065, 0.18, 0.015]} />
        </mesh>

        {/* Lab Coat Front Closure Buttons */}
        {[0.02, -0.04, -0.10].map((by, bi) => (
          <mesh key={bi} position={[-0.01, by, 0.123]}>
            <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}

        {/* Laboratory ID Badge Lanyard on Chest */}
        <group position={[-0.08, 0.02, 0.125]}>
          {/* Badge Card */}
          <mesh>
            <planeGeometry args={[0.045, 0.06]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Photo & Text bar */}
          <mesh position={[0, 0.015, 0.001]}>
            <planeGeometry args={[0.038, 0.022]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -0.015, 0.001]}>
            <planeGeometry args={[0.038, 0.01]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* MageLabs Breast Pocket Crest & Pens */}
        <group position={[0.08, 0.04, 0.124]}>
          <mesh>
            <planeGeometry args={[0.034, 0.034]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Red & Blue Scientific Pipettor Pens */}
          <mesh position={[-0.006, 0.025, 0.002]} rotation={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.003, 0.003, 0.035, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.006, 0.022, 0.001]} rotation={[0, 0, 0.06]}>
            <cylinderGeometry args={[0.003, 0.003, 0.032, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>

        {/* Dual Lower Waist Pockets with Flap Covers */}
        <mesh position={[-0.085, -0.09, 0.118]} material={coatMaterial}>
          <boxGeometry args={[0.065, 0.05, 0.01]} />
        </mesh>
        <mesh position={[0.085, -0.09, 0.118]} material={coatMaterial}>
          <boxGeometry args={[0.065, 0.05, 0.01]} />
        </mesh>

        {/* ─────────────────────────────────────────────────────────────
            4. LAB COAT LOWER TAILS / SKIRT (Extends past hips to knees)
           ───────────────────────────────────────────────────────────── */}
        <group ref={coatTailRef} position={[0, -0.18, 0]}>
          {/* Back & Side Coat Panels */}
          <mesh position={[0, -0.16, -0.01]} material={coatMaterial}>
            <boxGeometry args={[0.29, 0.32, 0.21]} />
          </mesh>
          {/* Split Front Vent (Open to reveal walking legs) */}
          <mesh position={[-0.09, -0.16, 0.095]} material={coatMaterial}>
            <boxGeometry args={[0.09, 0.32, 0.02]} />
          </mesh>
          <mesh position={[0.09, -0.16, 0.095]} material={coatMaterial}>
            <boxGeometry args={[0.09, 0.32, 0.02]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. ARTICULATED HUMANOID ARMS (With Lab Coat Sleeves & Gloves)
         ───────────────────────────────────────────────────────────── */}
      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.18, 1.34, 0]}>
        {/* Shoulder Joint */}
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        {/* Lab Coat Upper Arm Sleeve (White Fabric) */}
        <mesh position={[0, -0.12, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.045, 0.042, 0.2, 16]} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.23, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.032, 16, 16]} />
        </mesh>
        {/* Forearm (Titanium Chassis) */}
        <mesh position={[0, -0.34, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.03, 0.028, 0.18, 16]} />
        </mesh>
        {/* Nitrile Tactile Hand & Dexterous Fingers */}
        <mesh position={[0, -0.44, 0]}>
          <boxGeometry args={[0.038, 0.05, 0.022]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[-0.012, -0.48, 0]}>
          <boxGeometry args={[0.008, 0.032, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.012, -0.48, 0]}>
          <boxGeometry args={[0.008, 0.032, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.18, 1.34, 0]}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.12, 0]} material={coatMaterial}>
          <cylinderGeometry args={[0.045, 0.042, 0.2, 16]} />
        </mesh>
        <mesh position={[0, -0.23, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.032, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.34, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.03, 0.028, 0.18, 16]} />
        </mesh>
        <mesh position={[0, -0.44, 0]}>
          <boxGeometry args={[0.038, 0.05, 0.022]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[-0.012, -0.48, 0]}>
          <boxGeometry args={[0.008, 0.032, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.012, -0.48, 0]}>
          <boxGeometry args={[0.008, 0.032, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. ARTICULATED BIPEDAL WALKING LEGS & MAGNETIC LAB BOOTS
         ───────────────────────────────────────────────────────────── */}
      {/* LEFT LEG */}
      <group ref={leftThighRef} position={[-0.09, 0.88, 0]}>
        {/* Hip Joint Ball */}
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        {/* Upper Thigh */}
        <mesh position={[0, -0.18, 0]} material={innerChassisMaterial}>
          <cylinderGeometry args={[0.042, 0.036, 0.32, 16]} />
        </mesh>

        {/* Knee Joint & Shin */}
        <group ref={leftKneeRef} position={[0, -0.34, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.038, 16, 16]} />
          </mesh>
          {/* Lower Shin */}
          <mesh position={[0, -0.18, 0]} material={armorMaterial}>
            <cylinderGeometry args={[0.034, 0.032, 0.34, 16]} />
          </mesh>
          {/* Laboratory Magnetic Boot */}
          <mesh position={[0, -0.36, 0.03]}>
            <boxGeometry args={[0.075, 0.05, 0.16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightThighRef} position={[0.09, 0.88, 0]}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.18, 0]} material={innerChassisMaterial}>
          <cylinderGeometry args={[0.042, 0.036, 0.32, 16]} />
        </mesh>

        <group ref={rightKneeRef} position={[0, -0.34, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.038, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.18, 0]} material={armorMaterial}>
            <cylinderGeometry args={[0.034, 0.032, 0.34, 16]} />
          </mesh>
          <mesh position={[0, -0.36, 0.03]}>
            <boxGeometry args={[0.075, 0.05, 0.16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
