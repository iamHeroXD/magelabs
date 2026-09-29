"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

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
  const { geometry, startPlugPos, endPlugPos, startNormal, endNormal } = useMemo(() => {
    const p0 = new THREE.Vector3(...startPos);
    const p3 = new THREE.Vector3(...endPos);

    const distance = p0.distanceTo(p3);
    const sag = Math.min(0.35, distance * 0.12); // subtle sag based on wire span

    // Midpoints with vertical sag towards table
    const p1 = new THREE.Vector3()
      .lerpVectors(p0, p3, 0.3)
      .add(new THREE.Vector3(0, -sag, (Math.random() - 0.5) * 0.05));
    const p2 = new THREE.Vector3()
      .lerpVectors(p0, p3, 0.7)
      .add(new THREE.Vector3(0, -sag, (Math.random() - 0.5) * 0.05));

    // Keep sag above bench level
    p1.y = Math.max(0.08, p1.y);
    p2.y = Math.max(0.08, p2.y);

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
    const geo = new THREE.TubeGeometry(curve, 36, 0.016, 12, false);

    const startDir = new THREE.Vector3().subVectors(p1, p0).normalize();
    const endDir = new THREE.Vector3().subVectors(p3, p2).normalize();

    return {
      geometry: geo,
      startPlugPos: p0,
      endPlugPos: p3,
      startNormal: startDir,
      endNormal: endDir,
    };
  }, [startPos, endPos]);

  return (
    <group>
      {/* Dynamic wire tube */}
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
        onClick={(e) => {
          e.stopPropagation();
          onDisconnect?.(id);
        }}
      >
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.1}
          color={hovered ? "#38bdf8" : color}
          emissive={hovered ? "#0284c7" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* Start terminal banana plug sleeve */}
      <mesh position={startPlugPos}>
        <cylinderGeometry args={[0.038, 0.038, 0.09, 16]} />
        <meshStandardMaterial
          roughness={0.5}
          metalness={0.1}
          color={hovered ? "#38bdf8" : color}
        />
      </mesh>

      {/* End terminal banana plug sleeve */}
      <mesh position={endPlugPos}>
        <cylinderGeometry args={[0.038, 0.038, 0.09, 16]} />
        <meshStandardMaterial
          roughness={0.5}
          metalness={0.1}
          color={hovered ? "#38bdf8" : color}
        />
      </mesh>

      {/* Click-to-disconnect tooltip */}
      {hovered && (
        <Html
          position={[
            (startPos[0] + endPos[0]) / 2,
            Math.max(startPos[1], endPos[1]) + 0.15,
            (startPos[2] + endPos[2]) / 2,
          ]}
          center
          distanceFactor={6}
        >
          <button
            onClick={() => onDisconnect?.(id)}
            className="rounded bg-red-950/95 px-2 py-0.5 text-[10px] font-mono font-semibold text-red-200 border border-red-700/80 shadow-lg hover:bg-red-900 cursor-pointer whitespace-nowrap"
          >
            Click to Disconnect
          </button>
        </Html>
      )}
    </group>
  );
}
