"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { labAudio } from "@/lib/audio/sound-effects";

interface Wire3DProps {
  id: string;
  startPos: [number, number, number];
  endPos: [number, number, number];
  color?: string;
  onDisconnect?: (wireId: string) => void;
}

export function Wire3D({
  id,
  startPos,
  endPos,
  color = "#ef4444",
  onDisconnect,
}: Wire3DProps) {
  const [hovered, setHovered] = useState(false);

  // Generate a realistic 3D Catmull-Rom spline with gravity drape
  const { geometry, p0, p3 } = useMemo(() => {
    const pt0 = new THREE.Vector3(...startPos);
    const pt3 = new THREE.Vector3(...endPos);

    const distance = pt0.distanceTo(pt3);
    const sag = Math.min(0.4, Math.max(0.08, distance * 0.15));

    // Calculate midpoint sag with gravity drop
    const pt1 = new THREE.Vector3().lerpVectors(pt0, pt3, 0.3);
    pt1.y -= sag;
    // Keep cable above the workbench top (y >= 0.04)
    pt1.y = Math.max(0.06, pt1.y);

    const pt2 = new THREE.Vector3().lerpVectors(pt0, pt3, 0.7);
    pt2.y -= sag;
    pt2.y = Math.max(0.06, pt2.y);

    const curve = new THREE.CatmullRomCurve3([pt0, pt1, pt2, pt3]);
    const geo = new THREE.TubeGeometry(curve, 48, 0.016, 12, false);

    return {
      geometry: geo,
      p0: pt0,
      p3: pt3,
    };
  }, [startPos, endPos]);

  const handleDisconnect = (e: any) => {
    e.stopPropagation();
    labAudio.playPlugUnplug();
    onDisconnect?.(id);
  };

  return (
    <group>
      {/* Dynamic flexible patch cable tube */}
      <mesh
        geometry={geometry}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={handleDisconnect}
      >
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.1}
          color={hovered ? "#38bdf8" : color}
          emissive={hovered ? "#0284c7" : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
        />
      </mesh>

      {/* 4mm Banana Plug 1 (Start) */}
      <group position={p0}>
        {/* Molded rubber strain relief boot */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.034, 0.038, 0.09, 16]} />
          <meshStandardMaterial
            roughness={0.5}
            metalness={0.1}
            color={hovered ? "#38bdf8" : color}
          />
        </mesh>
        {/* Gold-plated 4-leaf split spring pin */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
      </group>

      {/* 4mm Banana Plug 2 (End) */}
      <group position={p3}>
        {/* Molded rubber strain relief boot */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.034, 0.038, 0.09, 16]} />
          <meshStandardMaterial
            roughness={0.5}
            metalness={0.1}
            color={hovered ? "#38bdf8" : color}
          />
        </mesh>
        {/* Gold-plated 4-leaf split spring pin */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#eab308" />
        </mesh>
      </group>
    </group>
  );
}
