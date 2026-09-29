"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface PlayerControllerProps {
  isInspecting: boolean;
  onInteract: () => void;
  onHoverObject: (label: string | null) => void;
}

export function PlayerController({
  isInspecting,
  onInteract,
  onHoverObject,
}: PlayerControllerProps) {
  const { camera, gl } = useThree();

  // Keys state
  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    sprint: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  // Physical parameters
  const velocity = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const isLocked = useRef(false);
  const footstepAccumulator = useRef(0);
  const targetFov = useRef(52);

  // Initial camera position (close ergonomic standing eye height at chemistry bench)
  useEffect(() => {
    if (!isInspecting) {
      camera.position.set(0, 1.48, 0.96);
      camera.rotation.set(-0.28, 0, 0);
      euler.current.set(-0.28, 0, 0, "YXZ");
    }
  }, [camera, isInspecting]);

  // Pointer lock listeners
  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === dom;
    };

    const handleMouseDown = () => {
      if (!isInspecting && !isLocked.current) {
        dom.requestPointerLock();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current || isInspecting) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * 0.0022;
      euler.current.x -= movementY * 0.0022;

      // Clamp vertical pitch to prevent neck snapping
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = true;
          break;
        case "KeyE":
          onInteract();
          break;
        case "KeyZ":
          // Quick toggle between macro inspection zoom (30°) and normal overview (52°)
          targetFov.current = targetFov.current <= 36 ? 52 : 30;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = false;
          break;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Mouse-wheel smooth FOV zoom
      targetFov.current = Math.max(26, Math.min(65, targetFov.current + e.deltaY * 0.04));
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    dom.addEventListener("mousedown", handleMouseDown);
    dom.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      dom.removeEventListener("mousedown", handleMouseDown);
      dom.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, camera, isInspecting, onInteract]);

  // Frame update: Movement, Collision, & Raycasting
  useFrame((_, delta) => {
    if (isInspecting) return;

    // Movement speeds
    const speed = keys.current.sprint ? 5.2 : 2.5;
    const moveDir = new THREE.Vector3();

    if (keys.current.forward) moveDir.z -= 1;
    if (keys.current.backward) moveDir.z += 1;
    if (keys.current.left) moveDir.x -= 1;
    if (keys.current.right) moveDir.x += 1;
    moveDir.normalize();

    // Transform by horizontal camera yaw only
    const cameraYaw = euler.current.y;
    const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw)).negate();
    const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));

    const targetVelocity = new THREE.Vector3()
      .addScaledVector(forward, -moveDir.z * speed)
      .addScaledVector(right, moveDir.x * speed);

    // Smooth inertia acceleration & damping
    velocity.current.lerp(targetVelocity, 12 * delta);

    // Next proposed position
    const nextX = camera.position.x + velocity.current.x * delta;
    const nextZ = camera.position.z + velocity.current.z * delta;

    // Footstep audio triggers
    const currentSpeed = velocity.current.length();
    if (currentSpeed > 0.4) {
      footstepAccumulator.current += delta * (keys.current.sprint ? 3.4 : 2.0);
      if (footstepAccumulator.current > 1.0) {
        chemistryAudio.playFootstep();
        footstepAccumulator.current = 0;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // COLLISION RESOLUTION (Ergonomic close approach to bench)
    // ─────────────────────────────────────────────────────────────
    let resolvedX = nextX;
    let resolvedZ = nextZ;

    // 1. Outer room boundary walls
    resolvedX = Math.max(-5.4, Math.min(5.4, resolvedX));
    resolvedZ = Math.max(-6.2, Math.min(6.2, resolvedZ));

    // 2. Central Island Bench (X: [-2.35, 2.35], Z: [-0.92, 0.92])
    const inBenchX = resolvedX >= -2.35 && resolvedX <= 2.35;
    const inBenchZ = resolvedZ >= -0.92 && resolvedZ <= 0.92;
    if (inBenchX && inBenchZ) {
      // Push out along shortest penetration axis
      const distLeft = Math.abs(resolvedX - (-2.35));
      const distRight = Math.abs(resolvedX - 2.35);
      const distFront = Math.abs(resolvedZ - 0.92);
      const distBack = Math.abs(resolvedZ - (-0.92));
      const minDist = Math.min(distLeft, distRight, distFront, distBack);

      if (minDist === distFront) resolvedZ = 0.93;
      else if (minDist === distBack) resolvedZ = -0.93;
      else if (minDist === distLeft) resolvedX = -2.36;
      else if (minDist === distRight) resolvedX = 2.36;
    }

    // 3. Left Wall Counter (X < -4.6, Z in [-3.5, 3.5])
    if (resolvedX < -4.6 && resolvedZ >= -3.5 && resolvedZ <= 3.5) {
      resolvedX = -4.59;
    }

    // 4. Right Wall Fume Hood (X > 4.3, Z in [-1.5, 1.5])
    if (resolvedX > 4.3 && resolvedZ >= -1.5 && resolvedZ <= 1.5) {
      resolvedX = 4.29;
    }

    camera.position.x = resolvedX;
    camera.position.z = resolvedZ;
    camera.position.y = 1.48; // Ergonomic standing eye height looking down at bench

    // Smooth FOV Zoom Interpolation
    const persCam = camera as THREE.PerspectiveCamera;
    if (persCam.fov && Math.abs(persCam.fov - targetFov.current) > 0.05) {
      persCam.fov = THREE.MathUtils.lerp(persCam.fov, targetFov.current, 10 * delta);
      persCam.updateProjectionMatrix();
    }

    // ─────────────────────────────────────────────────────────────
    // INTERACTION RAYCASTING
    // ─────────────────────────────────────────────────────────────
    const playerPos = camera.position;
    const distToTitration = playerPos.distanceTo(new THREE.Vector3(0, 0.94, 0));
    const distToReagents = playerPos.distanceTo(new THREE.Vector3(-0.28, 0.94, 0.08));
    const distToHotplate = playerPos.distanceTo(new THREE.Vector3(-0.95, 0.94, -0.15));
    const distToCentrifuge = playerPos.distanceTo(new THREE.Vector3(1.45, 0.94, -0.15));
    const distToBalance = playerPos.distanceTo(new THREE.Vector3(0.9, 0.94, -0.15));
    const distToRobot = playerPos.distanceTo(new THREE.Vector3(0, 0.6, 1.4));
    const distToWallSwitches = playerPos.distanceTo(new THREE.Vector3(-4.8, 1.4, -6.95));

    // Check line of sight
    const forwardRay = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    if (distToTitration < 2.5 && forwardRay.z < 0 && Math.abs(forwardRay.x) < 0.4) {
      onHoverObject("TITRATION BENCH [ E: Inspect / Turn Stopcock ]");
    } else if (distToHotplate < 2.5 && forwardRay.x < -0.15) {
      onHoverObject("HOTPLATE STIRRER [ Click to Heat / Stir Beaker ]");
    } else if (distToCentrifuge < 2.5 && forwardRay.x > 0.15) {
      onHoverObject("BENCHTOP CENTRIFUGE [ Click Lid to Open / Spin ]");
    } else if (distToReagents < 2.2 && forwardRay.x < 0) {
      onHoverObject("PHENOLPHTHALEIN DROPPER [ Click to Add 3 Drops ]");
    } else if (distToBalance < 2.2 && forwardRay.x > 0) {
      onHoverObject("ANALYTICAL BALANCE [ Tare Zero ]");
    } else if (distToRobot < 2.6 && forwardRay.z > 0.1) {
      onHoverObject("AURA AUTONOMOUS ROBOT [ Click or Press R for Protocols ]");
    } else if (distToWallSwitches < 2.5 && forwardRay.z < -0.4) {
      onHoverObject("WALL SWITCHES [ Click to Toggle Lights ]");
    } else {
      onHoverObject(null);
    }
  });

  return null;
}
