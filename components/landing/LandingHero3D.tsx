"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GlasswareHero({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating and mouse-reactive tilt
    groupRef.current.rotation.y = t * 0.35 + (state.pointer.x * 0.25);
    groupRef.current.rotation.x = 0.1 + (state.pointer.y * 0.15) + Math.sin(t * 0.5) * 0.05;
    
    // Position reacts to scroll progress (enters from depth, scales and rotates)
    const targetZ = -2 + scrollProgress * 3;
    const targetY = -0.2 + Math.sin(t * 0.8) * 0.08;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);

    if (liquidRef.current) {
      liquidRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, -1]}>
      {/* Porcelain / Stainless Base Stage */}
      <mesh position={[0, -1.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.12, 48]} />
        <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Ceramic Contrast Plate */}
      <mesh position={[0, -0.98, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.03, 48]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Outer Erlenmeyer Flask Glass Body */}
      <group position={[0, 0, 0]}>
        {/* Conical base to neck */}
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.35, 1.0, 1.4, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.38}
            roughness={0.06}
            metalness={0.05}
            transmission={0.92}
            ior={1.52}
            thickness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Flat Glass Bottom */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.04, 48]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.45}
            roughness={0.05}
            metalness={0.05}
            transmission={0.9}
            ior={1.52}
          />
        </mesh>

        {/* Cylindrical Neck */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.65, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.38}
            roughness={0.05}
            metalness={0.05}
            transmission={0.92}
            ior={1.52}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Flanged Lip */}
        <mesh position={[0, 1.13, 0]}>
          <torusGeometry args={[0.36, 0.035, 16, 48]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            roughness={0.05}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Etched Volumetric Graduations (Thin white rings) */}
        {[-0.6, -0.3, 0.0, 0.3].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.35 + (0.3 - y) * 0.45, 0.006, 8, 48]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        ))}

        {/* Virtual Liquid with Meniscus */}
        <group position={[0, -0.5, 0]} ref={liquidRef}>
          <mesh>
            <cylinderGeometry args={[0.72, 0.95, 0.75, 48]} />
            <meshPhysicalMaterial
              color="#f43f5e"
              transparent
              opacity={0.78}
              roughness={0.12}
              transmission={0.7}
              ior={1.34}
            />
          </mesh>

          {/* Meniscus surface */}
          <mesh position={[0, 0.375, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 0.02, 48]} />
            <meshPhysicalMaterial
              color="#fb7185"
              transparent
              opacity={0.9}
              roughness={0.08}
              transmission={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function LandingHero3D({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow />
        <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#93c5fd" />
        <pointLight position={[0, 2, 0]} intensity={1.5} color="#ffffff" />
        
        <GlasswareHero scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
