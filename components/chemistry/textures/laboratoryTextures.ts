"use client";

import * as THREE from "three";

// Cache for procedurally generated textures to prevent re-generation
interface TextureCache {
  floorMap?: THREE.CanvasTexture;
  floorBump?: THREE.CanvasTexture;
  floorRoughness?: THREE.CanvasTexture;
  wallMap?: THREE.CanvasTexture;
  wallBump?: THREE.CanvasTexture;
  ceilingMap?: THREE.CanvasTexture;
  resinWorktopMap?: THREE.CanvasTexture;
  periodicTableMap?: THREE.CanvasTexture;
  hazardTapeMap?: THREE.CanvasTexture;
  safetySignMap?: THREE.CanvasTexture;
  doorSignMap?: THREE.CanvasTexture;
}

const textureCache: TextureCache = {};

/**
 * Procedural Terrazzo Epoxy Laboratory Floor Textures
 * Sharp 600mm x 600mm tiles with slate grout lines and multi-tone quartz/basalt flecks.
 */
export function getLabFloorTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  if (textureCache.floorMap && textureCache.floorBump && textureCache.floorRoughness) {
    return {
      map: textureCache.floorMap,
      bumpMap: textureCache.floorBump,
      roughnessMap: textureCache.floorRoughness,
    };
  }

  const size = 512;
  const tileSize = 256; // 2x2 tiles per texture repeat

  // 1. Color Map
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = size;
  mapCanvas.height = size;
  const ctx = mapCanvas.getContext("2d")!;

  // 2. Bump Map
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d")!;

  // 3. Roughness Map
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;

  // Background grout
  ctx.fillStyle = "#8b949e";
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = "#222222";
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = "#cccccc"; // rough grout
  rCtx.fillRect(0, 0, size, size);

  const tileColors = ["#d7dbe0", "#d1d6dc", "#d9dde2", "#cbd1d8"];
  const groutWidth = 3;

  for (let ty = 0; ty < 2; ty++) {
    for (let tx = 0; tx < 2; tx++) {
      const x = tx * tileSize + groutWidth;
      const y = ty * tileSize + groutWidth;
      const w = tileSize - groutWidth * 2;
      const h = tileSize - groutWidth * 2;
      const tileIndex = ty * 2 + tx;

      // Tile face
      ctx.fillStyle = tileColors[tileIndex];
      ctx.fillRect(x, y, w, h);

      bCtx.fillStyle = "#e5e5e5";
      bCtx.fillRect(x, y, w, h);

      rCtx.fillStyle = "#4a4a4a"; // semi-gloss epoxy surface
      rCtx.fillRect(x, y, w, h);

      // Tile bevel highlight (top & left)
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(x, y, w, 2);
      ctx.fillRect(x, y, 2, h);

      // Tile bevel shadow (bottom & right)
      ctx.fillStyle = "rgba(71, 85, 105, 0.35)";
      ctx.fillRect(x, y + h - 2, w, 2);
      ctx.fillRect(x + w - 2, y, 2, h);

      // Micro terrazzo flecks
      const fleckColors = [
        "rgba(30, 41, 59, 0.75)",   // Dark basalt
        "rgba(71, 85, 105, 0.7)",   // Slate grey
        "rgba(255, 255, 255, 0.85)", // Quartz crystal
        "rgba(148, 163, 184, 0.6)", // Silver grey
        "rgba(180, 83, 9, 0.35)",   // Warm amber quartz
      ];

      // Deterministic pseudo-random seed per tile for stability
      let seed = (tileIndex + 1) * 98765;
      const pseudoRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      for (let i = 0; i < 280; i++) {
        const fx = x + 3 + pseudoRandom() * (w - 6);
        const fy = y + 3 + pseudoRandom() * (h - 6);
        const fr = 0.7 + pseudoRandom() * 1.8;
        const fColor = fleckColors[Math.floor(pseudoRandom() * fleckColors.length)];

        ctx.fillStyle = fColor;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();

        // Bump variation
        bCtx.fillStyle = pseudoRandom() > 0.5 ? "#ffffff" : "#c0c0c0";
        bCtx.beginPath();
        bCtx.arc(fx, fy, fr * 0.8, 0, Math.PI * 2);
        bCtx.fill();
      }
    }
  }

  const floorMap = new THREE.CanvasTexture(mapCanvas);
  floorMap.wrapS = THREE.RepeatWrapping;
  floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set(10, 11);

  const floorBump = new THREE.CanvasTexture(bumpCanvas);
  floorBump.wrapS = THREE.RepeatWrapping;
  floorBump.wrapT = THREE.RepeatWrapping;
  floorBump.repeat.set(10, 11);

  const floorRoughness = new THREE.CanvasTexture(roughCanvas);
  floorRoughness.wrapS = THREE.RepeatWrapping;
  floorRoughness.wrapT = THREE.RepeatWrapping;
  floorRoughness.repeat.set(10, 11);

  textureCache.floorMap = floorMap;
  textureCache.floorBump = floorBump;
  textureCache.floorRoughness = floorRoughness;

  return { map: floorMap, bumpMap: floorBump, roughnessMap: floorRoughness };
}

/**
 * Modular Cleanroom Wall Panel Textures
 * Vertical silicone expansion joints, sterile eggshell coating, and stainless steel rub rail datum.
 */
export function getCleanroomWallTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  if (textureCache.wallMap && textureCache.wallBump) {
    return { map: textureCache.wallMap, bumpMap: textureCache.wallBump };
  }

  const width = 512;
  const height = 512;

  // 1. Color Map
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = width;
  mapCanvas.height = height;
  const ctx = mapCanvas.getContext("2d")!;

  // 2. Bump Map
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext("2d")!;

  // Off-white cleanroom wall panel face
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, width, height);

  bCtx.fillStyle = "#d0d0d0";
  bCtx.fillRect(0, 0, width, height);

  // Subtle vertical panel seam lines (every 256px = 1.2m modular panel)
  const panelSeamX = [0, 256];
  for (const sx of panelSeamX) {
    // Seam shadow line
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(sx, 0, 2, height);
    // Seam highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(sx + 2, 0, 1, height);

    // Bump groove
    bCtx.fillStyle = "#202020";
    bCtx.fillRect(sx, 0, 3, height);
  }

  // Micro eggshell stipple grain
  for (let i = 0; i < 600; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.45)" : "rgba(203, 213, 225, 0.35)";
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const wallMap = new THREE.CanvasTexture(mapCanvas);
  wallMap.wrapS = THREE.RepeatWrapping;
  wallMap.wrapT = THREE.RepeatWrapping;
  wallMap.repeat.set(6, 1);

  const wallBump = new THREE.CanvasTexture(bumpCanvas);
  wallBump.wrapS = THREE.RepeatWrapping;
  wallBump.wrapT = THREE.RepeatWrapping;
  wallBump.repeat.set(6, 1);

  textureCache.wallMap = wallMap;
  textureCache.wallBump = wallBump;

  return { map: wallMap, bumpMap: wallBump };
}

/**
 * Suspended Acoustic Ceiling Grid Texture
 * Armstrong 600x600mm acoustic drop-ceiling tiles with aluminum T-bars and micro-perforations.
 */
export function getAcousticCeilingTexture(): THREE.CanvasTexture {
  if (textureCache.ceilingMap) return textureCache.ceilingMap;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Light off-white acoustic base
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, size, size);

  // 2x2 tile grid T-bar metal runners
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, 0, size, 4);
  ctx.fillRect(0, 254, size, 4);
  ctx.fillRect(0, 0, 4, size);
  ctx.fillRect(254, 0, 4, size);

  // Metallic T-bar center line
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(0, 255, size, 1.5);
  ctx.fillRect(255, 0, 1.5, size);

  // Micro acoustic fissure perforations
  ctx.fillStyle = "rgba(100, 116, 139, 0.38)";
  for (let i = 0; i < 800; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    if (px % 256 > 6 && py % 256 > 6) {
      ctx.beginPath();
      ctx.arc(px, py, 0.6 + Math.random() * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const ceilingMap = new THREE.CanvasTexture(canvas);
  ceilingMap.wrapS = THREE.RepeatWrapping;
  ceilingMap.wrapT = THREE.RepeatWrapping;
  ceilingMap.repeat.set(11, 13);

  textureCache.ceilingMap = ceilingMap;
  return ceilingMap;
}

/**
 * Solid Phenolic / Epoxy Chemical Resin Benchtop Texture
 * Dark satin sheen with fine micro-granite particulate.
 */
export function getResinWorktopTexture(): THREE.CanvasTexture {
  if (textureCache.resinWorktopMap) return textureCache.resinWorktopMap;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#111418";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 900; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.6 ? "rgba(51, 65, 85, 0.4)" : "rgba(30, 41, 59, 0.5)";
    ctx.fillRect(rx, ry, 1, 1);
  }

  const resinMap = new THREE.CanvasTexture(canvas);
  resinMap.wrapS = THREE.RepeatWrapping;
  resinMap.wrapT = THREE.RepeatWrapping;
  resinMap.repeat.set(4, 2);

  textureCache.resinWorktopMap = resinMap;
  return resinMap;
}

/**
 * Yellow & Black Diagonal Chevron Safety Hazard Floor Border Tape
 */
export function getSafetyHazardTapeTexture(): THREE.CanvasTexture {
  if (textureCache.hazardTapeMap) return textureCache.hazardTapeMap;

  const width = 256;
  const height = 64;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#eab308"; // Safety yellow
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f172a"; // Charcoal black stripes
  const stripeWidth = 32;
  for (let x = -height; x < width + height; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth - height, height);
    ctx.lineTo(x - height, height);
    ctx.closePath();
    ctx.fill();
  }

  const hazardMap = new THREE.CanvasTexture(canvas);
  hazardMap.wrapS = THREE.RepeatWrapping;
  hazardMap.wrapT = THREE.RepeatWrapping;
  hazardMap.repeat.set(4, 1);

  textureCache.hazardTapeMap = hazardMap;
  return hazardMap;
}

/**
 * High-Resolution IUPAC Periodic Table of Elements Canvas Texture (1024 x 576)
 * Real element symbols, atomic numbers, color-coded chemical series, and sharp typography.
 */
export function getPeriodicTableTexture(): THREE.CanvasTexture {
  if (textureCache.periodicTableMap) return textureCache.periodicTableMap;

  const width = 1024;
  const height = 576;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Dark scientific background
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, width, height);

  // Outer border & frame
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Header Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PERIODIC TABLE OF THE ELEMENTS", 32, 38);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "10px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("INTERNATIONAL UNION OF PURE AND APPLIED CHEMISTRY (IUPAC) // MAGE LABS", 32, 54);

  // Color Category Palette
  const categories: Record<string, { color: string; label: string }> = {
    alkali: { color: "#ef4444", label: "Alkali Metals" },
    alkaline: { color: "#f97316", label: "Alkaline Earth" },
    transition: { color: "#eab308", label: "Transition Metals" },
    postTransition: { color: "#10b981", label: "Post-Transition" },
    metalloid: { color: "#14b8a6", label: "Metalloids" },
    nonmetal: { color: "#3b82f6", label: "Reactive Nonmetals" },
    halogen: { color: "#6366f1", label: "Halogens" },
    noble: { color: "#8b5cf6", label: "Noble Gases" },
    lanthanide: { color: "#ec4899", label: "Lanthanides" },
    actinide: { color: "#f43f5e", label: "Actinides" },
  };

  // Render Legend
  const legendKeys = Object.keys(categories);
  const legendStartX = 460;
  legendKeys.forEach((key, idx) => {
    const lx = legendStartX + (idx % 5) * 110;
    const ly = 24 + Math.floor(idx / 5) * 18;
    const item = categories[key];

    ctx.fillStyle = item.color;
    ctx.fillRect(lx, ly, 10, 10);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(item.label, lx + 14, ly + 9);
  });

  // Element layout: 18 columns, 7 main rows, 2 f-block rows
  const cellW = 50;
  const cellH = 50;
  const gridStartX = 30;
  const gridStartY = 76;

  // Selected essential and representative elements with atomic number, symbol, category
  interface ElementDef {
    col: number; // 0 to 17
    row: number; // 0 to 6
    num: number;
    sym: string;
    cat: string;
    mass: string;
  }

  const elements: ElementDef[] = [
    // Period 1
    { col: 0, row: 0, num: 1, sym: "H", cat: "nonmetal", mass: "1.008" },
    { col: 17, row: 0, num: 2, sym: "He", cat: "noble", mass: "4.003" },
    // Period 2
    { col: 0, row: 1, num: 3, sym: "Li", cat: "alkali", mass: "6.941" },
    { col: 1, row: 1, num: 4, sym: "Be", cat: "alkaline", mass: "9.012" },
    { col: 12, row: 1, num: 5, sym: "B", cat: "metalloid", mass: "10.81" },
    { col: 13, row: 1, num: 6, sym: "C", cat: "nonmetal", mass: "12.01" },
    { col: 14, row: 1, num: 7, sym: "N", cat: "nonmetal", mass: "14.01" },
    { col: 15, row: 1, num: 8, sym: "O", cat: "nonmetal", mass: "16.00" },
    { col: 16, row: 1, num: 9, sym: "F", cat: "halogen", mass: "19.00" },
    { col: 17, row: 1, num: 10, sym: "Ne", cat: "noble", mass: "20.18" },
    // Period 3
    { col: 0, row: 2, num: 11, sym: "Na", cat: "alkali", mass: "22.99" },
    { col: 1, row: 2, num: 12, sym: "Mg", cat: "alkaline", mass: "24.31" },
    { col: 12, row: 2, num: 13, sym: "Al", cat: "postTransition", mass: "26.98" },
    { col: 13, row: 2, num: 14, sym: "Si", cat: "metalloid", mass: "28.09" },
    { col: 14, row: 2, num: 15, sym: "P", cat: "nonmetal", mass: "30.97" },
    { col: 15, row: 2, num: 16, sym: "S", cat: "nonmetal", mass: "32.06" },
    { col: 16, row: 2, num: 17, sym: "Cl", cat: "halogen", mass: "35.45" },
    { col: 17, row: 2, num: 18, sym: "Ar", cat: "noble", mass: "39.95" },
    // Period 4
    { col: 0, row: 3, num: 19, sym: "K", cat: "alkali", mass: "39.10" },
    { col: 1, row: 3, num: 20, sym: "Ca", cat: "alkaline", mass: "40.08" },
    { col: 2, row: 3, num: 21, sym: "Sc", cat: "transition", mass: "44.96" },
    { col: 3, row: 3, num: 22, sym: "Ti", cat: "transition", mass: "47.87" },
    { col: 4, row: 3, num: 23, sym: "V", cat: "transition", mass: "50.94" },
    { col: 5, row: 3, num: 24, sym: "Cr", cat: "transition", mass: "52.00" },
    { col: 6, row: 3, num: 25, sym: "Mn", cat: "transition", mass: "54.94" },
    { col: 7, row: 3, num: 26, sym: "Fe", cat: "transition", mass: "55.85" },
    { col: 8, row: 3, num: 27, sym: "Co", cat: "transition", mass: "58.93" },
    { col: 9, row: 3, num: 28, sym: "Ni", cat: "transition", mass: "58.69" },
    { col: 10, row: 3, num: 29, sym: "Cu", cat: "transition", mass: "63.55" },
    { col: 11, row: 3, num: 30, sym: "Zn", cat: "transition", mass: "65.38" },
    { col: 12, row: 3, num: 31, sym: "Ga", cat: "postTransition", mass: "69.72" },
    { col: 13, row: 3, num: 32, sym: "Ge", cat: "metalloid", mass: "72.63" },
    { col: 14, row: 3, num: 33, sym: "As", cat: "metalloid", mass: "74.92" },
    { col: 15, row: 3, num: 34, sym: "Se", cat: "nonmetal", mass: "78.96" },
    { col: 16, row: 3, num: 35, sym: "Br", cat: "halogen", mass: "79.90" },
    { col: 17, row: 3, num: 36, sym: "Kr", cat: "noble", mass: "83.80" },
    // Period 5
    { col: 0, row: 4, num: 37, sym: "Rb", cat: "alkali", mass: "85.47" },
    { col: 1, row: 4, num: 38, sym: "Sr", cat: "alkaline", mass: "87.62" },
    { col: 2, row: 4, num: 39, sym: "Y", cat: "transition", mass: "88.91" },
    { col: 3, row: 4, num: 40, sym: "Zr", cat: "transition", mass: "91.22" },
    { col: 4, row: 4, num: 41, sym: "Nb", cat: "transition", mass: "92.91" },
    { col: 5, row: 4, num: 42, sym: "Mo", cat: "transition", mass: "95.95" },
    { col: 6, row: 4, num: 43, sym: "Tc", cat: "transition", mass: "98.00" },
    { col: 7, row: 4, num: 44, sym: "Ru", cat: "transition", mass: "101.1" },
    { col: 8, row: 4, num: 45, sym: "Rh", cat: "transition", mass: "102.9" },
    { col: 9, row: 4, num: 46, sym: "Pd", cat: "transition", mass: "106.4" },
    { col: 10, row: 4, num: 47, sym: "Ag", cat: "transition", mass: "107.9" },
    { col: 11, row: 4, num: 48, sym: "Cd", cat: "transition", mass: "112.4" },
    { col: 12, row: 4, num: 49, sym: "In", cat: "postTransition", mass: "114.8" },
    { col: 13, row: 4, num: 50, sym: "Sn", cat: "postTransition", mass: "118.7" },
    { col: 14, row: 4, num: 51, sym: "Sb", cat: "metalloid", mass: "121.8" },
    { col: 15, row: 4, num: 52, sym: "Te", cat: "metalloid", mass: "127.6" },
    { col: 16, row: 4, num: 53, sym: "I", cat: "halogen", mass: "126.9" },
    { col: 17, row: 4, num: 54, sym: "Xe", cat: "noble", mass: "131.3" },
    // Period 6 Highlights
    { col: 0, row: 5, num: 55, sym: "Cs", cat: "alkali", mass: "132.9" },
    { col: 1, row: 5, num: 56, sym: "Ba", cat: "alkaline", mass: "137.3" },
    { col: 2, row: 5, num: 57, sym: "La*", cat: "lanthanide", mass: "138.9" },
    { col: 3, row: 5, num: 72, sym: "Hf", cat: "transition", mass: "178.5" },
    { col: 4, row: 5, num: 73, sym: "Ta", cat: "transition", mass: "180.9" },
    { col: 5, row: 5, num: 74, sym: "W", cat: "transition", mass: "183.8" },
    { col: 6, row: 5, num: 75, sym: "Re", cat: "transition", mass: "186.2" },
    { col: 7, row: 5, num: 76, sym: "Os", cat: "transition", mass: "190.2" },
    { col: 8, row: 5, num: 77, sym: "Ir", cat: "transition", mass: "192.2" },
    { col: 9, row: 5, num: 78, sym: "Pt", cat: "transition", mass: "195.1" },
    { col: 10, row: 5, num: 79, sym: "Au", cat: "transition", mass: "197.0" },
    { col: 11, row: 5, num: 80, sym: "Hg", cat: "transition", mass: "200.6" },
    { col: 12, row: 5, num: 81, sym: "Tl", cat: "postTransition", mass: "204.4" },
    { col: 13, row: 5, num: 82, sym: "Pb", cat: "postTransition", mass: "207.2" },
    { col: 14, row: 5, num: 83, sym: "Bi", cat: "postTransition", mass: "209.0" },
    { col: 15, row: 5, num: 84, sym: "Po", cat: "postTransition", mass: "209" },
    { col: 16, row: 5, num: 85, sym: "At", cat: "halogen", mass: "210" },
    { col: 17, row: 5, num: 86, sym: "Rn", cat: "noble", mass: "222" },
    // Period 7 Highlights
    { col: 0, row: 6, num: 87, sym: "Fr", cat: "alkali", mass: "223" },
    { col: 1, row: 6, num: 88, sym: "Ra", cat: "alkaline", mass: "226" },
    { col: 2, row: 6, num: 89, sym: "Ac**", cat: "actinide", mass: "227" },
    { col: 3, row: 6, num: 104, sym: "Rf", cat: "transition", mass: "267" },
    { col: 7, row: 6, num: 108, sym: "Hs", cat: "transition", mass: "277" },
    { col: 10, row: 6, num: 111, sym: "Rg", cat: "transition", mass: "282" },
    { col: 17, row: 6, num: 118, sym: "Og", cat: "noble", mass: "294" },
  ];

  // Draw background element placeholders for empty spots
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 18; c++) {
      if ((r === 0 && c > 0 && c < 17) || ((r === 1 || r === 2) && c > 1 && c < 12)) {
        continue;
      }
      const ex = gridStartX + c * (cellW + 3);
      const ey = gridStartY + r * (cellH + 3);

      ctx.fillStyle = "rgba(30, 41, 59, 0.4)";
      ctx.fillRect(ex, ey, cellW, cellH);
      ctx.strokeStyle = "rgba(71, 85, 105, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(ex, ey, cellW, cellH);
    }
  }

  // Draw defined elements
  elements.forEach((el) => {
    const ex = gridStartX + el.col * (cellW + 3);
    const ey = gridStartY + el.row * (cellH + 3);
    const cat = categories[el.cat] || { color: "#38bdf8" };

    // Cell background with category tint
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(ex, ey, cellW, cellH);

    // Top color band
    ctx.fillStyle = cat.color;
    ctx.fillRect(ex, ey, cellW, 3);

    // Border
    ctx.strokeStyle = cat.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(ex, ey, cellW, cellH);

    // Atomic number
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(`${el.num}`, ex + 3, ey + 12);

    // Element symbol
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(el.sym, ex + cellW / 2, ey + 28);
    ctx.textAlign = "start";

    // Mass
    ctx.fillStyle = "#64748b";
    ctx.font = "7px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(el.mass, ex + 3, ey + cellH - 3);
  });

  const periodicMap = new THREE.CanvasTexture(canvas);
  textureCache.periodicTableMap = periodicMap;
  return periodicMap;
}

/**
 * OSHA Emergency Eyewash & Shower Safety Station Wall Plaque Texture
 */
export function getSafetySignTexture(): THREE.CanvasTexture {
  if (textureCache.safetySignMap) return textureCache.safetySignMap;

  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Green safety header
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, 0, width, 72);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("EMERGENCY", width / 2, 48);

  // White main body
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 72, width, height - 72);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("EYEWASH & SHOWER STATION", width / 2, 118);

  ctx.fillStyle = "#475569";
  ctx.font = "14px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("KEEP CLEAR AT ALL TIMES // 36 INCH CLEARANCE", width / 2, 150);

  // Emergency Cross Icon
  ctx.fillStyle = "#15803d";
  ctx.fillRect(width / 2 - 20, 175, 40, 12);
  ctx.fillRect(width / 2 - 6, 161, 12, 40);

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  const signMap = new THREE.CanvasTexture(canvas);
  textureCache.safetySignMap = signMap;
  return signMap;
}

/**
 * Laboratory Entrance Door Caution & NFPA 704 Placard Texture
 */
export function getDoorSafetySignTexture(): THREE.CanvasTexture {
  if (textureCache.doorSignMap) return textureCache.doorSignMap;

  const width = 256;
  const height = 384;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Yellow caution header
  ctx.fillStyle = "#eab308";
  ctx.fillRect(0, 0, width, 54);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CAUTION", width / 2, 36);

  // White placard body
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 54, width, height - 54);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("CHEMICAL LABORATORY", width / 2, 82);

  ctx.fillStyle = "#475569";
  ctx.font = "10px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("EYE & SKIN PROTECTION REQUIRED", width / 2, 102);

  // NFPA 704 Diamond in center
  const cx = width / 2;
  const cy = 180;
  const diamondSize = 40;

  // Blue: Health 3
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.moveTo(cx - diamondSize, cy);
  ctx.lineTo(cx, cy - diamondSize);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - diamondSize, cy);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("3", cx - diamondSize / 2, cy - diamondSize / 4 + 6);

  // Red: Flammability 2
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(cx, cy - diamondSize);
  ctx.lineTo(cx + diamondSize, cy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx, cy - diamondSize);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("2", cx + diamondSize / 4 - 3, cy - diamondSize / 2);

  // Yellow: Reactivity 1
  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.moveTo(cx + diamondSize, cy);
  ctx.lineTo(cx, cy + diamondSize);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + diamondSize, cy);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.fillText("1", cx + diamondSize / 2, cy + diamondSize / 4 + 6);

  // White: Special Hazard (W with slash)
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(cx, cy + diamondSize);
  ctx.lineTo(cx - diamondSize, cy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx, cy + diamondSize);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 12px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("W", cx - diamondSize / 4 + 2, cy + diamondSize / 2);

  // Border
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  const doorSignMap = new THREE.CanvasTexture(canvas);
  textureCache.doorSignMap = doorSignMap;
  return doorSignMap;
}
