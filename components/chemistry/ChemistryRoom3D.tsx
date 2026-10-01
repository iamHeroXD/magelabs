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

        {/* Anti-Static ESD Blue Silicone Workstation Mat (Full Equipment Coverage) */}
        <mesh position={[0, 0.945, 0.08]} receiveShadow>
          <boxGeometry args={[3.2, 0.004, 0.98]} />
          <meshStandardMaterial
            color="#1e40af"
            roughness={0.6}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[0, 0.948, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.16, 0.94]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
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

        {/* Overhead Dual-Tier Central Reagent & Glassware Shelving Rack */}
        <group position={[0, 0, 0]}>
          {/* 4 Upright Heavy Steel Stanchions */}
          {[-1.7, 1.7].map((sx, sxi) =>
            [-0.1, 0.1].map((sz, szi) => (
              <mesh key={`post-${sxi}-${szi}`} position={[sx, 1.7, sz]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 1.5, 16]} />
                <meshStandardMaterial color="#64748b" roughness={0.25} metalness={0.8} />
              </mesh>
            ))
          )}

          {/* Lower Tier Shelf (Y = 1.48m) */}
          <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.5, 0.024, 0.28]} />
            <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position={[0, 1.51, 0.135]}>
            <boxGeometry args={[3.48, 0.035, 0.008]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.51, -0.135]}>
            <boxGeometry args={[3.48, 0.035, 0.008]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Upper Tier Shelf (Y = 1.82m) */}
          <mesh position={[0, 1.82, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.5, 0.024, 0.28]} />
            <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position={[0, 1.85, 0.135]}>
            <boxGeometry args={[3.48, 0.035, 0.008]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.85, -0.135]}>
            <boxGeometry args={[3.48, 0.035, 0.008]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Reagents & Glassware on Lower Shelf */}
          {[-1.3, -0.9, -0.5, 0.5, 0.9, 1.3].map((bx, bi) => (
            <group key={`low-bot-${bi}`} position={[bx, 1.56, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.036, 0.036, 0.13, 16]} />
                <meshPhysicalMaterial
                  color="#78350f"
                  roughness={0.15}
                  transmission={0.5}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              <mesh position={[0, 0.075, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.022, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0, 0.037]}>
                <planeGeometry args={[0.045, 0.06]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.8} />
              </mesh>
            </group>
          ))}

          {/* Squeeze Wash Bottle & Kimwipes Box */}
          <group position={[-0.15, 1.57, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.034, 0.034, 0.15, 16]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.2} transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, 0.085, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[0.015, 0.12, 0]} rotation={[0, 0, -0.6]}>
              <cylinderGeometry args={[0.003, 0.003, 0.08, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
          </group>
          <group position={[0.18, 1.54, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.13, 0.08, 0.11]} />
              <meshStandardMaterial color="#15803d" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.12, 0.1]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
          </group>

          {/* Volumetric Flasks on Upper Shelf */}
          {[-1.2, -0.6, 0, 0.6, 1.2].map((ux, ui) => (
            <group key={`up-bot-${ui}`} position={[ux, 1.9, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.042, 16, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.08} transparent opacity={0.35} />
              </mesh>
              <mesh position={[0, 0.055, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.09, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.08} transparent opacity={0.35} />
              </mesh>
              <mesh position={[0, 0.108, 0]}>
                <cylinderGeometry args={[0.014, 0.011, 0.02, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.3} />
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

        {/* Glassware Drying Pegboard Rack mounted above sink basin */}
        <group position={[-0.67, 1.82, -1.8]} rotation={[0, Math.PI / 2, 0]}>
          {/* Black Epoxy Pegboard Panel */}
          <mesh castShadow>
            <boxGeometry args={[0.85, 1.05, 0.025]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Stainless Steel Drip Trough at Bottom */}
          <mesh position={[0, -0.54, 0.04]}>
            <boxGeometry args={[0.88, 0.06, 0.09]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.88} />
          </mesh>

          {/* Array of Slanted Drying Pegs */}
          {[-0.32, -0.16, 0, 0.16, 0.32].map((px, pxi) =>
            [-0.35, -0.15, 0.05, 0.25].map((py, pyi) => (
              <group key={`peg-${pxi}-${pyi}`} position={[px, py, 0.015]} rotation={[-0.45, 0, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.007, 0.007, 0.13, 12]} />
                  <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.6} />
                </mesh>
                {/* Inverted drying glassware on pegs */}
                {(pxi + pyi) % 3 === 0 && (
                  <mesh position={[0, 0.04, 0]}>
                    <cylinderGeometry args={[0.025, 0.018, 0.11, 16]} />
                    <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} transparent opacity={0.35} />
                  </mesh>
                )}
              </group>
            ))
          )}
        </group>

        {/* Chemical Waste Carboy Secondary Containment Station */}
        <group position={[0.65, 0, -2.1]}>
          {/* Polypropylene Spill Containment Basin */}
          <mesh position={[0, 0.04, 0]} receiveShadow>
            <boxGeometry args={[0.78, 0.08, 0.48]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>

          {/* Organic / Solvent Waste Carboy (Red Cap) */}
          <group position={[-0.2, 0.28, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.44, 0.22]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.35} transmission={0.35} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0.235, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 20]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.112]}>
              <planeGeometry args={[0.16, 0.14]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Aqueous Acid/Base Waste Carboy (Blue Cap) */}
          <group position={[0.2, 0.28, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.44, 0.22]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.35} transmission={0.35} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0.235, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 20]} />
              <meshStandardMaterial color="#2563eb" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.112]}>
              <planeGeometry args={[0.16, 0.14]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          YELLOW FLAMMABLE CHEMICAL SAFETY CABINET (NFPA 704 STANDARD)
         ───────────────────────────────────────────────────────────── */}
      <group position={[-5.6, 0, 4.0]}>
        {/* Heavy Gauge Safety Yellow Steel Cabinet Body */}
        <mesh position={[0, 0.825, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 1.65, 1.15]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.32} metalness={0.4} />
        </mesh>

        {/* Double Doors Inset Face */}
        <mesh position={[0.33, 0.825, 0]}>
          <boxGeometry args={[0.015, 1.58, 1.1]} />
          <meshStandardMaterial color="#eab308" roughness={0.28} metalness={0.45} />
        </mesh>
        {/* Door Dividing Seam */}
        <mesh position={[0.34, 0.825, 0]}>
          <boxGeometry args={[0.005, 1.56, 0.015]} />
          <meshStandardMaterial color="#854d0e" roughness={0.5} />
        </mesh>

        {/* 3-Point Paddle Latch Chrome Handle */}
        <mesh position={[0.345, 0.95, -0.06]}>
          <boxGeometry args={[0.02, 0.12, 0.04]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* Bold Red "FLAMMABLE - KEEP FIRE AWAY" Banner */}
        <mesh position={[0.342, 1.35, 0]}>
          <planeGeometry args={[0.9, 0.18]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>

        {/* NFPA 704 Diamond Plaque (Rotated 45 deg square) */}
        <group position={[0.342, 1.05, 0.28]} rotation={[0, 0, Math.PI / 4]}>
          {/* Blue: Health 2 */}
          <mesh position={[-0.035, 0.035, 0]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color="#2563eb" />
          </mesh>
          {/* Red: Flammability 3 */}
          <mesh position={[0.035, 0.035, 0]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
          {/* Yellow: Reactivity 1 */}
          <mesh position={[0.035, -0.035, 0]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          {/* White: Special Hazard */}
          <mesh position={[-0.035, -0.035, 0]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
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
          5. BACK WALL: ARCHITECTURAL CAMPUS WINDOWS & SAFETY STATION
         ───────────────────────────────────────────────────────────── */}
      {/* Lower Wall Wainscot & Aluminum Trim */}
      <mesh position={[0, 0.5, -6.99]}>
        <planeGeometry args={[13.5, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.01, -6.98]}>
        <boxGeometry args={[13.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Tall Divided Campus Windows with Panoramic Campus Vista */}
      <group position={[0, 2.2, -6.96]}>
        {/* Sky Daylight Atmosphere Gradient */}
        <mesh position={[0, 0.2, -0.22]}>
          <planeGeometry args={[6.8, 2.8]} />
          <meshBasicMaterial color="#bae6fd" />
        </mesh>

        {/* Distant Modern Research Pavilion Buildings Silhouettes */}
        <group position={[0, -0.3, -0.16]}>
          {/* Main campus science center wing */}
          <mesh position={[-1.6, 0.1, 0]}>
            <planeGeometry args={[1.8, 1.1]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>
          <mesh position={[-1.6, 0.1, 0.001]}>
            <planeGeometry args={[1.7, 0.9]} />
            <meshBasicMaterial color="#475569" />
          </mesh>

          {/* Central glazed tower */}
          <mesh position={[0.2, 0.35, 0]}>
            <planeGeometry args={[1.2, 1.6]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>
          <mesh position={[0.2, 0.35, 0.001]}>
            <planeGeometry args={[1.1, 1.4]} />
            <meshBasicMaterial color="#334155" />
          </mesh>

          {/* Right laboratory wing */}
          <mesh position={[1.8, 0.05, 0]}>
            <planeGeometry args={[1.6, 1.0]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>

          {/* Manicured Campus Green Lawn Canopy */}
          <mesh position={[0, -0.65, 0.02]}>
            <planeGeometry args={[6.8, 0.7]} />
            <meshBasicMaterial color="#15803d" />
          </mesh>
        </group>

        {/* Heavy Black Architectural Window Frame */}
        <mesh>
          <boxGeometry args={[5.6, 2.5, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Vertical Mullion Bars */}
        {[-1.8, -0.6, 0.6, 1.8].map((mx, mi) => (
          <mesh key={mi} position={[mx, 0, 0.03]}>
            <boxGeometry args={[0.045, 2.4, 0.06]} />
            <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.85} />
          </mesh>
        ))}

        {/* Horizontal Transom Beam */}
        <mesh position={[0, 0.45, 0.03]}>
          <boxGeometry args={[5.5, 0.05, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Architectural Exterior Sun Louver Slats */}
        {[-0.6, -0.2, 0.2, 0.7].map((ly, li) => (
          <mesh key={li} position={[0, ly, -0.05]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[5.4, 0.025, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
        ))}

        {/* Multi-Pane Insulated Tempered Glass with Realistic Refraction & Sunlight */}
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[5.4, 2.3]} />
          <meshPhysicalMaterial
            color="#f0f9ff"
            transparent
            opacity={0.3}
            roughness={0.06}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Warm Sunlight Beaming Inward Across the Bench */}
        <directionalLight
          position={[0, 5.0, -3.5]}
          intensity={2.2}
          color="#fef3c7"
          castShadow
          target-position={[0, 0.94, 0]}
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
