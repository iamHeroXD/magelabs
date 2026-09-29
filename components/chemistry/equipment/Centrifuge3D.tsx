"use client";

import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface CentrifugeProps {
  position?: [number, number, number];
}

export function Centrifuge3D({ position = [1.5, 0.005, -0.2] }: CentrifugeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speedRpm, setSpeedRpm] = useState(4000);

  const lidRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Group>(null);

  const toggleLid = () => {
    if (isRunning) return; // Safety lock while spinning
    chemistryAudio.playStopcockClick();
    setIsOpen((prev) => !prev);
  };

  const toggleRun = () => {
    if (isOpen) return; // Cannot run with open lid
    chemistryAudio.playBeep();
    setIsRunning((prev) => !prev);
  };

  const cycleSpeed = () => {
    chemistryAudio.playBeep();
    setSpeedRpm((prev) => (prev >= 8000 ? 2000 : prev + 2000));
  };

  useFrame((_, delta) => {
    // Animate lid opening / closing
    if (lidRef.current) {
      const targetAngle = isOpen ? -Math.PI / 2.5 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetAngle,
        8 * delta
      );
    }

    // Spin rotor when running
    if (rotorRef.current && isRunning) {
      rotorRef.current.rotation.y += delta * (speedRpm / 120);
    }
  });

  return (
    <group position={position}>
      {/* 1. Main Round Centrifuge Body */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.16, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Internal Rotor Cavity */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* 2. Spinning 6-Place Tube Rotor */}
      <group ref={rotorRef} position={[0, 0.11, 0]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.07, 0.04, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* 6 Angled Microcentrifuge Tube Buckets */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          const x = Math.cos(angle) * 0.06;
          const z = Math.sin(angle) * 0.06;
          return (
            <mesh
              key={i}
              position={[x, 0.015, z]}
              rotation={[Math.cos(angle) * 0.45, 0, Math.sin(angle) * 0.45]}
            >
              <cylinderGeometry args={[0.009, 0.007, 0.038, 16]} />
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* 3. Transparent Acrylic Dome Lid (Hinged at back) */}
      <group ref={lidRef} position={[0, 0.16, -0.15]}>
        <group
          position={[0, 0, 0.15]}
          onClick={(e) => {
            e.stopPropagation();
            toggleLid();
          }}
        >
          {/* Transparent Acrylic Dome */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.155, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              roughness={0.08}
              transmission={0.9}
              ior={1.49}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Chrome Rim Bezel */}
          <mesh position={[0, 0.002, 0]}>
            <torusGeometry args={[0.155, 0.008, 12, 32]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 4. Front Digital Speed & Start/Stop Controls */}
      <group position={[0, 0.045, 0.162]}>
        {/* LCD Speed Readout */}
        <mesh position={[0, 0.015, 0]}>
          <planeGeometry args={[0.12, 0.03]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
        <Text
          position={[0, 0.015, 0.002]}
          fontSize={0.014}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          {isRunning ? `${speedRpm} RPM` : "STANDBY"}
        </Text>

        {/* Start / Stop Pushbutton */}
        <group
          position={[-0.045, -0.015, 0.004]}
          onClick={(e) => {
            e.stopPropagation();
            toggleRun();
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
            <meshStandardMaterial
              color={isRunning ? "#ef4444" : "#22c55e"}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* Speed Selector Knob */}
        <group
          position={[0.045, -0.015, 0.004]}
          onClick={(e) => {
            e.stopPropagation();
            cycleSpeed();
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
