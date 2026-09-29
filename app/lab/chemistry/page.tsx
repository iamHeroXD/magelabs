"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { calculateTitrationEquilibrium, calculateUnknownMolarity } from "@/lib/chemistry/engine";
import { TitrationTrial } from "@/lib/chemistry/types";
import { ChemistryHUD } from "@/components/chemistry/ChemistryHUD";
import { ChemistryNotebook } from "@/components/chemistry/ChemistryNotebook";
import { ChemistryAIAssistant } from "@/components/chemistry/ChemistryAIAssistant";
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

export default function ChemistryLabPage() {
  // Stoichiometry & Dispensing State
  const [dispensedMl, setDispensedMl] = useState(0.0);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [stopcockAngle, setStopcockAngle] = useState(0); // 0 = Closed, 45 = Dropwise, 90 = Stream
  const [isStopcockOpen, setIsStopcockOpen] = useState(false);
  const [flowRateMode, setFlowRateMode] = useState<"closed" | "dropwise" | "stream">("closed");

  // Interaction & UI State
  const [isInspecting, setIsInspecting] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [highlightedApparatus, setHighlightedApparatus] = useState<string | null>(null);
  const [trials, setTrials] = useState<TitrationTrial[]>([]);

  // Fixed Standardized Chemistry Parameters
  const analyteVolumeMl = 25.0; // 25.00 mL HCl
  const analyteConcentration = 0.100; // 0.1000 M
  const titrantConcentration = 0.100; // 0.1000 M NaOH

  // Compute live equilibrium state from physics/chemical engine
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

  // Continuous fluid discharge when stopcock is open
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

  // Keyboard shortcut listener ('C' toggles inspection mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyC") {
        setIsInspecting((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initialize room ventilation hum on first user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      chemistryAudio.startVentilationHum();
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  // Handlers
  const handleToggleStopcock = useCallback(() => {
    chemistryAudio.playStopcockClick();
    if (isStopcockOpen) {
      setIsStopcockOpen(false);
      setStopcockAngle(0);
      setFlowRateMode("closed");
    } else {
      setIsStopcockOpen(true);
      setStopcockAngle(90);
      setFlowRateMode("stream");
    }
  }, [isStopcockOpen]);

  const handleDispenseSingleDrop = useCallback(() => {
    chemistryAudio.playLiquidDrop();
    setDispensedMl((prev) => Math.min(50.0, prev + 0.05));
  }, []);

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
        highlightedApparatus={highlightedApparatus}
        onToggleStopcock={handleToggleStopcock}
        onAddIndicator={handleAddIndicator}
        onHoverObject={setHoverLabel}
        onInteract={handleInteract}
      />

      {/* Minimalist Chemistry HUD */}
      <ChemistryHUD
        isInspecting={isInspecting}
        onToggleInspect={() => setIsInspecting((prev) => !prev)}
        hoverLabel={hoverLabel}
        currentStep={currentStep}
        totalSteps={5}
        buretteDispensedMl={dispensedMl}
        currentPh={equilibrium.pH}
        solutionColor={equilibrium.color}
        hasIndicator={hasIndicator}
        isStopcockOpen={isStopcockOpen}
        flowRateMode={flowRateMode}
        onToggleStopcock={handleToggleStopcock}
        onDispenseSingleDrop={handleDispenseSingleDrop}
        onAddIndicator={handleAddIndicator}
        onResetTitration={handleResetTitration}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onToggleAssistant={() => setIsAssistantOpen((prev) => !prev)}
        isAssistantOpen={isAssistantOpen}
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
