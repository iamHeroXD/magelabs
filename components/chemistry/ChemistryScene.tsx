"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { ChemistryRoom3D } from "./ChemistryRoom3D";
import { BuretteAssembly3D } from "./equipment/BuretteAssembly3D";
import { TitrationFlask3D } from "./equipment/TitrationFlask3D";
import { DigitalPhMeter3D } from "./equipment/DigitalPhMeter3D";
import { ReagentBottles3D } from "./equipment/ReagentBottles3D";
import { AnalyticalBalance3D } from "./equipment/AnalyticalBalance3D";
import { HotplateStirrer3D } from "./equipment/HotplateStirrer3D";
import { Centrifuge3D } from "./equipment/Centrifuge3D";
import { InteractiveVessels, LabVesselState } from "./equipment/InteractiveVessels";
import { HandHeldVessel3D } from "./HandHeldVessel3D";
import { FirstPersonHands3D } from "./FirstPersonHands3D";
import { LabRobotAvatar3D, RobotTask } from "./avatar/LabRobotAvatar3D";
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
  ceilingLightsOn: boolean;
  taskLightOn: boolean;
  vessels: LabVesselState[];
  heldVesselId: string | null;
  isPouring: boolean;
  activeRobotTask: RobotTask;
  onOpenRobotMenu: () => void;
  onRobotTaskComplete?: (task: RobotTask) => void;
  onToggleStopcock: () => void;
  onAddIndicator: () => void;
  onToggleCeilingLights: () => void;
  onToggleTaskLight: () => void;
  onPickUpVessel: (id: string) => void;
  onPourIntoVessel: (targetId: string) => void;
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
  ceilingLightsOn,
  taskLightOn,
  vessels,
  heldVesselId,
  isPouring,
  activeRobotTask,
  onOpenRobotMenu,
  onRobotTaskComplete,
  onToggleStopcock,
  onAddIndicator,
  onToggleCeilingLights,
  onToggleTaskLight,
  onPickUpVessel,
  onPourIntoVessel,
  onHoverObject,
  onInteract,
}: ChemistrySceneProps) {
  const heldVessel = vessels.find((v) => v.id === heldVesselId) || null;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070709]">
      <Canvas
        camera={{ position: [0, 1.48, 0.96], fov: 52 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: ceilingLightsOn ? 1.25 : 0.85,
        }}
      >
        {/* Photorealistic Studio PBR HDRI Environment Reflections */}
        <Environment preset="city" />

        {/* Ambient & Sky/Ground Hemisphere Fill */}
        <ambientLight intensity={ceilingLightsOn ? 0.95 : 0.35} color="#ffffff" />
        <hemisphereLight
          args={["#f8fafc", "#1e293b", ceilingLightsOn ? 0.75 : 0.25]}
        />

        {/* Natural Directional Sunlight through Windows */}
        <directionalLight
          position={[0, 5, -5]}
          intensity={1.8}
          color="#fef3c7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Task Workstation Spotlight (Controlled by bench wall switch) */}
        {taskLightOn && (
          <spotLight
            position={[0, 2.7, 0.4]}
            target-position={[0, 0.94, 0]}
            intensity={3.2}
            angle={0.65}
            penumbra={0.4}
            color="#ffffff"
            castShadow
          />
        )}

        {/* 1. Laboratory Room Architecture & Walls */}
        <ChemistryRoom3D
          ceilingLightsOn={ceilingLightsOn}
          taskLightOn={taskLightOn}
          onToggleCeiling={onToggleCeilingLights}
          onToggleTask={onToggleTaskLight}
        />

        {/* 2. Central Island Workbench Apparatus (Y = 0.94 m) */}
        <group position={[0, 0.94, 0]}>
          {/* Flagship Burette Assembly & Retort Stand */}
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

          {/* Precision Analytical Balance */}
          <AnalyticalBalance3D />

          {/* Interactive Magnetic Hotplate Stirrer */}
          <HotplateStirrer3D position={[-0.95, 0.005, -0.15]} />

          {/* Interactive Benchtop Centrifuge */}
          <Centrifuge3D position={[1.45, 0.005, -0.15]} />

          {/* Pickable / Pourable Vessels on Island Bench */}
          <InteractiveVessels
            vessels={vessels}
            heldVesselId={heldVesselId}
            onPickUpVessel={onPickUpVessel}
            onPourIntoVessel={onPourIntoVessel}
          />
        </group>

        {/* 3. Autonomous AI Laboratory Robot Avatar (AURA) */}
        <LabRobotAvatar3D
          onOpenMenu={onOpenRobotMenu}
          activeTask={activeRobotTask}
          onTaskComplete={onRobotTaskComplete}
        />

        {/* 4. Dual First-Person Nitrile Lab Gloves */}
        <FirstPersonHands3D
          heldVessel={heldVessel}
          isPouring={isPouring}
          isInspecting={isInspecting}
        />

        {/* 5. Hand-Held Carried Vessel in First-Person Camera View */}
        <HandHeldVessel3D heldVessel={heldVessel} isPouring={isPouring} />

        {/* 6. Player First-Person Controller with WASD, Capsule Collision, & Raycasting */}
        <PlayerController
          isInspecting={isInspecting}
          onInteract={onInteract}
          onHoverObject={onHoverObject}
        />

        {/* 7. Inspection Camera Dolly */}
        <InspectionCamera isInspecting={isInspecting} />
      </Canvas>
    </div>
  );
}
