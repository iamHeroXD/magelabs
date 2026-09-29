"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ChemistryRoom3D } from "./ChemistryRoom3D";
import { BuretteAssembly3D } from "./equipment/BuretteAssembly3D";
import { TitrationFlask3D } from "./equipment/TitrationFlask3D";
import { DigitalPhMeter3D } from "./equipment/DigitalPhMeter3D";
import { ReagentBottles3D } from "./equipment/ReagentBottles3D";
import { AnalyticalBalance3D } from "./equipment/AnalyticalBalance3D";
import { PlayerController } from "./PlayerController";
import { InspectionCamera } from "./InspectionCamera";

interface ChemistrySceneProps {
  dispensedMl: number;
  currentPh: number;
  solutionColor: string;
  hasIndicator: boolean;
  stopcockAngle: number;
  isStopcockOpen: boolean;
  isInspecting: boolean;
  highlightedApparatus: string | null;
  onToggleStopcock: () => void;
  onAddIndicator: () => void;
  onHoverObject: (label: string | null) => void;
  onInteract: () => void;
}

export function ChemistryScene({
  dispensedMl,
  currentPh,
  solutionColor,
  hasIndicator,
  stopcockAngle,
  isStopcockOpen,
  isInspecting,
  highlightedApparatus,
  onToggleStopcock,
  onAddIndicator,
  onHoverObject,
  onInteract,
}: ChemistrySceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0a0c]">
      <Canvas
        camera={{ position: [0, 1.65, 1.8], fov: 60 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Natural Ambient & Hemisphere Fill Lighting */}
        <ambientLight intensity={0.95} color="#ffffff" />
        <hemisphereLight args={["#f8fafc", "#334155", 0.75]} />

        {/* Directional Daylight through Windows */}
        <directionalLight
          position={[0, 5, -5]}
          intensity={1.9}
          color="#fef3c7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Spot task light right over the titration apparatus */}
        <spotLight
          position={[0, 2.6, 0.4]}
          target-position={[0, 0.94, 0]}
          intensity={2.8}
          angle={0.65}
          penumbra={0.5}
          color="#ffffff"
          castShadow
        />

        {/* 1. Laboratory Room Architecture, Walls, Furniture & Windows */}
        <ChemistryRoom3D />

        {/* 2. Central Bench Titration Experiment Station (Y = 0.94m benchtop) */}
        <group position={[0, 0.94, 0]}>
          {/* Glass Burette Assembly & Retort Stand */}
          <BuretteAssembly3D
            dispensedMl={dispensedMl}
            stopcockAngle={stopcockAngle}
            isFlowing={isStopcockOpen}
            onToggleStopcock={onToggleStopcock}
            isHighlighted={highlightedApparatus === "burette"}
          />

          {/* Erlenmeyer Flask with Dynamic Fluid & Phenolphthalein Color */}
          <TitrationFlask3D
            totalVolumeMl={25.0 + dispensedMl}
            solutionColor={solutionColor}
            hasIndicator={hasIndicator}
            isStirring={true}
            isHighlighted={highlightedApparatus === "flask"}
          />

          {/* Benchtop Digital pH Meter & Electrode */}
          <DigitalPhMeter3D
            currentPh={currentPh}
            isHighlighted={highlightedApparatus === "ph-meter"}
          />

          {/* Reagent Dropper Bottles & Wash Bottle */}
          <ReagentBottles3D
            onAddIndicator={onAddIndicator}
            hasIndicator={hasIndicator}
            isIndicatorHighlighted={highlightedApparatus === "indicator"}
          />

          {/* Precision Analytical Balance on right side of island bench */}
          <AnalyticalBalance3D />
        </group>

        {/* 3. Player First-Person Controller with WASD & Capsule Collision */}
        <PlayerController
          isInspecting={isInspecting}
          onInteract={onInteract}
          onHoverObject={onHoverObject}
        />

        {/* 4. Inspection Camera Dolly */}
        <InspectionCamera isInspecting={isInspecting} />
      </Canvas>
    </div>
  );
}
