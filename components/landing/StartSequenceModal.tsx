"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { ArrowRight, Lock, CheckCircle2, X } from "lucide-react";

function RotatingMolecularEmblem() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.y = t * 0.6;
    meshRef.current.rotation.z = t * 0.2;
  });

  return (
    <group ref={meshRef}>
      {/* Central nucleus atom */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Orbit ring 1 */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshBasicMaterial color="#a1a1aa" transparent opacity={0.6} />
      </mesh>

      {/* Orbit ring 2 */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[1.05, 0.02, 16, 64]} />
        <meshBasicMaterial color="#d4d4d8" transparent opacity={0.7} />
      </mesh>

      {/* Orbit ring 3 */}
      <mesh rotation={[0, -Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshBasicMaterial color="#e4e4e7" transparent opacity={0.5} />
      </mesh>

      {/* Satellite valence particles */}
      <mesh position={[0.9, 0, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <mesh position={[-0.7, 0.7, 0.4]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <mesh position={[0.4, -0.9, -0.6]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
    </group>
  );
}

const STAGES = [
  { label: "ASSET LOADING", duration: 400 },
  { label: "ENVIRONMENT ARCHITECTURE", duration: 450 },
  { label: "PHOTOMETRIC LIGHTING", duration: 400 },
  { label: "INSTRUMENTATION CALIBRATION", duration: 450 },
  { label: "STOICHIOMETRIC SOLVER", duration: 400 },
];

export function StartSequenceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "selection" | "zooming">("loading");
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase("loading");
      setActiveStageIndex(0);
      setProgress(0);
      return;
    }

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < STAGES.length) {
        setActiveStageIndex(currentIdx);
        setProgress(Math.round(((currentIdx + 1) / STAGES.length) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("selection");
        }, 300);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSelectChemistry = () => {
    setPhase("zooming");
    setTimeout(() => {
      router.push("/lab/chemistry");
    }, 850);
  };

  const handleDisabledSubject = (name: string) => {
    setToastMessage(`${name} Laboratory is in preparation. Chemistry is currently active.`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-700 ${
        phase === "zooming" ? "scale-105 opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-zinc-500 hover:text-white transition-colors z-50 text-xs font-mono flex items-center gap-1.5"
      >
        <X className="h-4 w-4" />
        <span>EXIT</span>
      </button>

      {/* Toast notification */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono rounded shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* PHASE 1: 3D LOADING SEQUENCE */}
      {phase === "loading" && (
        <div className="relative flex flex-col items-center justify-center max-w-md w-full px-6 text-center space-y-8">
          <div className="w-56 h-56 relative">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
              <ambientLight intensity={1.2} />
              <pointLight position={[3, 3, 3]} intensity={2.0} />
              <RotatingMolecularEmblem />
            </Canvas>
          </div>

          <div className="space-y-3 w-full">
            <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              MAGE LABS // INITIALIZING ENVIRONMENT
            </div>

            <div className="w-full bg-zinc-900 h-[2px] rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>{STAGES[activeStageIndex]?.label}</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: SUBJECT SELECTION ENVIRONMENT */}
      {phase === "selection" && (
        <div className="relative z-10 max-w-6xl w-full px-6 py-12 flex flex-col items-center space-y-12 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              SELECTION PROTOCOL / DISCIPLINE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
              CHOOSE YOUR WORLD
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto">
              Select a scientific discipline to enter the first-person virtual laboratory.
            </p>
          </div>

          {/* Three Large Spatial Portals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Portal 01: Physics (Coming Soon) */}
            <div
              onClick={() => handleDisabledSubject("Physics")}
              className="group relative flex flex-col justify-between p-8 rounded-lg border border-zinc-900 bg-zinc-950/60 opacity-60 hover:opacity-80 transition-all cursor-pointer select-none"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-zinc-600">01</span>
                  <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 uppercase flex items-center gap-1">
                    <Lock className="h-3 w-3" /> COMING SOON
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-zinc-300 tracking-tight">
                  PHYSICS
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Mechanics, Electrodynamics, and Wave Optics laboratories currently being upgraded to the full first-person room architecture.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center text-xs font-mono text-zinc-600">
                <span>STAGE 02 RELEASE</span>
              </div>
            </div>

            {/* Portal 02: Chemistry (ACTIVE FLAGSHIP) */}
            <div
              onClick={handleSelectChemistry}
              className="group relative flex flex-col justify-between p-8 rounded-lg border-2 border-white bg-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-white font-bold">02</span>
                  <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-white text-black font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE WORLD
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  CHEMISTRY
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Step inside the complete first-person chemistry laboratory. Operate a 50 mL burette, digital pH electrode, and execute volumetric acid-base titrations with true liquid stoichiometry.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-white">
                <span className="font-bold">ENTER LABORATORY</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Portal 03: Biology (Coming Soon) */}
            <div
              onClick={() => handleDisabledSubject("Biology")}
              className="group relative flex flex-col justify-between p-8 rounded-lg border border-zinc-900 bg-zinc-950/60 opacity-60 hover:opacity-80 transition-all cursor-pointer select-none"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-zinc-600">03</span>
                  <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 uppercase flex items-center gap-1">
                    <Lock className="h-3 w-3" /> COMING SOON
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-zinc-300 tracking-tight">
                  BIOLOGY
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Compound light microscopy, cytological staining, and enzymatic reaction chambers planned for subsequent curriculum deployment.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center text-xs font-mono text-zinc-600">
                <span>STAGE 03 RELEASE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
