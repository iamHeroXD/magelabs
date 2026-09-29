"use client";

import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";

interface Voltmeter3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  reading?: number; // Volts
}

export function Voltmeter3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  reading = 0,
}: Voltmeter3DProps) {
  const tPos = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const tNeg = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Ruggedized yellow multimeter case */}
      <mesh position={[0, 0.25, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.52, 0.8]} />
        <meshStandardMaterial metalness={0.2} roughness={0.6} color="#d97706" />
      </mesh>

      {/* Dark gray center insert */}
      <mesh position={[0, 0.28, 0.32]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.9, 0.44, 0.04]} />
        <meshStandardMaterial metalness={0.4} roughness={0.5} color="#18181b" />
      </mesh>

      {/* Multimeter LCD Screen */}
      <Html position={[0, 0.33, 0.35]} transform distanceFactor={3.2} rotation={[-0.2, 0, 0]}>
        <div className="flex flex-col items-center justify-center w-48 bg-zinc-950 p-2 rounded border border-zinc-800 font-mono shadow-inner select-none pointer-events-none">
          <div className="flex w-full justify-between items-center text-[10px] text-zinc-500 border-b border-zinc-900 pb-0.5 mb-1">
            <span className="font-bold text-amber-400">DIGITAL VOLTMETER</span>
            <span className="text-zinc-400">DC V</span>
          </div>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-2xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
              {reading.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-amber-500">V</span>
          </div>
          <div className="flex w-full justify-between items-center text-[9px] text-zinc-500 mt-1">
            <span>Hi-Z (10 MΩ)</span>
            <span className="text-zinc-400">ΔV PROBE</span>
          </div>
        </div>
      </Html>

      {/* Rotary Selection Dial */}
      <mesh position={[0, 0.12, 0.38]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
        <meshStandardMaterial metalness={0.7} roughness={0.3} color="#27272a" />
      </mesh>

      {/* Terminals (VΩ Red and COM Black) */}
      {tPos && (
        <TerminalPost3D
          id={tPos.id}
          name={tPos.name}
          label={tPos.label}
          polarity="positive"
          position={[0.22, 0.08, 0.36]}
          isActiveWiringSource={activeWiringTerminalId === tPos.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {tNeg && (
        <TerminalPost3D
          id={tNeg.id}
          name={tNeg.name}
          label={tNeg.label}
          polarity="negative"
          position={[-0.22, 0.08, 0.36]}
          isActiveWiringSource={activeWiringTerminalId === tNeg.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
