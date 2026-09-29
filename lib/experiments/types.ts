export type Subject = 'physics' | 'chemistry' | 'biology';
export type Difficulty = 'introductory' | 'intermediate' | 'advanced';

export type TerminalPolarity = 'positive' | 'negative' | 'neutral';

export interface Terminal {
  id: string;
  componentId: string;
  name: string;
  label: string;
  polarity: TerminalPolarity;
  position: [number, number, number]; // local relative coordinate on component
}

export interface WireConnection {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
  color: string; // e.g. '#ef4444' (red), '#181b21' (black), '#eab308' (yellow)
}

export type ComponentType = 
  | 'power-supply'
  | 'resistor'
  | 'switch'
  | 'light-bulb'
  | 'ammeter'
  | 'voltmeter';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  terminals: Terminal[];
  properties: {
    voltage?: number;       // Volts
    resistance?: number;    // Ohms
    isOpen?: boolean;       // Switch open/closed
    internalResistance?: number;
    maxVoltage?: number;
    maxCurrent?: number;
    ratedPower?: number;    // Watts for bulb
    [key: string]: any;
  };
}

export interface CircuitSimulationResult {
  isClosedCircuit: boolean;
  isShortCircuit: boolean;
  isOpenSwitch: boolean;
  totalVoltage: number;           // V
  equivalentResistance: number;   // Ohms
  totalCurrent: number;           // Amperes
  ammeterReading: number;         // Amperes
  voltmeterReading: number;       // Volts
  componentReadings: Record<string, {
    current: number;             // A
    voltageDrop: number;         // V
    power: number;               // W
    brightness?: number;         // 0 to 1 scale for bulb
    isOverloaded?: boolean;
  }>;
  statusMessage: string;
  warnings: string[];
  diagnosticTips: string[];
}

export interface MeasurementRecord {
  id: string;
  timestamp: number;
  voltage: number;
  current: number;
  resistanceCalculated: number;
  notes?: string;
}

export interface LabChallenge {
  id: string;
  title: string;
  instruction: string;
  targetMetric: 'voltage' | 'current' | 'resistance' | 'closed_circuit' | 'recorded_points';
  targetValue?: number;
  tolerance?: number;
  isCompleted: boolean;
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  subtitle: string;
  subject: Subject;
  difficulty: Difficulty;
  estimatedDuration: string;
  description: string;
  learningObjectives: string[];
  standardComponents: CircuitComponent[];
  initialWires: WireConnection[];
  challenges: LabChallenge[];
  hints: string[];
  theoryNotes: {
    law: string;
    formula: string;
    explanation: string;
    derivationSteps: string[];
  };
}
