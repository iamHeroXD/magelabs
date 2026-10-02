"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload models on client-side to prevent render hiccups
if (typeof window !== "undefined") {
  useGLTF.preload("/models/100_Beaker.glb");
  useGLTF.preload("/models/250_Beaker.glb");
  useGLTF.preload("/models/500_Beaker.glb");
  useGLTF.preload("/models/conical_flask_small.glb");
  useGLTF.preload("/models/conical_flask_mid.glb");
  useGLTF.preload("/models/conical_flask_big.glb");
  useGLTF.preload("/models/burette_stand.glb");
  useGLTF.preload("/models/wash_bottle.glb");
  useGLTF.preload("/models/funnel.glb");
  useGLTF.preload("/models/round_bottom_flasks.glb");
  useGLTF.preload("/models/measuring_cylinder_ADAP.glb");
  useGLTF.preload("/models/test_tube_rack.glb");
  useGLTF.preload("/models/test_tube.glb");
  useGLTF.preload("/models/volumetric_flask_100ml.glb");
  useGLTF.preload("/models/volumetric_flask_100ml_ADAP.glb");
  useGLTF.preload("/models/volumetric_flask_250ml.glb");
  useGLTF.preload("/models/volumetric_flask_250ml_ADAP.glb");
  useGLTF.preload("/models/volumetric_flask_500ml.glb");
  useGLTF.preload("/models/volumetric_flask_500ml_ADAP.glb");
}

/**
 * Clones a GLTF scene and configures shadow/materials safely
 */
function useClonedGLTF(path: string, options?: { isHighlighted?: boolean; highlightColor?: string }) {
  const { scene } = useGLTF(path);

  const cloned = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        if (options?.isHighlighted && mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat.color) {
            mat.emissive = new THREE.Color(options.highlightColor || "#38bdf8");
            mat.emissiveIntensity = 0.45;
          }
        }
      }
    });
    return root;
  }, [scene, options?.isHighlighted, options?.highlightColor]);

  return cloned;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REALISTIC LABORATORY BEAKER (100 mL, 250 mL, 500 mL)
// ─────────────────────────────────────────────────────────────────────────────
export function BeakerGLB({
  size = 250,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isHighlighted = false,
}: {
  size?: 100 | 250 | 500;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const modelFile = size === 100 ? "/models/100_Beaker.glb" : size === 500 ? "/models/500_Beaker.glb" : "/models/250_Beaker.glb";
  const scene = useClonedGLTF(modelFile, { isHighlighted });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONICAL ERLENMEYER FLASK (Small, Mid, Big)
// ─────────────────────────────────────────────────────────────────────────────
export function ConicalFlaskGLB({
  size = "small",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isHighlighted = false,
}: {
  size?: "small" | "mid" | "big";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const modelFile =
    size === "big"
      ? "/models/conical_flask_big.glb"
      : size === "mid"
      ? "/models/conical_flask_mid.glb"
      : "/models/conical_flask_small.glb";

  const scene = useClonedGLTF(modelFile, { isHighlighted });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LABORATORY BURETTE RETORT STAND
// ─────────────────────────────────────────────────────────────────────────────
export function BuretteStandGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isHighlighted = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const scene = useClonedGLTF("/models/burette_stand.glb", { isHighlighted });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISTILLED WATER WASH BOTTLE (With Red Cap & Delivery Spout)
// ─────────────────────────────────────────────────────────────────────────────
export function WashBottleGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.32,
  isHighlighted = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const scene = useClonedGLTF("/models/wash_bottle.glb", { isHighlighted });

  return (
    <group position={position} rotation={rotation}>
      {/* Offset centering of wash bottle body (center x = -0.14) */}
      <group position={[0.045, 0, 0]} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VOLUMETRIC FLASK WITH GROUND GLASS STOPPER (100 mL, 250 mL, 500 mL)
// ─────────────────────────────────────────────────────────────────────────────
export function VolumetricFlaskGLB({
  size = 250,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withStopper = true,
  isHighlighted = false,
}: {
  size?: 100 | 250 | 500;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  withStopper?: boolean;
  isHighlighted?: boolean;
}) {
  const flaskFile =
    size === 100
      ? "/models/volumetric_flask_100ml.glb"
      : size === 500
      ? "/models/volumetric_flask_500ml.glb"
      : "/models/volumetric_flask_250ml.glb";

  const stopperFile =
    size === 100
      ? "/models/volumetric_flask_100ml_ADAP.glb"
      : size === 500
      ? "/models/volumetric_flask_500ml_ADAP.glb"
      : "/models/volumetric_flask_250ml_ADAP.glb";

  const flaskScene = useClonedGLTF(flaskFile, { isHighlighted });
  const stopperScene = useClonedGLTF(stopperFile);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={flaskScene} />
      {withStopper && <primitive object={stopperScene} />}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ROUND BOTTOM BOILING FLASK WITH STAND
// ─────────────────────────────────────────────────────────────────────────────
export function RoundBottomFlaskGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isHighlighted = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const scene = useClonedGLTF("/models/round_bottom_flasks.glb", { isHighlighted });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LABORATORY FILTER FUNNEL
// ─────────────────────────────────────────────────────────────────────────────
export function FunnelGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isHighlighted = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const scene = useClonedGLTF("/models/funnel.glb", { isHighlighted });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. GRADUATED MEASURING CYLINDER
// ─────────────────────────────────────────────────────────────────────────────
export function MeasuringCylinderGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.00022,
  isHighlighted = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
}) {
  const scene = useClonedGLTF("/models/measuring_cylinder_ADAP.glb", { isHighlighted });

  return (
    <group position={position} rotation={rotation}>
      <group position={[0.0016, 0, 0]} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. LABORATORY TEST TUBE RACK & TEST TUBES
// ─────────────────────────────────────────────────────────────────────────────
export function TestTubeRackGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.105,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const scene = useClonedGLTF("/models/test_tube_rack.glb");

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export function TestTubeGLB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.105,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const scene = useClonedGLTF("/models/test_tube.glb");

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
