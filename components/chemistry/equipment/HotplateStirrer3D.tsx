"use client";

import { useState } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

interface HotplateProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function HotplateStirrer3D({
  position = [-0.82, 0.005, -0.08],
  rotation = [0, 0.25, 0],
}: HotplateProps) {
  const [isOn, setIsOn] = useState(false);
  const [targetTemp, setTargetTemp] = useState(25);
  const [stirRpm, setStirRpm] = useState(0);

  const togglePower = () => {
    chemistryAudio.playStopcockClick();
    if (isOn) {
      setIsOn(false);
      setStirRpm(0);
      setTargetTemp(25);
    } else {
      setIsOn(true);
      setStirRpm(450);
      setTargetTemp(85);
    }
  };

  const cycleTemp = () => {
    if (!isOn) return;
    chemistryAudio.playBeep();
    setTargetTemp((prev) => (prev >= 250 ? 25 : prev + 50));
  };

  const cycleRpm = () => {
    if (!isOn) return;
    chemistryAudio.playBeep();
    setStirRpm((prev) => (prev >= 1200 ? 0 : prev + 300));
  };

  const isHeating = isOn && targetTemp > 40;
  const plateGlowColor = isHeating ? (targetTemp > 150 ? "#ea580c" : "#f59e0b") : "#ffffff";

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Main Die-Cast Metal Instrument Housing */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.09, 0.32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Rubber anti-slip feet */}
      {[-0.1, 0.1].map((x, xi) =>
        [-0.12, 0.12].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 0.004, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* 2. Ceramic Heating Plate (Glows when heating) */}
      <mesh position={[0, 0.095, -0.04]} receiveShadow castShadow>
        <boxGeometry args={[0.22, 0.012, 0.2]} />
        <meshStandardMaterial
          color={plateGlowColor}
          emissive={isHeating ? "#c2410c" : "#000000"}
          emissiveIntensity={isHeating ? (targetTemp / 250) * 0.8 : 0}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Local thermal glow light */}
      {isHeating && (
        <pointLight
          position={[0, 0.18, -0.04]}
          color="#ea580c"
          intensity={1.4 * (targetTemp / 250)}
          distance={0.8}
        />
      )}

      {/* 3. Front Control Console Panel */}
      <group position={[0, 0.05, 0.11]} rotation={[-0.28, 0, 0]}>
        {/* Slanted Panel Bezel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.24, 0.004, 0.09]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Backlit Digital Telemetry Display */}
        <mesh position={[0, 0.003, -0.018]}>
          <planeGeometry args={[0.18, 0.038]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>

        {/* Display Text: Temp & RPM */}
        <Text
          position={[-0.042, 0.005, -0.018]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.013}
          color={isOn ? "#34d399" : "#065f46"}
          anchorX="center"
          anchorY="middle"
        >
          {isOn ? `${targetTemp}°C` : "OFF"}
        </Text>
        <Text
          position={[0.042, 0.005, -0.018]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.013}
          color={isOn ? "#38bdf8" : "#075985"}
          anchorX="center"
          anchorY="middle"
        >
          {isOn ? `${stirRpm} RPM` : "---"}
        </Text>

        {/* Interactive Power Switch */}
        <group
          position={[-0.08, 0.004, 0.024]}
          onClick={(e) => {
            e.stopPropagation();
            togglePower();
          }}
        >
          <mesh>
            <boxGeometry args={[0.028, 0.008, 0.018]} />
            <meshStandardMaterial color={isOn ? "#16a34a" : "#475569"} roughness={0.4} />
          </mesh>
        </group>

        {/* Interactive Heat Knob */}
        <group
          position={[0, 0.008, 0.024]}
          onClick={(e) => {
            e.stopPropagation();
            cycleTemp();
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.012, 24]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>

        {/* Interactive Stir Knob */}
        <group
          position={[0.08, 0.008, 0.024]}
          onClick={(e) => {
            e.stopPropagation();
            cycleRpm();
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.012, 24]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
