"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * MageLabs Authentic 3D Physics Laboratory Environment
 * 
 * Provides an authentic, enclosed physics laboratory room:
 * - Epoxy resin main workbench with steel C-frame legs and leveling pads
 * - Two-tone laboratory walls with electrical conduits and junction boxes
 * - Polished VCT floor tiles with subtle specular reflection
 * - Ceiling fixture array with soft fluorescent troffers
 * - Wall-mounted physics whiteboard with Ohm's law and Kirchhoff formulas
 * - Master electrical safety cutoff board with emergency stop palm button
 * - Laboratory equipment storage cabinet with spare apparatus
 * - Swivel laboratory stools with chromed footrest rings
 * - Tabletop banana cable hanger rack and tool caddy
 */
export function LabRoom3D() {
  // Floor tile texture generated procedurally via Canvas for crisp, zero-bandwidth rendering
  const floorTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base vinyl tile color (speckled institutional lab tile)
    ctx.fillStyle = "#1e222b";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle tile seams (grid 4x4 tiles per texture repeat)
    ctx.strokeStyle = "#12151b";
    ctx.lineWidth = 4;
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

    // Speckled fleck pattern
    for (let n = 0; n < 800; n++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 2;
      ctx.fillStyle = Math.random() > 0.5 ? "#2a303d" : "#14171d";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);

  // Whiteboard texture with realistic physics diagrams and formulas
  const whiteboardTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Whiteboard porcelain surface
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 1024, 512);

    // Faint grid lines
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

    // Header banner
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.fillText("EXPERIMENT 01: OHM'S LAW & DC CIRCUIT DYNAMICS", 40, 52);

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 68);
    ctx.lineTo(820, 68);
    ctx.stroke();

    // Ohm's Law core formulas in dark blue and red dry erase
    ctx.fillStyle = "#1d4ed8";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("V = I · R", 50, 130);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("V: Potential Difference (Volts)", 50, 165);
    ctx.fillText("I: Electric Current (Amperes)", 50, 195);
    ctx.fillText("R: Resistance (Ohms, Ω)", 50, 225);

    // Power formulas
    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("P = V · I = I²R = V² / R", 50, 285);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Tungsten filament non-linear PTC: R(T) = R₀ [1 + α(T - T₀)]", 50, 320);

    // Kirchhoff's Laws
    ctx.fillStyle = "#047857";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("KIRCHHOFF'S RULES:", 50, 375);
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("1. Junction Rule: Σ I_in = Σ I_out (Conservation of Charge)", 50, 408);
    ctx.fillText("2. Loop Rule: Σ ΔV = 0 (Conservation of Energy)", 50, 438);

    // Right side: Hand-drawn circuit schematic
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 3;
    ctx.strokeRect(580, 100, 380, 260);

    // Source symbol (DC battery)
    ctx.beginPath();
    ctx.moveTo(580, 230);
    ctx.lineTo(660, 230);
    ctx.stroke();

    // Resistor zigzag
    ctx.beginPath();
    ctx.moveTo(700, 100);
    ctx.lineTo(720, 80);
    ctx.lineTo(740, 120);
    ctx.lineTo(760, 80);
    ctx.lineTo(780, 120);
    ctx.lineTo(800, 100);
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("R (Load)", 735, 65);
    ctx.fillText("E, r_int", 595, 260);
    ctx.fillText("[A] Series Ammeter", 840, 230);
    ctx.fillText("[V] Parallel Voltmeter", 700, 340);

    // Safety warning note in red
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("⚠ VERIFY POLARITY BEFORE CLOSING KNIFE SWITCH", 540, 475);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group>
      {/* ========================================================================= */}
      {/* 1. ARCHITECTURAL ENCLOSURE (Walls, Floor, Ceiling)                        */}
      {/* ========================================================================= */}

      {/* Main Floor (with VCT tiles) */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.2}
          color="#222733"
          map={floorTexture || undefined}
        />
      </mesh>

      {/* Back Wall - Lower wainscoting (durable industrial slate gray) */}
      <mesh position={[0, -1.0, -4.5]} receiveShadow>
        <planeGeometry args={[26, 3.2]} />
        <meshStandardMaterial roughness={0.7} metalness={0.1} color="#1b212b" />
      </mesh>

      {/* Back Wall - Upper painted drywall (clean laboratory light gray) */}
      <mesh position={[0, 2.8, -4.5]} receiveShadow>
        <planeGeometry args={[26, 4.4]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} color="#2b3340" />
      </mesh>

      {/* Chair rail separator molding on back wall */}
      <mesh position={[0, 0.6, -4.48]}>
        <boxGeometry args={[26, 0.08, 0.05]} />
        <meshStandardMaterial roughness={0.5} metalness={0.2} color="#151921" />
      </mesh>

      {/* Baseboard molding on back wall floor */}
      <mesh position={[0, -2.5, -4.48]}>
        <boxGeometry args={[26, 0.2, 0.04]} />
        <meshStandardMaterial roughness={0.6} color="#0f1217" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-9.5, 0.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 7.6]} />
        <meshStandardMaterial roughness={0.85} metalness={0.05} color="#242b36" />
      </mesh>

      {/* Right Wall with Laboratory Window Cutout */}
      <mesh position={[9.5, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 7.6]} />
        <meshStandardMaterial roughness={0.85} metalness={0.05} color="#242b36" />
      </mesh>

      {/* Ceiling Plane with recessed lighting grid */}
      <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial roughness={0.95} color="#181c24" />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. OVERHEAD LABORATORY LIGHTING FIXTURES                                 */}
      {/* ========================================================================= */}
      {[-3.5, 0, 3.5].map((xOffset) => (
        <group key={`troffer-${xOffset}`} position={[xOffset, 4.5, -0.5]}>
          {/* Troffer housing bezel */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.12, 3.2]} />
            <meshStandardMaterial metalness={0.7} roughness={0.3} color="#2d3748" />
          </mesh>
          {/* Diffuser lens emissive panel */}
          <mesh position={[0, -0.06, 0]}>
            <planeGeometry args={[1.6, 3.0]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          {/* Soft downward area-like point light */}
          <pointLight position={[0, -0.5, 0]} intensity={1.5} distance={8} color="#e2e8f0" />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 3. WALL ELECTRICAL CONDUITS & JUNCTION BOXES                             */}
      {/* ========================================================================= */}
      <group position={[0, 0, -4.45]}>
        {/* Horizontal conduit line along wall */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 18, 16]} />
          <meshStandardMaterial metalness={0.85} roughness={0.25} color="#94a3b8" />
        </mesh>
        {/* Secondary horizontal conduit */}
        <mesh position={[0, 2.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 18, 16]} />
          <meshStandardMaterial metalness={0.85} roughness={0.25} color="#94a3b8" />
        </mesh>
        {/* Vertical drops to utility outlets */}
        {[-4.5, 4.5].map((x) => (
          <group key={`drop-${x}`} position={[x, 0, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.2, 16]} />
              <meshStandardMaterial metalness={0.85} roughness={0.25} color="#94a3b8" />
            </mesh>
            {/* Square galvanized junction box */}
            <mesh position={[0, 1.8, 0.03]}>
              <boxGeometry args={[0.2, 0.2, 0.08]} />
              <meshStandardMaterial metalness={0.75} roughness={0.35} color="#64748b" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 4. WALL-MOUNTED PHYSICS WHITEBOARD                                       */}
      {/* ========================================================================= */}
      <group position={[0, 2.1, -4.42]}>
        {/* Aluminum outer frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.24, 2.44, 0.06]} />
          <meshStandardMaterial metalness={0.85} roughness={0.25} color="#64748b" />
        </mesh>
        {/* Whiteboard porcelain writing surface with equations */}
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[5.16, 2.36]} />
          <meshStandardMaterial
            roughness={0.25}
            metalness={0.05}
            color="#ffffff"
            map={whiteboardTexture || undefined}
          />
        </mesh>
        {/* Marker tray at bottom of whiteboard */}
        <mesh position={[0, -1.24, 0.08]}>
          <boxGeometry args={[5.24, 0.04, 0.12]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#475569" />
        </mesh>
        {/* Dry erase markers in tray */}
        <mesh position={[-0.4, -1.21, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 12]} />
          <meshStandardMaterial roughness={0.4} color="#1d4ed8" />
        </mesh>
        <mesh position={[-0.2, -1.21, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 12]} />
          <meshStandardMaterial roughness={0.4} color="#dc2626" />
        </mesh>
        <mesh position={[0, -1.21, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 12]} />
          <meshStandardMaterial roughness={0.4} color="#0f172a" />
        </mesh>
        {/* Felt dry eraser */}
        <mesh position={[0.4, -1.21, 0.08]}>
          <boxGeometry args={[0.16, 0.03, 0.06]} />
          <meshStandardMaterial roughness={0.9} color="#1e293b" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 5. ELECTRICAL SAFETY MASTER CUTOFF PANEL (Left Wall)                     */}
      {/* ========================================================================= */}
      <group position={[-9.42, 1.2, -2.0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Industrial NEMA safety steel enclosure */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 1.0, 0.18]} />
          <meshStandardMaterial metalness={0.7} roughness={0.35} color="#334155" />
        </mesh>
        {/* Yellow high-voltage warning faceplate */}
        <mesh position={[0, 0.28, 0.092]}>
          <planeGeometry args={[0.56, 0.28]} />
          <meshStandardMaterial roughness={0.5} color="#eab308" />
        </mesh>
        {/* Red Emergency Stop Mushroom Button */}
        <mesh position={[0, -0.15, 0.11]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
          <meshStandardMaterial roughness={0.4} color="#dc2626" />
        </mesh>
        {/* Yellow caution collar */}
        <mesh position={[0, -0.15, 0.092]}>
          <cylinderGeometry args={[0.11, 0.11, 0.015, 24]} />
          <meshStandardMaterial roughness={0.5} color="#facc15" />
        </mesh>
        {/* Master mechanical disconnect lever */}
        <mesh position={[0.26, 0.1, 0.08]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.05, 0.28, 0.04]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#dc2626" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 6. WALL-MOUNTED CO2 FIRE EXTINGUISHER                                    */}
      {/* ========================================================================= */}
      <group position={[-9.42, 0.2, 1.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Red pressurized steel tank */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.65, 24]} />
          <meshStandardMaterial metalness={0.65} roughness={0.3} color="#b91c1c" />
        </mesh>
        {/* Hemispherical top and bottom caps */}
        <mesh position={[0, 0.325, 0]}>
          <sphereGeometry args={[0.11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial metalness={0.65} roughness={0.3} color="#b91c1c" />
        </mesh>
        {/* Brass discharge valve & trigger handle */}
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.06]} />
          <meshStandardMaterial metalness={0.85} roughness={0.3} color="#eab308" />
        </mesh>
        {/* Rubber discharge nozzle hose */}
        <mesh position={[0.12, 0.2, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.025, 0.45, 12]} />
          <meshStandardMaterial roughness={0.7} color="#18181b" />
        </mesh>
        {/* Class C Electrical Fire label band */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.112, 0.112, 0.18, 24]} />
          <meshStandardMaterial roughness={0.5} color="#f8fafc" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 7. GLASS-DOOR EQUIPMENT STORAGE CABINET (Back Left)                      */}
      {/* ========================================================================= */}
      <group position={[-6.2, 0.6, -4.1]}>
        {/* Steel cabinet carcass */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.0, 3.0, 0.65]} />
          <meshStandardMaterial metalness={0.75} roughness={0.35} color="#1e2430" />
        </mesh>
        {/* Interior shelving units */}
        {[-0.6, 0, 0.6].map((y) => (
          <mesh key={`shelf-${y}`} position={[0, y, 0.02]}>
            <boxGeometry args={[1.92, 0.03, 0.58]} />
            <meshStandardMaterial metalness={0.7} roughness={0.4} color="#334155" />
          </mesh>
        ))}
        {/* Transparent glass door panels */}
        <mesh position={[-0.48, 0, 0.33]}>
          <boxGeometry args={[0.92, 2.88, 0.02]} />
          <meshPhysicalMaterial
            roughness={0.1}
            metalness={0.1}
            transmission={0.88}
            thickness={0.05}
            transparent
            opacity={0.65}
            color="#cbd5e1"
          />
        </mesh>
        <mesh position={[0.48, 0, 0.33]}>
          <boxGeometry args={[0.92, 2.88, 0.02]} />
          <meshPhysicalMaterial
            roughness={0.1}
            metalness={0.1}
            transmission={0.88}
            thickness={0.05}
            transparent
            opacity={0.65}
            color="#cbd5e1"
          />
        </mesh>
        {/* Stored apparatus on shelves (spare analog galvanometer, resistance box) */}
        <mesh position={[-0.4, 0.15, 0.1]}>
          <boxGeometry args={[0.35, 0.25, 0.3]} />
          <meshStandardMaterial roughness={0.6} color="#451a03" />
        </mesh>
        <mesh position={[0.3, 0.16, 0.1]}>
          <boxGeometry args={[0.45, 0.28, 0.35]} />
          <meshStandardMaterial metalness={0.6} roughness={0.4} color="#1e293b" />
        </mesh>
        <mesh position={[-0.3, -0.45, 0.1]}>
          <boxGeometry args={[0.5, 0.22, 0.32]} />
          <meshStandardMaterial roughness={0.5} color="#27272a" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 8. MAIN STUDENT HEAVY WORKBENCH (Where experiment takes place)           */}
      {/* ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Heavy chemical-resistant epoxy resin tabletop */}
        <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[7.2, 0.1, 4.2]} />
          <meshStandardMaterial
            roughness={0.5}
            metalness={0.2}
            color="#141822"
          />
        </mesh>

        {/* ESD Blue/Grey Anti-Static Workstation Mat */}
        <mesh position={[0, 0.002, 0]} receiveShadow>
          <planeGeometry args={[6.2, 3.4]} />
          <meshStandardMaterial
            roughness={0.8}
            metalness={0.05}
            color="#1b2230"
          />
        </mesh>

        {/* ESD Wrist Strap Grounding Snaps on Table Corner */}
        <mesh position={[-2.9, 0.01, 1.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
          <meshStandardMaterial metalness={0.9} roughness={0.2} color="#38bdf8" />
        </mesh>

        {/* Table edge beveled solid wood perimeter rail */}
        <mesh position={[0, -0.05, 2.12]}>
          <boxGeometry args={[7.24, 0.12, 0.04]} />
          <meshStandardMaterial roughness={0.7} color="#292524" />
        </mesh>
        <mesh position={[0, -0.05, -2.12]}>
          <boxGeometry args={[7.24, 0.12, 0.04]} />
          <meshStandardMaterial roughness={0.7} color="#292524" />
        </mesh>
        <mesh position={[-3.62, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.12, 4.24]} />
          <meshStandardMaterial roughness={0.7} color="#292524" />
        </mesh>
        <mesh position={[3.62, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.12, 4.24]} />
          <meshStandardMaterial roughness={0.7} color="#292524" />
        </mesh>

        {/* Heavy gauge welded steel C-frame legs (4 corners) */}
        {[
          [-3.3, -1.3, -1.8],
          [3.3, -1.3, -1.8],
          [-3.3, -1.3, 1.8],
          [3.3, -1.3, 1.8],
        ].map(([x, y, z], i) => (
          <group key={`leg-${i}`} position={[x, y, z]}>
            {/* Square steel upright column */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.12, 2.4, 0.12]} />
              <meshStandardMaterial metalness={0.8} roughness={0.3} color="#222834" />
            </mesh>
            {/* Threaded adjustable leveling foot */}
            <mesh position={[0, -1.22, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
              <meshStandardMaterial metalness={0.9} roughness={0.2} color="#0f172a" />
            </mesh>
          </group>
        ))}

        {/* Horizontal steel stretcher beam between table legs */}
        <mesh position={[0, -2.2, -1.8]}>
          <boxGeometry args={[6.6, 0.08, 0.08]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#222834" />
        </mesh>
        <mesh position={[0, -2.2, 1.8]}>
          <boxGeometry args={[6.6, 0.08, 0.08]} />
          <meshStandardMaterial metalness={0.8} roughness={0.3} color="#222834" />
        </mesh>

        {/* Tabletop Wire Caddy / Banana Plug Patch Lead Hanger Rack (Far right corner) */}
        <group position={[3.1, 0.35, -1.4]}>
          {/* Weighted base */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.06, 24]} />
            <meshStandardMaterial metalness={0.7} roughness={0.4} color="#1e293b" />
          </mesh>
          {/* Vertical chrome stand */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.2} color="#cbd5e1" />
          </mesh>
          {/* Horizontal slotted comb for hanging wires */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.35, 0.03, 0.12]} />
            <meshStandardMaterial metalness={0.85} roughness={0.25} color="#94a3b8" />
          </mesh>
          {/* Hanging spare test leads (Red, Black, Yellow) */}
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
      {/* 9. ADJUSTABLE LABORATORY SWIVEL STOOLS                                   */}
      {/* ========================================================================= */}
      {[-1.8, 1.8].map((xOffset) => (
        <group key={`stool-${xOffset}`} position={[xOffset, -1.8, 2.7]}>
          {/* Round vinyl seat cushion */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.09, 32]} />
            <meshStandardMaterial roughness={0.6} color="#18181b" />
          </mesh>
          {/* Chrome pneumatic lift cylinder */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.65, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.15} color="#e2e8f0" />
          </mesh>
          {/* Circular footrest chrome ring */}
          <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.02, 16, 32]} />
            <meshStandardMaterial metalness={0.9} roughness={0.15} color="#cbd5e1" />
          </mesh>
          {/* 5-star spider base on floor */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.38, 0.42, 0.04, 5]} />
            <meshStandardMaterial metalness={0.8} roughness={0.3} color="#27272a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
