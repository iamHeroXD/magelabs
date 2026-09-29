"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function PhotorealisticVessel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth interactive tilt following pointer
    const targetRotY = t * 0.25 + state.pointer.x * 0.4;
    const targetRotX = 0.12 + -state.pointer.y * 0.25 + Math.sin(t * 0.6) * 0.04;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);

    // Dynamic depth reaction to scroll
    const targetZ = -0.2 + scrollProgress * 1.8;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);

    if (liquidRef.current) {
      liquidRef.current.rotation.y = -t * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* 1. Heavy Anodized Aluminum & Ceramic Optical Stage */}
      <mesh position={[0, -1.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.45, 0.1, 64]} />
        <meshStandardMaterial color="#18181b" roughness={0.25} metalness={0.9} />
      </mesh>
      
      {/* Brushed Steel Ring Trim */}
      <mesh position={[0, -0.965, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Frosted Ceramic Specimen Plate */}
      <mesh position={[0, -0.96, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.02, 64]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* 2. Glass Erlenmeyer Flask Assembly */}
      <group position={[0, 0.05, 0]}>
        {/* Main Borosilicate Glass Outer Shell */}
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.98, 1.45, 64, 1, true]} />
          <MeshTransmissionMaterial
            backside
            samples={12}
            resolution={512}
            transmission={0.96}
            roughness={0.04}
            thickness={0.35}
            ior={1.52}
            chromaticAberration={0.04}
            anisotropy={0.1}
            distortion={0.08}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#ffffff"
          />
        </mesh>

        {/* Flask Base Glass Plate with Beveled Rim */}
        <mesh position={[0, -0.72, 0]}>
          <cylinderGeometry args={[0.98, 0.98, 0.04, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            roughness={0.06}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Elegant Cylindrical Glass Neck */}
        <mesh position={[0, 0.98, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.55, 64, 1, true]} />
          <MeshTransmissionMaterial
            backside
            samples={12}
            resolution={512}
            transmission={0.96}
            roughness={0.04}
            thickness={0.25}
            ior={1.52}
            chromaticAberration={0.04}
            color="#ffffff"
          />
        </mesh>

        {/* Fire-Polished Heavy Glass Beaded Lip */}
        <mesh position={[0, 1.25, 0]}>
          <torusGeometry args={[0.33, 0.038, 20, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.03}
            transmission={0.94}
            ior={1.52}
          />
        </mesh>

        {/* Frosted White Volumetric Graduations (50 mL, 100 mL, 150 mL, 200 mL, 250 mL) */}
        {[-0.45, -0.22, 0.02, 0.25, 0.48].map((y, idx) => {
          const radius = 0.32 + (0.72 - y) * 0.45;
          return (
            <group key={idx} position={[0, y, 0]}>
              <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[radius, 0.007, 8, 64]} />
                <meshStandardMaterial
                  color="#ffffff"
                  roughness={0.9}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            </group>
          );
        })}

        {/* 3. Glowing Translucent Chemical Solution with Meniscus */}
        <group ref={liquidRef} position={[0, -0.32, 0]}>
          {/* Liquid Body (Conical volume) */}
          <mesh>
            <cylinderGeometry args={[0.68, 0.94, 0.78, 64]} />
            <meshPhysicalMaterial
              color="#e11d48"
              emissive="#881337"
              emissiveIntensity={0.25}
              transparent
              opacity={0.88}
              roughness={0.08}
              transmission={0.65}
              ior={1.34}
            />
          </mesh>

          {/* Meniscus Concave Fluid Top Surface */}
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.68, 0.68, 0.02, 64]} />
            <meshPhysicalMaterial
              color="#fb7185"
              transparent
              opacity={0.95}
              roughness={0.05}
              transmission={0.8}
            />
          </mesh>

          {/* Magnetic Stir Bar in Fluid */}
          <mesh position={[0, -0.36, 0]} rotation={[0, Math.PI / 4, 0]}>
            <capsuleGeometry args={[0.03, 0.18, 12, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function LandingHero3D({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none overflow-hidden">
      {/* Container shifts camera perspective so the vessel lives in the right half of the hero */}
      <Canvas
        camera={{ position: [0.9, 0.25, 3.4], fov: 44 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        {/* Photorealistic Studio HDR Environment Lighting */}
        <Environment preset="city" />

        {/* Key & Rim Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 4]} intensity={2.5} castShadow />
        <directionalLight position={[-5, 3, -3]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[1, 1.5, 1]} intensity={2.0} color="#fb7185" />
        
        {/* Soft Ambient Occlusion Ground Contact Shadows */}
        <ContactShadows
          position={[0, -1.03, 0]}
          opacity={0.7}
          scale={5}
          blur={1.8}
          far={3}
          color="#000000"
        />

        {/* Gentle Floating Physics */}
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <PhotorealisticVessel scrollProgress={scrollProgress} />
        </Float>
      </Canvas>
    </div>
  );
}
