"use client";

import { useState, useEffect } from "react";
import { LandingHero3D } from "@/components/landing/LandingHero3D";
import { StartSequenceModal } from "@/components/landing/StartSequenceModal";
import { ArrowDown, ArrowRight, Lock, CheckCircle2, FlaskConical, Atom, Dna } from "lucide-react";

export default function EditorialLandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = window.scrollY / totalScroll;
        setScrollProgress(Math.min(1, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDisabledSubject = (name: string) => {
    setToastMessage(`${name} Laboratory is in development. Chemistry is currently active.`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* 3D Glassware Apparatus in Background with Depth Response */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <LandingHero3D scrollProgress={scrollProgress} />
      </div>

      {/* Subtle toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono rounded shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* START MODAL & SUBJECT SELECTION */}
      <StartSequenceModal
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
      />

      {/* SCENE 00: IMMERSIVE HERO WITH HUGE START ENTRANCE */}
      <section className="relative z-10 min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-28 pb-12 border-b border-zinc-900">
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>MAGE LABS // 001</span>
          <span>FIRST-PERSON SCIENCE ENGINE</span>
        </div>

        <div className="my-auto max-w-5xl space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tight text-white uppercase leading-[0.92]">
              ENTER
              <br />
              THE LAB.
            </h1>
            <p className="text-base sm:text-xl text-zinc-400 font-sans max-w-xl leading-relaxed">
              Interactive science, built as a place. Not a diorama, not a quiz, not a video. An authentic physical laboratory in your browser.
            </p>
          </div>

          {/* Huge Central Entrance CTA */}
          <div className="pt-4">
            <button
              onClick={() => setIsStartOpen(true)}
              className="group relative inline-flex items-center justify-between gap-8 px-10 py-6 bg-white text-black font-display text-lg sm:text-2xl font-bold tracking-tight rounded-none hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.18)]"
            >
              <span>START EXPERIENCE</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-zinc-500 uppercase">
              <span>● CHEMISTRY WORLD ACTIVE</span>
              <span>● WASD 1:1 CONTROLS</span>
              <span>● REAL STOICHIOMETRY</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-zinc-600">
          <span className="flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            SCROLL TO EXPLORE ARCHITECTURE
          </span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* SCENE 01: EDITORIAL MANIFESTO */}
      <section id="narrative" className="relative z-10 min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 border-b border-zinc-900 bg-black/60 backdrop-blur-sm">
        <div className="max-w-4xl space-y-6">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
            MANIFOLD // ARCHITECTURE
          </span>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[1.02]">
            SCIENCE
            <br />
            SHOULD FEEL
            <br />
            REAL.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl leading-relaxed">
            For decades, digital educational science has been reduced to flat multiple-choice questionnaires and pre-rendered animations. MageLabs turns the laboratory back into what it has always been: a physical place where you stand, measure, adjust valves, observe changes, and discover truth.
          </p>
        </div>
      </section>

      {/* SCENE 02: THE LABORATORY OBJECT */}
      <section className="relative z-10 min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 border-b border-zinc-900 bg-black/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl">
          <div className="space-y-6">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
              APPARATUS DETAIL // 02
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
              A place to experiment.
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Every beaker, burette, digital pH electrode, and analytical balance has true scale, realistic glass thickness, real liquid volume, and authentic meniscus physics.
            </p>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-white rounded-full" />
                Physical dropwise liquid transfer
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-white rounded-full" />
                Dynamic phenolphthalein acid-base equilibrium
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-white rounded-full" />
                0.01 pH resolution glass electrode readouts
              </li>
            </ul>
          </div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* SCENE 03: ARCHITECTURE & SYSTEMS */}
      <section className="relative z-10 min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 border-b border-zinc-900 bg-black/80">
        <div className="max-w-6xl space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
              INFRASTRUCTURE // SYSTEM SPECIFICATION
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
              BELIEVABLE ARCHITECTURE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-zinc-900 bg-zinc-950/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">01 / FIRST-PERSON</span>
              <h4 className="font-display text-lg font-bold text-white uppercase">WASD WALKTHROUGH</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                PointerLock mouse look, realistic human eye height (1.65 m), capsule player collision, and smooth deceleration. Walk freely through the lab.
              </p>
            </div>

            <div className="p-6 border border-zinc-900 bg-zinc-950/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">02 / INTERACTION</span>
              <h4 className="font-display text-lg font-bold text-white uppercase">PHYSICAL MANIPULATION</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Rotate stopcocks, add drops of indicator, inspect digital instruments up-close, and record empirical data into a scientific notebook.
              </p>
            </div>

            <div className="p-6 border border-zinc-900 bg-zinc-950/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">03 / CONTEXT AI</span>
              <h4 className="font-display text-lg font-bold text-white uppercase">BENCH-AWARE ASSISTANT</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                An intelligent laboratory assistant that inspects your current liquid volume, solution pH, and apparatus state to guide your investigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 04: SUBJECT PORTALS */}
      <section id="portals" className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 border-b border-zinc-900 bg-black">
        <div className="max-w-6xl w-full mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
              FACULTY OF SCIENCES // PORTALS
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
              SELECT YOUR LABORATORY
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-lg mx-auto">
              Chemistry is currently active for the flagship first-person experience. Physics and Biology are under active preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Physics Card (Coming Soon) */}
            <div
              onClick={() => handleDisabledSubject("Physics")}
              className="p-8 border border-zinc-900 bg-zinc-950/40 rounded-none opacity-60 hover:opacity-80 transition-all cursor-pointer flex flex-col justify-between space-y-8 select-none"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-600">01</span>
                  <span className="px-2 py-0.5 border border-zinc-800 text-zinc-500 rounded text-[10px] flex items-center gap-1 uppercase">
                    <Lock className="h-3 w-3" /> COMING SOON
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Atom className="h-6 w-6 text-zinc-600" />
                  <h4 className="font-display text-2xl font-bold text-zinc-300 uppercase">PHYSICS</h4>
                </div>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  Harmonic motion, optical bench rails, and electromagnetic circuits undergoing full first-person room upgrades.
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-600 uppercase border-t border-zinc-900 pt-4">
                RELEASE PHASE 02
              </div>
            </div>

            {/* Chemistry Card (ACTIVE) */}
            <div
              onClick={() => setIsStartOpen(true)}
              className="p-8 border-2 border-white bg-zinc-950 rounded-none shadow-[0_0_50px_rgba(255,255,255,0.12)] hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-bold">02</span>
                  <span className="px-2 py-0.5 bg-white text-black font-bold rounded text-[10px] flex items-center gap-1 uppercase">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE WORLD
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-6 w-6 text-white" />
                  <h4 className="font-display text-2xl font-bold text-white uppercase">CHEMISTRY</h4>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  First-person analytical chemistry laboratory. Volumetric acid-base titration, dropwise PTFE stopcock, live pH curves, and digital notebook.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-white border-t border-zinc-800 pt-4">
                <span className="font-bold">ENTER LABORATORY</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Biology Card (Coming Soon) */}
            <div
              onClick={() => handleDisabledSubject("Biology")}
              className="p-8 border border-zinc-900 bg-zinc-950/40 rounded-none opacity-60 hover:opacity-80 transition-all cursor-pointer flex flex-col justify-between space-y-8 select-none"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-600">03</span>
                  <span className="px-2 py-0.5 border border-zinc-800 text-zinc-500 rounded text-[10px] flex items-center gap-1 uppercase">
                    <Lock className="h-3 w-3" /> COMING SOON
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Dna className="h-6 w-6 text-zinc-600" />
                  <h4 className="font-display text-2xl font-bold text-zinc-300 uppercase">BIOLOGY</h4>
                </div>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  Compound light microscopy, specimen slide preparation, and enzymatic kinetic chambers scheduled for stage 03.
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-600 uppercase border-t border-zinc-900 pt-4">
                RELEASE PHASE 03
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 05: FINAL ENTRANCE CTA */}
      <section className="relative z-10 min-h-[70vh] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-24 bg-black">
        <div className="max-w-3xl space-y-8">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
            THE PLATFORM IS LIVE
          </span>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-tight">
            ENTER MAGE LABS.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-lg mx-auto leading-relaxed">
            Step directly onto the laboratory floor. Discover truth through empirical measurement and genuine physical interactions.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsStartOpen(true)}
              className="group inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-display text-xl sm:text-2xl font-bold tracking-tight rounded-none hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <span>START EXPERIENCE</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
