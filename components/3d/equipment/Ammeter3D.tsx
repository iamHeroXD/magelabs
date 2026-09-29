"use client";

import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";

interface Ammeter3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  reading?: number; // Current in Amperes
}

export function Ammeter3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  reading = 0,
}: Ammeter3DProps) {
  const tIn = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const tOut = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];

  const currentDisplay = reading.toFixed(3);
  const isHighCurrent = reading > 2.5;

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Slanted desktop instrument chassis */}
      <mesh position={[0, 0.28, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.55, 0.85]} />
        <meshStandardMaterial metalness={0.5} roughness={0.4} color="#1e222b" />
      </mesh>

      {/* Front bezel panel */}
      <mesh position={[0, 0.32, 0.36]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.98, 0.48, 0.02]} />
        <meshStandardMaterial metalness={0.3} roughness={0.6} color="#111317" />
      </mesh>

      {/* High-contrast Digital LCD Screen */}
      <Html position={[0, 0.36, 0.38]} transform distanceFactor={3.2} rotation={[-0.2, 0, 0]}>
        <div className="flex flex-col items-center justify-center w-52 bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono shadow-inner select-none pointer-events-none">
          <div className="flex w-full justify-between items-center text-[10px] text-zinc-500 border-b border-zinc-900 pb-1 mb-1">
            <span className="font-bold text-cyan-400">SERIES AMMETER</span>
            <span className="text-zinc-400">DC 0-10A</span>
          </div>
          <div className="flex items-baseline gap-1 my-0.5">
            <span
              className={`text-2xl font-bold tracking-widest ${
                isHighCurrent
                  ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              }`}
            >
              {currentDisplay}
            </span>
            <span className="text-sm font-semibold text-cyan-500">A</span>
          </div>
          <div className="flex w-full justify-between items-center text-[9px] text-zinc-500 mt-1">
            <span>R_int: 0.05 Ω</span>
            <span className={reading > 0 ? "text-emerald-400" : "text-zinc-600"}>
              {reading > 0 ? "FLOW DETECTED" : "NO CURRENT"}
            </span>
          </div>
        </div>
      </Html>

      {/* Terminals (+A and -COM) */}
      {tIn && (
        <TerminalPost3D
          id={tIn.id}
          name={tIn.name}
          label={tIn.label}
          polarity="positive"
          position={[-0.25, 0.12, 0.38]}
          isActiveWiringSource={activeWiringTerminalId === tIn.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {tOut && (
        <TerminalPost3D
          id={tOut.id}
          name={tOut.name}
          label={tOut.label}
          polarity="negative"
          position={[0.25, 0.12, 0.38]}
          isActiveWiringSource={activeWiringTerminalId === tOut.id}
          onTerminalClick={onTerminalClick}
        />
      )}
    </group>
  );
}
