export interface VirtualLiquid {
  id: string;
  name: string;
  volumeMl: number;
  temperatureC: number;
  pH: number;
  color: string;
  transparency: number;
  density?: number;
  concentration?: number; // Molarity (M = mol / L)
  phase: "liquid";
}

export interface VirtualContainer {
  id: string;
  name: string;
  capacityMl: number;
  currentVolumeMl: number;
  contents: VirtualLiquid[];
  position: [number, number, number];
}

export interface TitrationTrial {
  trialNumber: number;
  initialBuretteMl: number;
  finalBuretteMl: number;
  titrantUsedMl: number;
  endpointPh: number;
  calculatedMolarity: number;
  notes: string;
  timestamp: string;
}

export interface TitrationState {
  // Analyte (Acid in flask)
  analyteName: string;
  analyteVolumeMl: number;
  analyteConcentration: number; // M
  
  // Titrant (Base in burette)
  titrantName: string;
  titrantConcentration: number; // M
  buretteCapacityMl: number;
  buretteDispensedMl: number;
  
  // Flow control
  stopcockAngle: number; // 0 = Closed, 45 = Dropwise, 90 = Continuous
  isStopcockOpen: boolean;
  flowRateMode: "closed" | "dropwise" | "stream";
  
  // Indicator & Chemistry
  hasIndicator: boolean;
  indicatorDrops: number;
  currentPh: number;
  solutionColor: string;
  isStirrerActive: boolean;
  
  // Trials & Notebook
  trials: TitrationTrial[];
  currentStep: number;
  totalSteps: number;
  isEndpointReached: boolean;
  
  // Inspection & Interaction
  inspectingStation: boolean;
  highlightedApparatus: string | null;
}
