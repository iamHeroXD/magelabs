"use client";

import React, { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type CameraMode = "walk" | "orbit";
export type CameraStation = "circuits" | "pendulum" | "optics" | "oscilloscope" | "whiteboard" | "overview";

interface LabCameraProps {
  mode?: CameraMode;
  station?: CameraStation;
  onStationChange?: (station: CameraStation) => void;
  onModeChange?: (mode: CameraMode) => void;
}

export const STATION_POSITIONS: Record<
  CameraStation,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  circuits: {
    position: [0, 2.4, 2.6],
    target: [0, 0.2, -0.2],
  },
  pendulum: {
    position: [-4.2, 1.8, 1.6],
    target: [-5.2, 1.3, -0.6],
  },
  optics: {
    position: [4.2, 1.8, 1.6],
    target: [5.2, 1.3, -0.6],
  },
  oscilloscope: {
    position: [-3.2, 1.8, -2.4],
    target: [-4.5, 1.2, -3.8],
  },
  whiteboard: {
    position: [0, 2.0, -1.8],
    target: [0, 2.1, -4.4],
  },
  overview: {
    position: [0, 5.5, 6.2],
    target: [0, 0.4, 0],
  },
};

export function LabCamera({
  mode = "orbit",
  station = "circuits",
  onStationChange,
  onModeChange,
}: LabCameraProps) {
  const { camera, gl } = useThree();
  const orbitRef = useRef<any>(null);

  // First-person walkthrough state
  const isWalking = mode === "walk";
  const keysDown = useRef<Record<string, boolean>>({});
  const walkVelocity = useRef(new THREE.Vector3());
  const walkYaw = useRef(0);
  const walkPitch = useRef(0);
  const isMouseDown = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const bobbingPhase = useRef(0);

  // Target coordinates for smooth orbit lerp
  const targetCamPos = useRef(new THREE.Vector3(...STATION_POSITIONS[station].position));
  const targetLookAt = useRef(new THREE.Vector3(...STATION_POSITIONS[station].target));

  // Update target coordinates when station changes in orbit mode
  useEffect(() => {
    if (mode === "orbit") {
      const cfg = STATION_POSITIONS[station] || STATION_POSITIONS.circuits;
      targetCamPos.current.set(...cfg.position);
      targetLookAt.current.set(...cfg.target);
    }
  }, [station, mode]);

  // Keyboard event listeners for WASD / Arrow walk controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.code] = true;

      // Quick toggle camera modes with 'C' key
      if (e.code === "KeyC") {
        onModeChange?.(mode === "walk" ? "orbit" : "walk");
      }
      // Quick preset keys
      if (e.code === "Digit1") onStationChange?.("circuits");
      if (e.code === "Digit2") onStationChange?.("pendulum");
      if (e.code === "Digit3") onStationChange?.("optics");
      if (e.code === "Digit4") onStationChange?.("whiteboard");
      if (e.code === "Digit5") onStationChange?.("overview");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [mode, onModeChange, onStationChange]);

  // Mouse drag look listeners for first-person walk mode
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      if (mode === "walk" && e.button === 0) {
        isMouseDown.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mode === "walk" && isMouseDown.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        const lookSpeed = 0.0035;
        walkYaw.current -= dx * lookSpeed;
        walkPitch.current = Math.max(
          -Math.PI / 2.3,
          Math.min(Math.PI / 2.3, walkPitch.current - dy * lookSpeed)
        );
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mode, gl]);

  // Frame update
  useFrame((state, delta) => {
    if (mode === "walk") {
      // -----------------------------------------------------------------
      // First-Person Walkthrough Physics
      // -----------------------------------------------------------------
      const isShift = keysDown.current["ShiftLeft"] || keysDown.current["ShiftRight"];
      const moveSpeed = (isShift ? 5.5 : 3.0) * delta;

      const forward = new THREE.Vector3(
        -Math.sin(walkYaw.current),
        0,
        -Math.cos(walkYaw.current)
      ).normalize();
      const right = new THREE.Vector3(
        Math.cos(walkYaw.current),
        0,
        -Math.sin(walkYaw.current)
      ).normalize();

      const moveDirection = new THREE.Vector3();
      if (keysDown.current["KeyW"] || keysDown.current["ArrowUp"]) moveDirection.add(forward);
      if (keysDown.current["KeyS"] || keysDown.current["ArrowDown"]) moveDirection.sub(forward);
      if (keysDown.current["KeyD"] || keysDown.current["ArrowRight"]) moveDirection.add(right);
      if (keysDown.current["KeyA"] || keysDown.current["ArrowLeft"]) moveDirection.sub(right);

      if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize().multiplyScalar(moveSpeed);
        bobbingPhase.current += delta * (isShift ? 14 : 9);
      } else {
        bobbingPhase.current = THREE.MathUtils.damp(bobbingPhase.current, 0, 4, delta);
      }

      // Smooth velocity interpolation
      walkVelocity.current.lerp(moveDirection, Math.min(1.0, delta * 12));
      camera.position.add(walkVelocity.current);

      // Student standing eye height (1.65m) with subtle head bobbing
      const targetHeight = 1.65 + Math.sin(bobbingPhase.current) * 0.035;
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetHeight, 10, delta);

      // Collision clamping within laboratory room boundaries
      camera.position.x = Math.max(-8.4, Math.min(8.4, camera.position.x));
      camera.position.z = Math.max(-3.8, Math.min(5.2, camera.position.z));

      // Avoid clipping into the central electronics bench
      if (
        Math.abs(camera.position.x) < 3.7 &&
        Math.abs(camera.position.z) < 2.2
      ) {
        const pushDistX = 3.8 - Math.abs(camera.position.x);
        const pushDistZ = 2.3 - Math.abs(camera.position.z);
        if (pushDistX < pushDistZ) {
          camera.position.x = Math.sign(camera.position.x) * 3.8;
        } else {
          camera.position.z = Math.sign(camera.position.z) * 2.3;
        }
      }

      // Compute look-at point from yaw & pitch
      const lookDir = new THREE.Vector3(
        Math.sin(walkYaw.current) * Math.cos(walkPitch.current),
        Math.sin(walkPitch.current),
        -Math.cos(walkYaw.current) * Math.cos(walkPitch.current)
      );
      const lookAtPoint = camera.position.clone().add(lookDir);
      camera.lookAt(lookAtPoint);
    } else {
      // -----------------------------------------------------------------
      // Orbit / Bench Inspection Mode
      // -----------------------------------------------------------------
      if (!orbitRef.current) return;
      const lerpFactor = Math.min(1.0, delta * 4.0);

      state.camera.position.lerp(targetCamPos.current, lerpFactor);
      orbitRef.current.target.lerp(targetLookAt.current, lerpFactor);
      orbitRef.current.update();
    }
  });

  if (mode === "walk") {
    return null; // Free-walk handles camera transform directly
  }

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      minDistance={1.4}
      maxDistance={9.5}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera clipping below table
      minPolarAngle={0.06}
      dampingFactor={0.08}
      enableDamping
    />
  );
}
