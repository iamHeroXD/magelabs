"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { calculateTitrationEquilibrium, calculateUnknownMolarity } from "@/lib/chemistry/engine";
import { mixSolutions } from "@/lib/chemistry/solutions";
import { TitrationTrial } from "@/lib/chemistry/types";
import { LabVesselState } from "@/components/chemistry/equipment/InteractiveVessels";
import { ChemistryHUD } from "@/components/chemistry/ChemistryHUD";
import { ChemistryNotebook } from "@/components/chemistry/ChemistryNotebook";
import { ChemistryAIAssistant } from "@/components/chemistry/ChemistryAIAssistant";
import { RobotTask } from "@/components/chemistry/avatar/LabRobotAvatar3D";
import { RobotMenuModal } from "@/components/chemistry/avatar/RobotMenuModal";
import { InspectViewMode } from "@/components/chemistry/InspectionCamera";
import { chemistryAudio } from "@/lib/audio/chemistry-audio";

const ChemistryScene = dynamic(
  () => import("@/components/chemistry/ChemistryScene").then((m) => m.ChemistryScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-zinc-400 font-mono">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mb-4" />
        <span className="text-xs uppercase tracking-widest text-zinc-200">
          ENTERING CHEMISTRY LABORATORY // STAGE 02
        </span>
        <span className="text-[11px] text-zinc-500 mt-1">
          Loading 1:1 architecture, glassware transmission shaders, and stoichiometry solver...
        </span>
      </div>
    ),
  }
);

const INITIAL_VESSELS: LabVesselState[] = [
  {
    id: "beaker-cu",
    name: "Copper(II) Sulfate",
    type: "beaker",
    capacityMl: 100,
    currentVolumeMl: 45,
    solutionId: "cuso4",
    solutionColor: "#0284c7", // Vivid azure blue
    pH: 4.2,
    position: [-0.52, 0.005, 0.22],
  },
  {
    id: "beaker-acid",
    name: "Hydrochloric Acid",
    type: "beaker",
    capacityMl: 100,
    currentVolumeMl: 50,
    solutionId: "hcl",
    solutionColor: "#f8fafc", // Clear
    pH: 1.0,
    position: [-0.32, 0.005, 0.24],
  },
  {
    id: "beaker-universal",
    name: "Universal Indicator",
    type: "dropper",
    capacityMl: 50,
    currentVolumeMl: 25,
    solutionId: "universal",
    solutionColor: "#16a34a", // Green
    pH: 7.0,
    indicator: "universal",
    position: [-0.14, 0.005, 0.26],
  },
  {
    id: "beaker-base",
    name: "Sodium Hydroxide",
    type: "beaker",
    capacityMl: 100,
    currentVolumeMl: 50,
    solutionId: "naoh",
    solutionColor: "#f8fafc",
    pH: 13.0,
    position: [0.32, 0.005, 0.24],
  },
  {
    id: "cylinder-water",
    name: "Deionized Water",
    type: "cylinder",
    capacityMl: 50,
    currentVolumeMl: 30,
    solutionId: "water",
    solutionColor: "#f8fafc",
    pH: 7.0,
    position: [0.52, 0.005, 0.22],
  },
  {
    id: "hotplate-beaker",
    name: "Reaction Beaker (Hotplate)",
    type: "beaker",
    capacityMl: 100,
    currentVolumeMl: 35,
    solutionId: "water",
    solutionColor: "#f8fafc",
    pH: 7.0,
    temperatureC: 25.0,
    position: [-0.82, 0.105, -0.12],
  },
  {
    id: "beaker-balance",
    name: "Tared Analytical Beaker",
    type: "beaker",
    capacityMl: 50,
    currentVolumeMl: 25,
    solutionId: "water",
    solutionColor: "#f8fafc",
    pH: 7.0,
    temperatureC: 25.0,
    position: [0.68, 0.08, -0.08], // On the analytical balance pan
  },
  {
    id: "tube-kmno4",
    name: "Potassium Permanganate",
    type: "cylinder",
    capacityMl: 25,
    currentVolumeMl: 15,
    solutionId: "kmno4",
    solutionColor: "#6b21a8", // Intense violet
    pH: 6.8,
    position: [-0.305, 0.015, -0.145],
  },
  {
    id: "tube-fecl3",
    name: "Iron(III) Chloride",
    type: "cylinder",
    capacityMl: 25,
    currentVolumeMl: 18,
    solutionId: "fecl3",
    solutionColor: "#d97706", // Amber gold
    pH: 2.1,
    position: [-0.255, 0.015, -0.145],
  },
  {
    id: "tube-cuso4",
    name: "Copper(II) Sulfate (Tube)",
    type: "cylinder",
    capacityMl: 25,
    currentVolumeMl: 20,
    solutionId: "cuso4",
    solutionColor: "#0284c7", // Azure blue
    pH: 4.2,
    position: [-0.205, 0.015, -0.145],
  },
  {
    id: "tube-niso4",
    name: "Nickel(II) Sulfate",
    type: "cylinder",
    capacityMl: 25,
    currentVolumeMl: 16,
    solutionId: "niso4",
    solutionColor: "#059669", // Emerald green
    pH: 5.5,
    position: [-0.155, 0.015, -0.145],
  },
  {
    id: "tube-mo",
    name: "Methyl Orange",
    type: "dropper",
    capacityMl: 25,
    currentVolumeMl: 12,
    solutionId: "methyl_orange",
    solutionColor: "#ea580c", // Orange
    pH: 3.8,
    indicator: "universal",
    position: [-0.105, 0.015, -0.145],
  },
  {
    id: "tube-effervescent",
    name: "Reacting Carbonate Mix",
    type: "cylinder",
    capacityMl: 25,
    currentVolumeMl: 14,
    solutionId: "water",
    solutionColor: "#f8fafc",
    pH: 4.0,
    isReacting: true,
    position: [-0.055, 0.015, -0.145],
  },
];

export default function ChemistryLabPage() {
  // Stoichiometry & Titration State
  const [dispensedMl, setDispensedMl] = useState(0.0);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [stopcockAngle, setStopcockAngle] = useState(0);
  const [isStopcockOpen, setIsStopcockOpen] = useState(false);
  const [flowRateMode, setFlowRateMode] = useState<"closed" | "dropwise" | "stream">("closed");

  // Room & Lighting State
  const [ceilingLightsOn, setCeilingLightsOn] = useState(true);
  const [taskLightOn, setTaskLightOn] = useState(true);

  // Vessel Sandbox & Pouring State
  const [vessels, setVessels] = useState<LabVesselState[]>(INITIAL_VESSELS);
  const [heldVesselId, setHeldVesselId] = useState<string | null>(null);
  const [isPouring, setIsPouring] = useState(false);

  // Inspection & UI State
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectViewMode, setInspectViewMode] = useState<InspectViewMode>("overview");
  const [isSwirling, setIsSwirling] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [highlightedApparatus, setHighlightedApparatus] = useState<string | null>(null);
  const [trials, setTrials] = useState<TitrationTrial[]>([]);

  // AURA AI Autonomous Lab Robot State
  const [activeRobotTask, setActiveRobotTask] = useState<RobotTask>("idle");
  const [isRobotMenuOpen, setIsRobotMenuOpen] = useState(false);
  const robotTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fixed Standardized Chemistry Parameters
  const analyteVolumeMl = 25.0;
  const analyteConcentration = 0.100;
  const titrantConcentration = 0.100;

  // Compute live equilibrium state from chemical engine
  const equilibrium = useMemo(() => {
    return calculateTitrationEquilibrium(
      dispensedMl,
      analyteVolumeMl,
      analyteConcentration,
      titrantConcentration,
      hasIndicator
    );
  }, [dispensedMl, analyteVolumeMl, analyteConcentration, titrantConcentration, hasIndicator]);

  // Current Step (1..5)
  const currentStep = useMemo(() => {
    if (!isInspecting && dispensedMl === 0) return 1;
    if (!hasIndicator) return 2;
    if (dispensedMl < 24.5) return 3;
    if (equilibrium.isEndpoint && trials.length === 0) return 4;
    return 5;
  }, [isInspecting, hasIndicator, dispensedMl, equilibrium.isEndpoint, trials.length]);

  // Continuous fluid discharge when burette stopcock is open
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isStopcockOpen) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const flowRateMlPerSec = flowRateMode === "stream" ? 1.6 : 0.45;

    const animateFlow = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setDispensedMl((prev) => {
        const next = prev + flowRateMlPerSec * dt;
        if (next >= 50.0) {
          setIsStopcockOpen(false);
          setStopcockAngle(0);
          setFlowRateMode("closed");
          return 50.0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animateFlow);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animateFlow);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStopcockOpen, flowRateMode]);

  // Autonomous Robot Task Execution Handler
  const handleStartRobotTask = useCallback((task: RobotTask) => {
    setActiveRobotTask(task);
    chemistryAudio.playBeep();

    if (robotTimerRef.current) {
      clearTimeout(robotTimerRef.current);
    }

    if (task === "titrating") {
      // Step 1: Approach & add indicator at 1.5s
      setTimeout(() => {
        setHasIndicator(true);
        chemistryAudio.playLiquidDrop();
      }, 1500);

      // Step 2: Open stopcock at 3.0s
      setTimeout(() => {
        setIsStopcockOpen(true);
        setStopcockAngle(90);
        setFlowRateMode("stream");
        chemistryAudio.playStopcockClick();
      }, 3000);

      // Step 3: Exact equivalence point reached at 7.0s
      setTimeout(() => {
        setDispensedMl(25.0);
        setIsStopcockOpen(false);
        setStopcockAngle(0);
        setFlowRateMode("closed");
        chemistryAudio.playStopcockClick();
      }, 7000);

      // Step 4: Finish task at 8.0s
      robotTimerRef.current = setTimeout(() => {
        setActiveRobotTask("idle");
        chemistryAudio.playBeep();
      }, 8200);
    } else if (task === "heating") {
      // Robot heats hotplate beaker with CuSO4
      setTimeout(() => {
        chemistryAudio.playStopcockClick();
        setVessels((prev) =>
          prev.map((v) =>
            v.id === "hotplate-beaker"
              ? { ...v, solutionId: "cuso4", solutionColor: "#0284c7", currentVolumeMl: 55 }
              : v
          )
        );
      }, 2500);

      robotTimerRef.current = setTimeout(() => {
        setActiveRobotTask("idle");
        chemistryAudio.playBeep();
      }, 6500);
    } else if (task === "centrifuging") {
      robotTimerRef.current = setTimeout(() => {
        setActiveRobotTask("idle");
        chemistryAudio.playBeep();
      }, 6500);
    } else if (task === "cleaning") {
      // Reset all vessels and titration
      setTimeout(() => {
        setVessels(INITIAL_VESSELS);
        setDispensedMl(0.0);
        setHasIndicator(false);
        setIsStopcockOpen(false);
        setStopcockAngle(0);
        setFlowRateMode("closed");
        chemistryAudio.playGlassClink();
      }, 1800);

      robotTimerRef.current = setTimeout(() => {
        setActiveRobotTask("idle");
        chemistryAudio.playBeep();
      }, 4000);
    }
  }, []);

  const handleAbortRobotTask = useCallback(() => {
    if (robotTimerRef.current) {
      clearTimeout(robotTimerRef.current);
    }
    setIsStopcockOpen(false);
    setStopcockAngle(0);
    setFlowRateMode("closed");
    setActiveRobotTask("idle");
    chemistryAudio.playStopcockClick();
  }, []);

  // Handlers for Titration
  const handleDispenseSingleDrop = useCallback(() => {
    chemistryAudio.playLiquidDrop();
    setDispensedMl((prev) => Math.min(50.0, prev + 0.05));
  }, []);

  const handleSetFlowRateMode = useCallback((mode: "closed" | "dropwise" | "stream") => {
    setFlowRateMode(mode);
    if (mode === "closed") {
      setIsStopcockOpen(false);
      setStopcockAngle(0);
      chemistryAudio.playStopcockClick();
    } else {
      setIsStopcockOpen(true);
      setStopcockAngle(mode === "stream" ? 90 : 45);
      chemistryAudio.playStopcockClick();
      if (mode === "stream") {
        chemistryAudio.playPouringStream();
      } else {
        chemistryAudio.playLiquidDrop();
      }
    }
  }, []);

  const handleSwirlFlask = useCallback(() => {
    chemistryAudio.playStirrerHum();
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 1200);
  }, []);

  const handleToggleStopcock = useCallback(() => {
    chemistryAudio.playStopcockClick();
    if (isStopcockOpen) {
      setIsStopcockOpen(false);
      setStopcockAngle(0);
      setFlowRateMode("closed");
    } else {
      setIsStopcockOpen(true);
      setStopcockAngle(45);
      setFlowRateMode("dropwise");
      chemistryAudio.playLiquidDrop();
    }
  }, [isStopcockOpen]);

  const handleAddIndicator = useCallback(() => {
    chemistryAudio.playLiquidDrop();
    setHasIndicator(true);
  }, []);

  const handleResetTitration = useCallback(() => {
    chemistryAudio.playGlassClink();
    setIsStopcockOpen(false);
    setStopcockAngle(0);
    setFlowRateMode("closed");
    setDispensedMl(0.0);
  }, []);

  // Keyboard shortcut listener ('C' inspect, 'R' robot menu, '1-4' flow rates, 'Space' swirl)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas if any modal is active
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "KeyC") {
        setIsInspecting((prev) => !prev);
      }
      if (e.code === "KeyR") {
        if (heldVesselId) {
          setHeldVesselId(null);
          chemistryAudio.playGlassClink();
        } else {
          setIsRobotMenuOpen((prev) => !prev);
          chemistryAudio.playBeep();
        }
      }
      if (e.code === "Escape") {
        setIsRobotMenuOpen(false);
        setIsNotebookOpen(false);
        setIsAssistantOpen(false);
      }

      // Precision inspect mode shortcuts
      if (isInspecting) {
        if (e.code === "Digit1") {
          handleDispenseSingleDrop();
        } else if (e.code === "Digit2") {
          handleSetFlowRateMode("dropwise");
        } else if (e.code === "Digit3") {
          handleSetFlowRateMode("stream");
        } else if (e.code === "Digit4") {
          handleSetFlowRateMode("closed");
        } else if (e.code === "Space") {
          e.preventDefault();
          handleSwirlFlask();
        } else if (e.code === "KeyV") {
          // Cycle inspect view mode: overview -> meniscus -> flask -> overview
          setInspectViewMode((prev) =>
            prev === "overview" ? "meniscus" : prev === "meniscus" ? "flask" : "overview"
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [heldVesselId, isInspecting, handleDispenseSingleDrop, handleSetFlowRateMode, handleSwirlFlask]);

  // Initialize room ventilation hum on first user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      chemistryAudio.startVentilationHum();
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  // Vessel Picking & Pouring Sandbox Handlers
  const handlePickUpVessel = useCallback((id: string) => {
    chemistryAudio.playGlassClink();
    setHeldVesselId(id);
  }, []);

  const handleDropVessel = useCallback(() => {
    chemistryAudio.playGlassClink();
    setHeldVesselId(null);
  }, []);

  const handlePourIntoVessel = useCallback(
    (targetId: string) => {
      if (!heldVesselId || heldVesselId === targetId) return;

      const sourceVessel = vessels.find((v) => v.id === heldVesselId);
      const targetVessel = vessels.find((v) => v.id === targetId);
      if (!sourceVessel || !targetVessel || sourceVessel.currentVolumeMl <= 0) return;

      // Animate pouring motion and play sound
      setIsPouring(true);

      const isReactingPair = Math.abs(sourceVessel.pH - targetVessel.pH) > 2.5;
      if (isReactingPair) {
        chemistryAudio.playReactionFizz();
      } else {
        chemistryAudio.playLiquidDrop();
      }

      const pourAmountMl = Math.min(15, sourceVessel.currentVolumeMl);

      setTimeout(() => {
        setVessels((prev) => {
          return prev.map((v) => {
            if (v.id === heldVesselId) {
              return {
                ...v,
                currentVolumeMl: Math.max(0, v.currentVolumeMl - pourAmountMl),
              };
            }
            if (v.id === targetId) {
              const mixed = mixSolutions(
                {
                  volumeMl: pourAmountMl,
                  solutionId: sourceVessel.solutionId,
                  indicator: sourceVessel.indicator,
                },
                {
                  volumeMl: v.currentVolumeMl,
                  solutionId: v.solutionId,
                  indicator: v.indicator,
                }
              );
              const newTemp = Math.min(85, (v.temperatureC || 25.0) + (isReactingPair ? 15.0 : 0));
              return {
                ...v,
                currentVolumeMl: mixed.volumeMl,
                solutionId: mixed.solutionId,
                pH: mixed.pH,
                solutionColor: mixed.color,
                indicator: mixed.indicator,
                temperatureC: newTemp,
                isReacting: isReactingPair,
              };
            }
            return v;
          });
        });

        setIsPouring(false);

        if (isReactingPair) {
          setTimeout(() => {
            setVessels((prev) =>
              prev.map((v) => (v.id === targetId ? { ...v, isReacting: false } : v))
            );
          }, 3200);
        }
      }, 650);
    },
    [heldVesselId, vessels]
  );

  const handleFlaskClick = useCallback(() => {
    if (heldVesselId) {
      const source = vessels.find((v) => v.id === heldVesselId);
      if (!source || source.currentVolumeMl <= 0) return;

      setIsPouring(true);
      chemistryAudio.playLiquidDrop();

      if (source.indicator || source.solutionId === "universal") {
        setHasIndicator(true);
      }

      setVessels((prev) =>
        prev.map((v) =>
          v.id === heldVesselId
            ? { ...v, currentVolumeMl: Math.max(0, v.currentVolumeMl - 5) }
            : v
        )
      );

      setTimeout(() => setIsPouring(false), 650);
    } else {
      if (!isInspecting) {
        setIsInspecting(true);
        chemistryAudio.playGlassClink();
      } else {
        chemistryAudio.playGlassClink();
      }
    }
  }, [heldVesselId, vessels, isInspecting]);

  const handleInteract = useCallback(() => {
    if (!isInspecting) {
      setIsInspecting(true);
      chemistryAudio.playGlassClink();
    } else {
      handleToggleStopcock();
    }
  }, [isInspecting, handleToggleStopcock]);

  const handleAddTrial = useCallback(() => {
    chemistryAudio.playBeep();
    const calculatedM = calculateUnknownMolarity(
      dispensedMl,
      analyteVolumeMl,
      titrantConcentration
    );

    let notes = "Colorless acid excess";
    if (equilibrium.isEndpoint && !equilibrium.isOverTitrated) {
      notes = "Permanent faint pink (Stoichiometric Endpoint)";
    } else if (equilibrium.isOverTitrated) {
      notes = "Deep magenta (Over-titrated)";
    }

    const newTrial: TitrationTrial = {
      trialNumber: trials.length + 1,
      initialBuretteMl: 0.0,
      finalBuretteMl: dispensedMl,
      titrantUsedMl: dispensedMl,
      endpointPh: equilibrium.pH,
      calculatedMolarity: calculatedM,
      notes,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTrials((prev) => [...prev, newTrial]);
  }, [dispensedMl, analyteVolumeMl, titrantConcentration, equilibrium, trials.length]);

  const heldVessel = vessels.find((v) => v.id === heldVesselId) || null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* 3D WebGL Canvas Layer */}
      <ChemistryScene
        dispensedMl={dispensedMl}
        currentPh={equilibrium.pH}
        solutionColor={equilibrium.color}
        hasIndicator={hasIndicator}
        stopcockAngle={stopcockAngle}
        isStopcockOpen={isStopcockOpen}
        isInspecting={isInspecting}
        inspectViewMode={inspectViewMode}
        flowRateMode={flowRateMode}
        highlightedApparatus={highlightedApparatus}
        ceilingLightsOn={ceilingLightsOn}
        taskLightOn={taskLightOn}
        vessels={vessels}
        heldVesselId={heldVesselId}
        isPouring={isPouring}
        activeRobotTask={activeRobotTask}
        onOpenRobotMenu={() => setIsRobotMenuOpen(true)}
        onRobotTaskComplete={() => setActiveRobotTask("idle")}
        onToggleStopcock={handleToggleStopcock}
        onAddIndicator={handleAddIndicator}
        onToggleCeilingLights={() => setCeilingLightsOn((prev) => !prev)}
        onToggleTaskLight={() => setTaskLightOn((prev) => !prev)}
        onPickUpVessel={handlePickUpVessel}
        onPourIntoVessel={handlePourIntoVessel}
        onFlaskClick={handleFlaskClick}
        onHoverObject={setHoverLabel}
        onInteract={handleInteract}
      />

      {/* Minimalist Chemistry HUD */}
      <ChemistryHUD
        isInspecting={isInspecting}
        onToggleInspect={() => setIsInspecting((prev) => !prev)}
        inspectViewMode={inspectViewMode}
        onSetInspectViewMode={setInspectViewMode}
        hoverLabel={hoverLabel}
        currentStep={currentStep}
        totalSteps={5}
        buretteDispensedMl={dispensedMl}
        currentPh={equilibrium.pH}
        solutionColor={equilibrium.color}
        hasIndicator={hasIndicator}
        isStopcockOpen={isStopcockOpen}
        flowRateMode={flowRateMode}
        onSetFlowRateMode={handleSetFlowRateMode}
        onSwirlFlask={handleSwirlFlask}
        ceilingLightsOn={ceilingLightsOn}
        onToggleCeilingLights={() => setCeilingLightsOn((prev) => !prev)}
        heldVessel={heldVessel}
        onDropVessel={handleDropVessel}
        onToggleStopcock={handleToggleStopcock}
        onDispenseSingleDrop={handleDispenseSingleDrop}
        onAddIndicator={handleAddIndicator}
        onResetTitration={handleResetTitration}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onToggleAssistant={() => setIsAssistantOpen((prev) => !prev)}
        isAssistantOpen={isAssistantOpen}
        onOpenRobotMenu={() => setIsRobotMenuOpen(true)}
        activeRobotTask={activeRobotTask}
      />

      {/* AURA Autonomous Lab Robot Task Selection Modal */}
      <RobotMenuModal
        isOpen={isRobotMenuOpen}
        onClose={() => setIsRobotMenuOpen(false)}
        activeTask={activeRobotTask}
        onSelectTask={handleStartRobotTask}
        onAbortTask={handleAbortRobotTask}
        currentPh={equilibrium.pH}
        dispensedMl={dispensedMl}
      />

      {/* Laboratory Notebook Modal */}
      <ChemistryNotebook
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        trials={trials}
        onAddTrial={handleAddTrial}
        onClearTrials={() => setTrials([])}
        currentDispensedMl={dispensedMl}
        currentPh={equilibrium.pH}
      />

      {/* Context-Aware AI Lab Assistant */}
      <ChemistryAIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        buretteDispensedMl={dispensedMl}
        currentPh={equilibrium.pH}
        hasIndicator={hasIndicator}
        isStopcockOpen={isStopcockOpen}
        isEndpointReached={equilibrium.isEndpoint}
        onHighlightApparatus={setHighlightedApparatus}
      />
    </div>
  );
}
