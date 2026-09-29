"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * MageLabs Complete Open Physics Laboratory Environment
 * 
 * Comprehensive open physics laboratory featuring:
 * - Bright, realistic architectural lighting & soft shadows
 * - Station 1: Central DC Circuits Workbench (ESD Mat, Grounding Snaps, Caddy)
 * - Station 2: Harmonic Motion & Simple Pendulum (Cast iron stand, photogate timer, oscillating bob)
 * - Station 3: Optical Bench Rail (Laser ray source, dispersion prism, lens holder, screen)
 * - Station 4: Electromagnetism & Oscilloscope Workstation (Live waveform screen, horseshoe magnet, induction coil)
 * - Station 5: Safety Station (Emergency eyewash fountain, safety shower, goggles cabinet, breaker box)
 * - Station 6: Large Multi-Panel Physics Whiteboard (Ohm, Kirchhoff, Maxwell, Snell formulas)
 * - Windows with outdoor daylight, ceiling troffer array, secondary benches, and swivel stools
 */
export function LabRoom3D() {
  const pendulumBobRef = useRef<THREE.Group>(null);
  const oscilloscopeWaveRef = useRef<THREE.Mesh>(null);

  // Animated physical pendulum oscillation (harmonic period T = 1.6s)
  useFrame((state) => {
    if (pendulumBobRef.current) {
      const time = state.clock.getElapsedTime();
      // Simple harmonic motion theta(t) = theta_0 * cos(omega * t)
      const omega = Math.sqrt(9.8 / 0.65); // g = 9.8, L = 0.65m
      const angle = 0.22 * Math.cos(omega * time);
      pendulumBobRef.current.rotation.z = angle;
    }

    // Oscilloscope live waveform phase animation
    if (oscilloscopeWaveRef.current) {
      const time = state.clock.getElapsedTime();
      oscilloscopeWaveRef.current.rotation.y = Math.sin(time * 2) * 0.05;
    }
  });

  // High-performance procedural VCT Vinyl Tile Texture
  const floorTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Light polished institutional vinyl tile base
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle checkered grid (128px per tile)
    for (let x = 0; x < 512; x += 128) {
      for (let y = 0; y < 512; y += 128) {
        if ((x / 128 + y / 128) % 2 === 0) {
          ctx.fillStyle = "#d8e1ea";
          ctx.fillRect(x, y, 128, 128);
        }
      }
    }

    // Tile grout lines
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Subtle terrazzo flecks
    for (let n = 0; n < 900; n++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const r = Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.5 ? "#64748b" : "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }, []);

  // Multi-panel Physics Whiteboard Texture
  const whiteboardTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Clean white dry-erase porcelain surface
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    // Faint grid guide
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Title & Department Header
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.fillText("PHYSICS LABORATORY 101 — CLASSICAL & MODERN EXPERIMENTS", 35, 46);

    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(35, 60);
    ctx.lineTo(920, 60);
    ctx.stroke();

    // Section 1: Electrodynamics
    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("1. OHM'S LAW:  V = I · R", 45, 115);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("• Series: R_eq = R1 + R2 + ...", 55, 145);
    ctx.fillText("• Parallel: 1/R_eq = 1/R1 + 1/R2 + ...", 55, 172);
    ctx.fillText("• Power Dissipation: P = V·I = I²R = V²/R", 55, 199);
    ctx.fillText("• Internal Resistance: V_term = ℰ - I·r", 55, 226);

    // Section 2: Harmonic Mechanics
    ctx.fillStyle = "#047857";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("2. SIMPLE PENDULUM", 500, 115);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("• Period: T = 2π √(L / g)", 510, 145);
    ctx.fillText("• Gravitational Accel: g = 4π² L / T²", 510, 172);
    ctx.fillText("• Small Angle Limit: sin(θ) ≈ θ (θ < 15°)", 510, 199);

    // Section 3: Optics & Waves
    ctx.fillStyle = "#9333ea";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("3. OPTICS & SNELL'S LAW", 45, 290);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("• Refraction: n₁ sin(θ₁) = n₂ sin(θ₂)", 55, 320);
    ctx.fillText("• Thin Lens Equation: 1/f = 1/d_o + 1/d_i", 55, 345);
    ctx.fillText("• Dispersion: n(λ) Cauchy formula (Blue bends > Red)", 55, 370);

    // Section 4: Maxwell's Equations
    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("4. MAXWELL'S ELECTROMAGNETIC FOUNDATIONS", 45, 425);
    ctx.font = "15px 'Courier New', monospace";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("∇·E = ρ/ε₀   |   ∇·B = 0   |   ∇×E = -∂B/∂t   |   ∇×B = μ₀J + μ₀ε₀∂E/∂t", 55, 458);

    // Schematic Drawing on right
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(620, 260, 360, 190);
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("CIRCUIT TOPOLOGY DIAGRAM", 640, 285);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group>
      {/* ========================================================================= */}
      {/* 1. ROOM SHELL & ARCHITECTURE (Crisp, High-Key Natural Lighting)           */}
      {/* ========================================================================= */}

      {/* Main Floor - Polished Light VCT Tile Floor with Sheen */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial
          roughness={0.25}
          metalness={0.15}
          color="#f8fafc"
          map={floorTexture || undefined}
        />
      </mesh>

      {/* Back Wall - Upper Clean Painted Off-White */}
      <mesh position={[0, 2.8, -4.5]} receiveShadow>
        <planeGeometry args={[24, 4.4]} />
        <meshStandardMaterial roughness={0.85} metalness={0.05} color="#f1f5f9" />
      </mesh>

      {/* Back Wall - Lower Protective Wainscoting (Slate Blue-Gray) */}
      <mesh position={[0, -1.0, -4.5]} receiveShadow>
        <planeGeometry args={[24, 3.2]} />
        <meshStandardMaterial roughness={0.6} metalness={0.15} color="#475569" />
      </mesh>

      {/* Chair Rail Molding Divider */}
      <mesh position={[0, 0.6, -4.48]}>
        <boxGeometry args={[24, 0.08, 0.05]} />
        <meshStandardMaterial roughness={0.4} metalness={0.3} color="#1e293b" />
      </mesh>

      {/* Floor Baseboard Trim */}
      <mesh position={[0, -2.5, -4.48]}>
        <boxGeometry args={[24, 0.2, 0.04]} />
        <meshStandardMaterial roughness={0.5} color="#0f172a" />
      </mesh>

      {/* Left Wall with Emergency Stations */}
      <group position={[-9.5, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 2.0, 0]} receiveShadow>
          <planeGeometry args={[20, 4.4]} />
          <meshStandardMaterial roughness={0.85} color="#f1f5f9" />
        </mesh>
        <mesh position={[0, -1.8, 0]} receiveShadow>
          <planeGeometry args={[20, 3.2]} />
          <meshStandardMaterial roughness={0.6} color="#475569" />
        </mesh>
        <mesh position={[0, -0.2, 0.02]}>
          <boxGeometry args={[20, 0.08, 0.04]} />
          <meshStandardMaterial roughness={0.4} color="#1e293b" />
        </mesh>
      </group>

      {/* Right Wall with Large Sunlit Campus Windows */}
      <group position={[9.5, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Wall surrounding windows */}
        <mesh position={[0, 2.0, 0]} receiveShadow>
          <planeGeometry args={[20, 4.4]} />
          <meshStandardMaterial roughness={0.85} color="#f1f5f9" />
        </mesh>
        <mesh position={[0, -1.8, 0]} receiveShadow>
          <planeGeometry args={[20, 3.2]} />
          <meshStandardMaterial roughness={0.6} color="#475569" />
        </mesh>
        {/* Large 6-pane Laboratory Windows with Outdoor Daylight Sky */}
        {[-3.5, 0, 3.5].map((x) => (
          <group key={`win-${x}`} position={[x, 1.2, 0.05]}>
            {/* White window frame */}
            <mesh>
              <boxGeometry args={[2.4, 2.6, 0.12]} />
              <meshStandardMaterial metalness={0.2} roughness={0.4} color="#ffffff" />
            </mesh>
            {/* Glass window pane showing outdoor daylight */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[2.2, 2.4]} />
              <meshPhysicalMaterial
                roughness={0.05}
                transmission={0.9}
                thickness={0.1}
                transparent
                opacity={0.85}
                color="#e0f2fe"
              />
            </mesh>
            {/* Soft outdoor sky backdrop panel behind window */}
            <mesh position={[0, 0, -0.4]}>
              <planeGeometry args={[3.2, 3.2]} />
              <meshBasicMaterial color="#bae6fd" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ceiling Plane with Recessed Grid */}
      <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial roughness={0.9} color="#e2e8f0" />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. OVERHEAD LABORATORY LIGHTING GRID (Bright, Even Illumination)         */}
      {/* ========================================================================= */}
      {[-4.5, 0, 4.5].map((x) =>
        [-2.0, 2.0].map((z) => (
          <group key={`troffer-${x}-${z}`} position={[x, 4.5, z]}>
            {/* Luminaire aluminum fixture frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 0.1, 2.4]} />
              <meshStandardMaterial metalness={0.7} roughness={0.3} color="#94a3b8" />
            </mesh>
            {/* Bright emissive 4000K diffuser lens */}
            <mesh position={[0, -0.055, 0]}>
              <planeGeometry args={[1.45, 2.25]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Soft downward area point light */}
            <pointLight position={[0, -0.4, 0]} intensity={1.8} distance={8} color="#f8fafc" />
          </group>
        ))
      )}

      {/* ========================================================================= */}
      {/* 3. WALL-MOUNTED MULTI-PANEL WHITEBOARD                                   */}
      {/* ========================================================================= */}
      <group position={[0, 2.1, -4.42]}>
        {/* Silver anodized aluminum outer frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.6, 2.5, 0.06]} />
          <meshStandardMaterial metalness={0.88} roughness={0.2} color="#94a3b8" />
        </mesh>
        {/* Whiteboard porcelain writing surface */}
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[5.5, 2.4]} />
          <meshStandardMaterial
            roughness={0.2}
            metalness={0.05}
            color="#ffffff"
            map={whiteboardTexture || undefined}
          />
        </mesh>
        {/* Aluminum marker & eraser ledge tray */}
        <mesh position={[0, -1.24, 0.08]}>
          <boxGeometry args={[5.6, 0.04, 0.12]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#64748b" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. STATION 1 (CENTER): MAIN DC CIRCUITS WORKBENCH                        */}
      {/* ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Heavy epoxy resin chemical-resistant workbench top */}
        <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[7.2, 0.1, 4.2]} />
          <meshStandardMaterial roughness={0.4} metalness={0.2} color="#1e2430" />
        </mesh>

        {/* High-visibility ESD Blue Anti-Static Mat */}
        <mesh position={[0, 0.002, 0]} receiveShadow>
          <planeGeometry args={[6.2, 3.4]} />
          <meshStandardMaterial roughness={0.7} metalness={0.08} color="#2563eb" />
        </mesh>

        {/* ESD Grounding Terminal Snap */}
        <mesh position={[-2.9, 0.01, 1.5]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#38bdf8" />
        </mesh>

        {/* Solid wood beveled perimeter apron */}
        <mesh position={[0, -0.05, 2.12]}>
          <boxGeometry args={[7.24, 0.12, 0.04]} />
          <meshStandardMaterial roughness={0.6} color="#78350f" />
        </mesh>
        <mesh position={[0, -0.05, -2.12]}>
          <boxGeometry args={[7.24, 0.12, 0.04]} />
          <meshStandardMaterial roughness={0.6} color="#78350f" />
        </mesh>
        <mesh position={[-3.62, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.12, 4.24]} />
          <meshStandardMaterial roughness={0.6} color="#78350f" />
        </mesh>
        <mesh position={[3.62, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.12, 4.24]} />
          <meshStandardMaterial roughness={0.6} color="#78350f" />
        </mesh>

        {/* Welded steel C-frame legs (4 corners) */}
        {[
          [-3.3, -1.3, -1.8],
          [3.3, -1.3, -1.8],
          [-3.3, -1.3, 1.8],
          [3.3, -1.3, 1.8],
        ].map(([x, y, z], i) => (
          <group key={`leg-${i}`} position={[x, y, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.12, 2.4, 0.12]} />
              <meshStandardMaterial metalness={0.8} roughness={0.3} color="#334155" />
            </mesh>
            <mesh position={[0, -1.22, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
              <meshStandardMaterial metalness={0.9} roughness={0.2} color="#0f172a" />
            </mesh>
          </group>
        ))}

        {/* Cable Hanger Stand with Hanging Patch Leads */}
        <group position={[3.1, 0.35, -1.4]}>
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.06, 24]} />
            <meshStandardMaterial metalness={0.7} roughness={0.4} color="#1e293b" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.2} color="#cbd5e1" />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.35, 0.03, 0.12]} />
            <meshStandardMaterial metalness={0.85} roughness={0.25} color="#94a3b8" />
          </mesh>
          {/* Spare hanging patch cables */}
          <mesh position={[-0.1, 0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />
            <meshStandardMaterial roughness={0.5} color="#ef4444" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.55, 8]} />
            <meshStandardMaterial roughness={0.5} color="#18181b" />
          </mesh>
          <mesh position={[0.1, 0.07, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.52, 8]} />
            <meshStandardMaterial roughness={0.5} color="#eab308" />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 5. STATION 2 (LEFT): HARMONIC MOTION & SIMPLE PENDULUM APPARATUS          */}
      {/* ========================================================================= */}
      <group position={[-5.8, -0.6, -0.5]}>
        {/* Support table */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.1, 2.2]} />
          <meshStandardMaterial roughness={0.5} color="#334155" />
        </mesh>
        {/* Cast iron triangular A-base support stand */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.08, 3]} />
          <meshStandardMaterial metalness={0.8} roughness={0.5} color="#1e293b" />
        </mesh>
        {/* Vertical stainless steel retort rod */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 16]} />
          <meshStandardMaterial metalness={0.92} roughness={0.15} color="#e2e8f0" />
        </mesh>
        {/* Horizontal suspension cross-arm */}
        <mesh position={[0.3, 1.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.65, 16]} />
          <meshStandardMaterial metalness={0.92} roughness={0.15} color="#e2e8f0" />
        </mesh>
        {/* Protractor degree scale clamp */}
        <mesh position={[0.55, 1.15, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial roughness={0.3} color="#f8fafc" />
        </mesh>

        {/* Oscillating Pendulum String & Bob Assembly */}
        <group ref={pendulumBobRef} position={[0.55, 1.15, 0]}>
          {/* Steel suspension wire */}
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.9, 8]} />
            <meshStandardMaterial metalness={0.9} color="#cbd5e1" />
          </mesh>
          {/* Solid polished brass spherical bob (m = 100g) */}
          <mesh position={[0, -0.92, 0]} castShadow>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial metalness={0.95} roughness={0.15} color="#eab308" />
          </mesh>
          <mesh position={[0, -0.83, 0]}>
            <torusGeometry args={[0.02, 0.004, 12, 24]} />
            <meshStandardMaterial metalness={0.9} color="#eab308" />
          </mesh>
        </group>

        {/* Digital Photogate Timer with LCD Display */}
        <group position={[0.55, 0.15, 0]}>
          {/* U-shaped photogate sensor bracket */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.16, 0.22]} />
            <meshStandardMaterial roughness={0.6} color="#0f172a" />
          </mesh>
          {/* Infrared optical gate emitter */}
          <mesh position={[0, 0.04, 0.09]}>
            <cylinderGeometry args={[0.008, 0.008, 0.02, 12]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Photogate digital timer box on table */}
          <mesh position={[0.6, -0.55, 0.3]}>
            <boxGeometry args={[0.55, 0.22, 0.45]} />
            <meshStandardMaterial metalness={0.4} roughness={0.5} color="#1e293b" />
          </mesh>
          {/* Timer LCD display (1.428s period) */}
          <mesh position={[0.6, -0.48, 0.528]}>
            <planeGeometry args={[0.42, 0.14]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 6. STATION 3 (RIGHT): OPTICAL BENCH RAIL & PRISM DISPERSION APPARATUS     */}
      {/* ========================================================================= */}
      <group position={[5.8, -0.6, -0.5]}>
        {/* Support table */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.1, 2.2]} />
          <meshStandardMaterial roughness={0.5} color="#334155" />
        </mesh>
        {/* 1.8-meter extruded aluminum optical bench rail with metric millimeter scale */}
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[0.18, 0.06, 2.0]} />
          <meshStandardMaterial metalness={0.92} roughness={0.2} color="#e2e8f0" />
        </mesh>

        {/* Component 1: Diode Laser Ray Box (Red 632nm light source) */}
        <group position={[0, -0.45, -0.8]}>
          <mesh>
            <boxGeometry args={[0.22, 0.18, 0.3]} />
            <meshStandardMaterial metalness={0.6} roughness={0.3} color="#b91c1c" />
          </mesh>
          {/* Laser aperture lens */}
          <mesh position={[0, 0, 0.16]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Visible red laser beam ray travelling along the rail */}
          <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Component 2: Equilateral Flint Glass Prism */}
        <group position={[0, -0.42, 0]}>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.06, 24]} />
            <meshStandardMaterial metalness={0.8} roughness={0.3} color="#334155" />
          </mesh>
          {/* Transparent Glass Prism */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.18, 3]} />
            <meshPhysicalMaterial
              roughness={0.05}
              transmission={0.95}
              thickness={0.2}
              transparent
              opacity={0.88}
              color="#e0f2fe"
            />
          </mesh>
        </group>

        {/* Component 3: Double Convex Optical Lens in Adjustable Ring */}
        <group position={[0, -0.42, 0.5]}>
          {/* Holder stem */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
            <meshStandardMaterial metalness={0.9} color="#cbd5e1" />
          </mesh>
          {/* Circular brass lens retaining ring */}
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09, 0.012, 16, 32]} />
            <meshStandardMaterial metalness={0.88} roughness={0.25} color="#ca8a04" />
          </mesh>
          {/* Glass lens element */}
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.088, 24, 24, 0, Math.PI * 2, 0, Math.PI]} />
            <meshPhysicalMaterial
              roughness={0.05}
              transmission={0.95}
              thickness={0.08}
              transparent
              opacity={0.9}
              color="#ffffff"
            />
          </mesh>
        </group>

        {/* Component 4: White Frosted Projection Screen */}
        <group position={[0, -0.38, 0.88]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.32, 0.02]} />
            <meshStandardMaterial roughness={0.9} color="#f8fafc" />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 7. STATION 4 (BACK LEFT): OSCILLOSCOPE & ELECTROMAGNETISM STATION         */}
      {/* ========================================================================= */}
      <group position={[-5.8, 0.6, -4.1]}>
        {/* Benchtop Cabinet */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[2.8, 1.6, 0.7]} />
          <meshStandardMaterial roughness={0.5} metalness={0.2} color="#1e2430" />
        </mesh>

        {/* Tektronix-style Dual-Trace Digital Storage Oscilloscope */}
        <group position={[-0.6, 0.38, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.78, 0.46, 0.44]} />
            <meshStandardMaterial metalness={0.5} roughness={0.4} color="#334155" />
          </mesh>
          {/* Glowing Green Oscilloscope CRT / LCD Graticule Display */}
          <mesh ref={oscilloscopeWaveRef} position={[-0.14, 0.04, 0.222]}>
            <planeGeometry args={[0.38, 0.3]} />
            <meshBasicMaterial color="#052e16" />
          </mesh>
          {/* Sine waveform line */}
          <mesh position={[-0.14, 0.04, 0.224]}>
            <planeGeometry args={[0.34, 0.26]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* Oscilloscope control knobs & BNC Channel Jacks */}
          {[
            [0.18, 0.1, 0.23],
            [0.28, 0.1, 0.23],
            [0.18, -0.05, 0.23],
            [0.28, -0.05, 0.23],
          ].map(([x, y, z], i) => (
            <mesh key={`osc-knob-${i}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.024, 0.024, 0.02, 16]} />
              <meshStandardMaterial metalness={0.8} roughness={0.3} color="#94a3b8" />
            </mesh>
          ))}
        </group>

        {/* Alnico Horseshoe Permanent Magnet (Red North, Blue South) */}
        <group position={[0.6, 0.32, 0.1]}>
          {/* U-bend */}
          <mesh rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.1, 0.035, 16, 24, Math.PI]} />
            <meshStandardMaterial roughness={0.4} color="#b91c1c" />
          </mesh>
          {/* Red North Pole Leg */}
          <mesh position={[-0.1, -0.12, 0]}>
            <boxGeometry args={[0.07, 0.24, 0.07]} />
            <meshStandardMaterial roughness={0.4} color="#dc2626" />
          </mesh>
          {/* Blue South Pole Leg */}
          <mesh position={[0.1, -0.12, 0]}>
            <boxGeometry args={[0.07, 0.24, 0.07]} />
            <meshStandardMaterial roughness={0.4} color="#2563eb" />
          </mesh>
        </group>

        {/* Solenoid Induction Coil on Stand */}
        <group position={[0.6, 0.25, -0.15]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.22, 24]} />
            <meshStandardMaterial metalness={0.92} roughness={0.2} color="#b45309" />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 8. STATION 5: LABORATORY SAFETY & UTILITIES (Emergency Shower & Eyewash) */}
      {/* ========================================================================= */}
      <group position={[-9.4, 0.5, 3.2]} rotation={[0, Math.PI / 2, 0]}>
        {/* High-visibility yellow safety shower pipe */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 16]} />
          <meshStandardMaterial metalness={0.7} roughness={0.3} color="#eab308" />
        </mesh>
        {/* Overhead drench shower head funnel */}
        <mesh position={[0.4, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.06, 0.16, 24]} />
          <meshStandardMaterial metalness={0.8} color="#eab308" />
        </mesh>
        {/* Emergency pull triangle rod */}
        <mesh position={[0.4, 1.8, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.8, 8]} />
          <meshStandardMaterial metalness={0.8} color="#dc2626" />
        </mesh>

        {/* Dual aerated eye-wash fountain basin */}
        <group position={[0.2, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.18, 0.12, 24]} />
            <meshStandardMaterial metalness={0.85} roughness={0.2} color="#cbd5e1" />
          </mesh>
          <mesh position={[-0.06, 0.08, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
            <meshStandardMaterial metalness={0.8} color="#eab308" />
          </mesh>
          <mesh position={[0.06, 0.08, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
            <meshStandardMaterial metalness={0.8} color="#eab308" />
          </mesh>
        </group>

        {/* Safety Goggles Storage Cabinet */}
        <group position={[1.4, 0.8, 0]}>
          <mesh>
            <boxGeometry args={[0.6, 0.8, 0.18]} />
            <meshStandardMaterial metalness={0.6} roughness={0.4} color="#334155" />
          </mesh>
          <mesh position={[0, 0, 0.092]}>
            <planeGeometry args={[0.54, 0.74]} />
            <meshPhysicalMaterial
              transmission={0.9}
              roughness={0.1}
              color="#e0f2fe"
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 9. STUDENT LABORATORY SWIVEL STOOLS                                      */}
      {/* ========================================================================= */}
      {[-2.2, 0, 2.2].map((xOffset) => (
        <group key={`stool-${xOffset}`} position={[xOffset, -1.8, 2.7]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.09, 32]} />
            <meshStandardMaterial roughness={0.6} color="#18181b" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.65, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.15} color="#e2e8f0" />
          </mesh>
          <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.02, 16, 32]} />
            <meshStandardMaterial metalness={0.9} roughness={0.15} color="#cbd5e1" />
          </mesh>
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.38, 0.42, 0.04, 5]} />
            <meshStandardMaterial metalness={0.8} roughness={0.3} color="#27272a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
