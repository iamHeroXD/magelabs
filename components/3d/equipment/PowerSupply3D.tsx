"use client";

import { useState } from "react";
import { TerminalPost3D } from "./TerminalPost3D";
import { CircuitComponent } from "@/lib/experiments/types";
import { Html } from "@react-three/drei";

interface PowerSupply3DProps {
  component: CircuitComponent;
  activeWiringTerminalId?: string | null;
  onTerminalClick?: (terminalId: string) => void;
  onVoltageChange?: (voltage: number) => void;
}

export function PowerSupply3D({
  component,
  activeWiringTerminalId,
  onTerminalClick,
  onVoltageChange,
}: PowerSupply3DProps) {
  const [hovered, setHovered] = useState(false);
  const voltage = Number(component.properties.voltage ?? 12.0);
  const isOn = Boolean(component.properties.isOn ?? true);

  const posTerm = component.terminals.find((t) => t.polarity === "positive") || component.terminals[0];
  const negTerm = component.terminals.find((t) => t.polarity === "negative") || component.terminals[1];

  return (
    <group position={component.position} rotation={component.rotation}>
      {/* Main metal enclosure body */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.9, 0.95]} />
        <meshStandardMaterial metalness={0.65} roughness={0.35} color="#1c2027" />
      </mesh>

      {/* Front bezel panel */}
      <mesh position={[0, 0.45, 0.48]}>
        <boxGeometry args={[1.24, 0.84, 0.03]} />
        <meshStandardMaterial metalness={0.4} roughness={0.5} color="#262c36" />
      </mesh>

      {/* Screen recess border */}
      <mesh position={[0, 0.65, 0.505]}>
        <boxGeometry args={[0.92, 0.32, 0.02]} />
        <meshStandardMaterial metalness={0.2} roughness={0.8} color="#0c0e12" />
      </mesh>

      {/* LED Digital Display */}
      <Html position={[0, 0.65, 0.52]} transform distanceFactor={3.2}>
        <div className="flex w-64 items-center justify-around bg-black/95 p-2 rounded border border-zinc-800 font-mono shadow-inner select-none pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Voltage</span>
            <span className="text-xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              {isOn ? voltage.toFixed(1) : "0.0"} <span className="text-xs">V</span>
            </span>
          </div>
          <div className="h-7 w-[1px] bg-zinc-800" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Output</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {isOn ? "ACTIVE" : "STANDBY"}
            </span>
          </div>
        </div>
      </Html>

      {/* Rotary Voltage Knob (Coarse) */}
      <group position={[-0.3, 0.35, 0.51]}>
        <mesh
          rotation={[Math.PI / 2, 0, (voltage / 24) * Math.PI * 1.5]}
          onClick={(e) => {
            e.stopPropagation();
            const nextV = (voltage + 2) % 26;
            onVoltageChange?.(nextV === 0 ? 2 : nextV);
          }}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
          <meshStandardMaterial metalness={0.7} roughness={0.3} color="#3f4553" />
        </mesh>
        <mesh position={[0, 0.035, 0.035]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.015, 0.04, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Rotary Voltage Knob (Fine) */}
      <group position={[0.3, 0.35, 0.51]}>
        <mesh
          rotation={[Math.PI / 2, 0, (voltage % 5) * Math.PI]}
          onClick={(e) => {
            e.stopPropagation();
            onVoltageChange?.(Math.min(24, Math.round((voltage + 0.5) * 10) / 10));
          }}
        >
          <cylinderGeometry args={[0.055, 0.055, 0.05, 24]} />
          <meshStandardMaterial metalness={0.7} roughness={0.3} color="#3f4553" />
        </mesh>
      </group>

      {/* Terminals (+ Red and - Black) */}
      {posTerm && (
        <TerminalPost3D
          id={posTerm.id}
          name={posTerm.name}
          label={posTerm.label}
          polarity="positive"
          position={[0.3, 0.12, 0.52]}
          isActiveWiringSource={activeWiringTerminalId === posTerm.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {negTerm && (
        <TerminalPost3D
          id={negTerm.id}
          name={negTerm.name}
          label={negTerm.label}
          polarity="negative"
          position={[-0.3, 0.12, 0.52]}
          isActiveWiringSource={activeWiringTerminalId === negTerm.id}
          onTerminalClick={onTerminalClick}
        />
      )}

      {/* Ground terminal (Green) */}
      <TerminalPost3D
        id="ps-gnd"
        name="Chassis Ground"
        label="GND"
        polarity="neutral"
        position={[0, 0.12, 0.52]}
        isActiveWiringSource={activeWiringTerminalId === "ps-gnd"}
        onTerminalClick={onTerminalClick}
      />

      {/* Power Supply Nameplate branding */}
      <Html position={[0, 0.88, 0.49]} transform distanceFactor={3.5}>
        <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 select-none">
          MAGE-PS2400 · DC REGULATED SOURCE
        </div>
      </Html>
    </group>
  );
}
