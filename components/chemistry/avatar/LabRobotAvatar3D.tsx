"use client";

import { useRef, useState } from "react";
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

export function LabRobotAvatar3D({
  onOpenMenu,
  activeTask,
  onTaskProgress,
  onTaskComplete,
}: RobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  // Patrol waypoints in the laboratory
  const waypoints = [
    new THREE.Vector3(-1.2, 0, 1.4), // Near Hotplate
    new THREE.Vector3(0, 0, 1.4),    // In front of Titration Bench
    new THREE.Vector3(1.4, 0, 1.4),  // Near Centrifuge
    new THREE.Vector3(2.4, 0, 0.4),  // Near Balance
    new THREE.Vector3(-2.8, 0, 0.2), // Near Reagent Shelves
  ];

  const currentWaypointIndex = useRef(0);
  const [speechBubble, setSpeechBubble] = useState<string>("AURA: Ready to assist");
  const taskStepRef = useRef(0);
  const taskTimerRef = useRef(0);

  useFrame((state, delta) => {
    if (!robotRef.current) return;
    const t = state.clock.getElapsedTime();

    // ─────────────────────────────────────────────────────────────
    // 1. AUTONOMOUS PATROL & TASK NAVIGATION
    // ─────────────────────────────────────────────────────────────
    let targetPos = waypoints[currentWaypointIndex.current];

    if (activeTask === "titrating") {
      targetPos = new THREE.Vector3(0, 0, 1.15); // Stand directly at Titration Bench
    } else if (activeTask === "heating") {
      targetPos = new THREE.Vector3(-0.95, 0, 1.15); // Stand at Hotplate Stirrer
    } else if (activeTask === "centrifuging") {
      targetPos = new THREE.Vector3(1.45, 0, 1.15); // Stand at Centrifuge
    } else if (activeTask === "cleaning") {
      targetPos = new THREE.Vector3(-2.5, 0, 0.5); // Wet sink counter
    }

    // Move toward target position
    const currentPos = robotRef.current.position;
    const distToTarget = currentPos.distanceTo(targetPos);

    if (distToTarget > 0.08) {
      const dir = targetPos.clone().sub(currentPos).normalize();
      currentPos.addScaledVector(dir, 1.1 * delta);

      // Rotate to face movement direction
      const targetRotationY = Math.atan2(dir.x, dir.z);
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        targetRotationY,
        6 * delta
      );
    } else if (activeTask === "idle") {
      // In idle mode, cycle to next waypoint every 8 seconds
      taskTimerRef.current += delta;
      if (taskTimerRef.current > 7.5) {
        taskTimerRef.current = 0;
        currentWaypointIndex.current = (currentWaypointIndex.current + 1) % waypoints.length;
      }
    }

    // Floating hover animation (gentle vertical oscillation)
    const hoverY = 0.58 + Math.sin(t * 2.5) * 0.04;
    robotRef.current.position.y = hoverY;

    // ─────────────────────────────────────────────────────────────
    // 2. PROCEDURAL ARM & HEAD ANIMATION
    // ─────────────────────────────────────────────────────────────
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.25;
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.08;
    }

    // Animate arms based on active task
    if (activeTask === "titrating" || activeTask === "heating" || activeTask === "centrifuging" || activeTask === "cleaning") {
      if (rightArmRef.current) {
        // Reaching and manipulating forward
        rightArmRef.current.rotation.x = -1.1 + Math.sin(t * 4) * 0.25;
        rightArmRef.current.rotation.z = -0.3 + Math.cos(t * 3) * 0.15;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.9 + Math.cos(t * 3.5) * 0.2;
      }
    } else {
      // Gentle idle arm sway
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          Math.sin(t * 2) * 0.15,
          4 * delta
        );
        rightArmRef.current.rotation.z = -0.15;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          -Math.sin(t * 2) * 0.15,
          4 * delta
        );
        leftArmRef.current.rotation.z = 0.15;
      }
    }

    // Visor glow pulse
    if (visorRef.current) {
      const glow = 0.8 + Math.sin(t * 4) * 0.2;
      (visorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
    }
  });

  const taskStatusLabel =
    activeTask === "idle"
      ? "[ CLICK OR PRESS R ]"
      : activeTask === "titrating"
      ? "TITRATING TO pH 8.2"
      : activeTask === "heating"
      ? "HEATING ON HOTPLATE"
      : activeTask === "centrifuging"
      ? "CENTRIFUGING 8,000 RPM"
      : "SANITIZING BENCH";

  return (
    <group
      ref={robotRef}
      position={[0, 0.6, 1.4]}
      onClick={(e) => {
        e.stopPropagation();
        onOpenMenu();
      }}
    >
      {/* 1. Floating Holographic Speech Bubble / Nametag */}
      <group position={[0, 1.05, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.62, 0.15]} />
          <meshBasicMaterial color="#090a0f" transparent opacity={0.85} />
        </mesh>
        <Text
          position={[0, 0.025, 0.01]}
          fontSize={0.038}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {"AURA // LAB-BOT"}
        </Text>
        <Text
          position={[0, -0.028, 0.01]}
          fontSize={0.022}
          color={activeTask === "idle" ? "#94a3b8" : "#f59e0b"}
          anchorX="center"
          anchorY="middle"
        >
          {taskStatusLabel}
        </Text>
      </group>

      {/* 2. Head with Animated Visor Screen */}
      <group ref={headRef} position={[0, 0.72, 0]}>
        {/* White Ceramic / Polycarbonate Helmet */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Visor Display Screen (Curved Black Acrylic) */}
        <mesh ref={visorRef} position={[0, 0.015, 0.09]}>
          <boxGeometry args={[0.16, 0.07, 0.04]} />
          <meshStandardMaterial
            color="#0c4a6e"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Robot Antenna / Sensor Array */}
        <mesh position={[0.09, 0.11, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.09, 0.15, 0]}>
          <sphereGeometry args={[0.009, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 3. Sleek Torso / Chassis with Science Badge */}
      <group position={[0, 0.42, 0]}>
        {/* Main Chest Body */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.11, 0.18, 16, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Chest Dark Carbon Accent */}
        <mesh position={[0, 0.02, 0.09]}>
          <boxGeometry args={[0.12, 0.14, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Glowing Reactor / Power Core */}
        <mesh position={[0, 0.02, 0.102]}>
          <circleGeometry args={[0.028, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 4. Articulated Robotic Left Arm */}
      <group ref={leftArmRef} position={[-0.15, 0.48, 0]}>
        {/* Shoulder Joint Sphere */}
        <mesh>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.016, 0.16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.19, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Forearm & Magnetic Gripper */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.016, 0.018, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* 2-Finger Gripper Claws */}
        <mesh position={[-0.015, -0.37, 0]}>
          <boxGeometry args={[0.008, 0.04, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.015, -0.37, 0]}>
          <boxGeometry args={[0.008, 0.04, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* 5. Articulated Robotic Right Arm */}
      <group ref={rightArmRef} position={[0.15, 0.48, 0]}>
        <mesh>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.016, 0.16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.016, 0.018, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[-0.015, -0.37, 0]}>
          <boxGeometry args={[0.008, 0.04, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.015, -0.37, 0]}>
          <boxGeometry args={[0.008, 0.04, 0.014]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* 6. Hover Repulsor Thruster Base (with Cyan Ion Glow) */}
      <group position={[0, 0.16, 0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.04, 0.12, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Cyan Glowing Repulsor Emitter Ring */}
        <mesh position={[0, -0.06, 0]}>
          <torusGeometry args={[0.05, 0.012, 16, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Downward Ion Thruster Light onto Floor */}
        <pointLight position={[0, -0.2, 0]} color="#38bdf8" intensity={1.8} distance={1.2} />
      </group>
    </group>
  );
}
