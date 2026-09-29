"use client";

import { useRef } from "react";
import * as THREE from "three";
import { WallLightSwitches3D } from "./equipment/WallLightSwitches3D";

interface RoomProps {
  ceilingLightsOn?: boolean;
  taskLightOn?: boolean;
  onToggleCeiling?: () => void;
  onToggleTask?: () => void;
}

export function ChemistryRoom3D({
  ceilingLightsOn = true,
  taskLightOn = true,
  onToggleCeiling = () => {},
  onToggleTask = () => {},
}: RoomProps) {
  const roomRef = useRef<THREE.Group>(null);

  return (
    <group ref={roomRef}>
      {/* ─────────────────────────────────────────────────────────────
          1. ROOM ENVELOPE: FLOOR, WALLS, CEILING (1 unit = 1 meter)
         ───────────────────────────────────────────────────────────── */}
      {/* Floor: Semi-matte Light Gray Epoxy Laboratory Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[13.5, 15.5]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>

      {/* Ceiling: Clean White Suspended Acoustic Grid */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.8, 0]}>
        <planeGeometry args={[13.5, 15.5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>

      {/* Six Recessed 600x600 LED Troffers (Toggled by wall switch) */}
      {[-3, 0, 3].map((x, xi) =>
        [-3.5, 3.5].map((z, zi) => (
          <group key={`${xi}-${zi}`} position={[x, 3.79, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.7, 1.3]} />
              <meshBasicMaterial color={ceilingLightsOn ? "#ffffff" : "#475569"} />
            </mesh>
            {ceilingLightsOn && (
              <pointLight position={[0, -0.2, 0]} intensity={1.7} distance={8.5} color="#fffbeb" />
            )}
          </group>
        ))
      )}

      {/* Back Wall (Z = -6.8 m): Campus Windows & Safety Station */}
      <mesh position={[0, 1.9, -7.0]}>
        <planeGeometry args={[13.5, 3.8]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.85} />
      </mesh>

      {/* Front Wall (Z = +7.0 m) */}
      <mesh position={[0, 1.9, 7.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[13.5, 3.8]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.85} />
      </mesh>

      {/* Left Wall (X = -6.0 m): Reagents & Wet Sink Station */}
      <mesh position={[-6.0, 1.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[15.5, 3.8]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.85} />
      </mesh>

      {/* Right Wall (X = +6.0 m): Fume Hood & Analytical Instruments */}
      <mesh position={[6.0, 1.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[15.5, 3.8]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.85} />
      </mesh>

      {/* Perimeter Stainless Steel Baseboard / Kicking Rail */}
      <mesh position={[0, 0.08, -6.98]}>
        <boxGeometry args={[13.4, 0.16, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
      </mesh>
      <mesh position={[-5.98, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15.4, 0.16, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
      </mesh>
      <mesh position={[5.98, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[15.4, 0.16, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. CENTRAL ISLAND LABORATORY BENCH (4.4m x 1.8m x 0.92m)
         ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Solid Black Chemical-Resistant Resin Worktop */}
        <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.045, 1.8]} />
          <meshStandardMaterial color="#111317" roughness={0.32} metalness={0.12} />
        </mesh>

        {/* White Powder-Coated Under-Bench Cabinetry Base */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.25, 0.88, 1.65]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.08} />
        </mesh>

        {/* Brushed Stainless Drawer Pull Handles */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((x, idx) => (
          <group key={idx}>
            <mesh position={[x, 0.72, 0.835]}>
              <boxGeometry args={[0.18, 0.015, 0.025]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[x, 0.42, 0.835]}>
              <boxGeometry args={[0.18, 0.015, 0.025]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[x, 0.72, -0.835]}>
              <boxGeometry args={[0.18, 0.015, 0.025]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Double-Sided Central Service Pedestal Raceway (Gas / Vacuum / AC) */}
        <group position={[0, 0.94 + 0.16, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.8, 0.28, 0.18]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
          {[-1.2, -0.4, 0.4, 1.2].map((sx, sxi) => (
            <group key={sxi} position={[sx, 0, 0.095]}>
              <mesh>
                <boxGeometry args={[0.07, 0.07, 0.01]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
              <mesh position={[0.08, 0.05, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.05, 12]} />
                <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. LEFT WALL: WET CHEMISTRY & REAGENT BENCH (X = -5.3 m)
         ───────────────────────────────────────────────────────────── */}
      <group position={[-5.3, 0, 0]}>
        <mesh position={[0, 0.91, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.04, 6.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.43, 0]}>
          <boxGeometry args={[1.1, 0.86, 6.4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>

        {/* Deep Stainless Steel Sink Basin */}
        <group position={[0, 0.89, -1.8]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.65, 0.32, 0.55]} />
            <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.22, 0.22, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
          </mesh>
          <mesh position={[0.14, 0.36, 0]} rotation={[0, 0, -0.8]}>
            <cylinderGeometry args={[0.01, 0.01, 0.18, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>

        {/* Wall Reagent Shelving (2 Tiers with Chemical Bottles) */}
        <group position={[-0.45, 1.8, 1.2]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.26, 0.02, 3.2]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[0.26, 0.02, 3.2]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
          </mesh>

          {/* Assorted Amber & Clear Reagent Bottles */}
          {[-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2].map((bz, bi) => (
            <group key={bi} position={[0, 0.07, bz]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.032, 0.032, 0.12, 16]} />
                <meshPhysicalMaterial
                  color={bi % 2 === 0 ? "#78350f" : "#ffffff"}
                  transparent
                  opacity={0.8}
                  roughness={0.15}
                  transmission={0.4}
                />
              </mesh>
              <mesh position={[0, 0.07, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.02, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. RIGHT WALL: ANALYTICAL FUME HOOD (X = +5.1 m, Z = 0)
         ───────────────────────────────────────────────────────────── */}
      <group position={[5.1, 0, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[1.4, 2.6, 2.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[-0.15, 1.45, 0]}>
          <boxGeometry args={[1.05, 1.25, 2.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Sliding Tempered Glass Sash */}
        <mesh position={[-0.62, 1.72, 0]}>
          <boxGeometry args={[0.02, 0.68, 2.1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.28}
            roughness={0.06}
            transmission={0.94}
            ior={1.52}
          />
        </mesh>

        <pointLight position={[-0.1, 1.95, 0]} intensity={2.4} color="#fef08a" distance={4} />

        <mesh position={[0, 3.3, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.8, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.88} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. BACK WALL: WINDOWS, DUAL LIGHT SWITCHES & SAFETY STATION
         ───────────────────────────────────────────────────────────── */}
      {/* Tall Divided Campus Windows */}
      <group position={[0, 2.1, -6.96]}>
        <mesh>
          <boxGeometry args={[5.2, 2.3, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[5.0, 2.1]} />
          <meshBasicMaterial color="#dbeafe" />
        </mesh>
        <directionalLight
          position={[0, 4.5, -4]}
          intensity={1.8}
          color="#fef3c7"
          castShadow
          target-position={[0, 0.9, 0]}
        />
      </group>

      {/* Interactive Dual Wall Light Switches near Door */}
      <WallLightSwitches3D
        ceilingLightsOn={ceilingLightsOn}
        taskLightOn={taskLightOn}
        onToggleCeiling={onToggleCeiling}
        onToggleTask={onToggleTask}
      />

      {/* Emergency Eye Wash & Drench Shower Safety Station */}
      <group position={[4.2, 0, -6.7]}>
        <mesh position={[0, 2.5, 0.4]}>
          <cylinderGeometry args={[0.12, 0.16, 0.06, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.12, 1.9, 0.4]}>
          <cylinderGeometry args={[0.005, 0.005, 1.1, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[0.12, 1.35, 0.4]}>
          <torusGeometry args={[0.04, 0.008, 12, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.05, 0.35]}>
          <cylinderGeometry args={[0.16, 0.14, 0.12, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.002, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* Framed Scientific Periodic Table */}
      <group position={[-3.8, 2.1, -6.95]}>
        <mesh>
          <boxGeometry args={[2.8, 1.6, 0.03]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[2.7, 1.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      </group>

      {/* Laboratory Exit Door */}
      <group position={[-5.4, 1.1, -6.95]}>
        <mesh>
          <boxGeometry args={[0.95, 2.2, 0.05]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0.35, 0, 0.04]}>
          <boxGeometry args={[0.12, 0.02, 0.03]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
