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
import { TestTubeRack3D } from "./equipment/TestTubeRack3D";
import { PipetteCarousel3D } from "./equipment/PipetteCarousel3D";
import { BenchAccessories3D } from "./equipment/BenchAccessories3D";
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
  inspectViewMode?: "overview" | "meniscus" | "flask";
  flowRateMode?: "closed" | "dropwise" | "stream";
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
  onFlaskClick?: () => void;
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
  inspectViewMode = "overview",
  flowRateMode = "closed",
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
  onFlaskClick,
  onHoverObject,
  onInteract,
}: ChemistrySceneProps) {
  const heldVessel = vessels.find((v) => v.id === heldVesselId) || null;

  // Analytical balance live mass calculation (empty beaker tare 42.1580 g + fluid mass)
  const balanceVessel = vessels.find(
    (v) => Math.hypot(v.position[0] - 0.68, v.position[2] - (-0.08)) < 0.18
  );
  const balanceWeightG = balanceVessel ? 42.1580 + balanceVessel.currentVolumeMl * 1.002 : 0.0;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070709]">
      <Canvas
        camera={{ position: [0, 1.48, 1.38], fov: 58 }}
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
            flowRateMode={flowRateMode}
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
            onClick={onFlaskClick}
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
          <AnalyticalBalance3D
            currentWeightG={balanceWeightG}
            position={[0.68, 0.005, -0.08]}
            rotation={[0, -0.15, 0]}
          />

          {/* 6-Well Chemical Reaction Test Tube Rack */}
          <TestTubeRack3D
            position={[-0.18, 0.005, -0.16]}
            rotation={[0, 0.1, 0]}
            heldVesselId={heldVesselId}
            onPickUpTube={(tube) => onPickUpVessel(tube.id)}
            onPourIntoTube={(tubeId) => onPourIntoVessel(tubeId)}
          />

          {/* Rotating Micropipette Carousel & Sterile Tip Box */}
          <PipetteCarousel3D
            position={[-0.46, 0.005, -0.16]}
            rotation={[0, -0.2, 0]}
          />

          {/* Authentic Workbench Accessories: Spot Plate, Watch Glass, Spatula, Timer */}
          <BenchAccessories3D
            position={[0.08, 0.005, -0.15]}
            rotation={[0, 0, 0]}
          />

          {/* Interactive Magnetic Hotplate Stirrer */}
          <HotplateStirrer3D position={[-0.82, 0.005, -0.08]} rotation={[0, 0.25, 0]} />

          {/* Interactive Benchtop Centrifuge */}
          <Centrifuge3D position={[1.15, 0.005, -0.08]} rotation={[0, -0.28, 0]} />

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
        <InspectionCamera isInspecting={isInspecting} viewMode={inspectViewMode} />
      </Canvas>
    </div>
  );
}
