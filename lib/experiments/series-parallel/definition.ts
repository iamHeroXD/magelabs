import { ExperimentDefinition } from '../types';

export const SERIES_PARALLEL_EXPERIMENT: ExperimentDefinition = {
  id: 'series-parallel',
  title: 'Series & Parallel Resistor Networks',
  subtitle: 'Verifying Equivalent Resistance and Kirchhoff’s Current & Voltage Division Rules',
  subject: 'physics',
  difficulty: 'introductory',
  estimatedDuration: '15-20 min',
  description: 'Construct series, parallel, and combination resistor networks. Verify theoretical equivalent resistances R_eq = R1 + R2 and 1/R_eq = 1/R1 + 1/R2, and examine how potential divides across series components while current divides through parallel branches.',
  learningObjectives: [
    'Measure equivalent resistance in series configurations: R_eq = R1 + R2',
    'Verify Kirchhoff’s Voltage Law (KVL): total voltage equals sum of series drops',
    'Demonstrate current conservation: identical current passes through all series elements',
    'Observe the effect of changing individual component resistances on total network draw'
  ],
  standardComponents: [
    {
      id: 'comp-ps',
      type: 'power-supply',
      name: 'DC Regulated Power Supply',
      description: 'Variable DC output (0 - 24V) with fine voltage adjustment dial.',
      position: [-2.2, 0.45, -0.6],
      rotation: [0, 0.2, 0],
      properties: {
        voltage: 12.0,
        maxVoltage: 24.0,
        maxCurrent: 5.0,
        isOn: true
      },
      terminals: [
        {
          id: 'ps-pos',
          componentId: 'comp-ps',
          name: 'Positive Output (+)',
          label: '+',
          polarity: 'positive',
          position: [0.32, 0.12, 0.52]
        },
        {
          id: 'ps-neg',
          componentId: 'comp-ps',
          name: 'Negative Ground (-)',
          label: '-',
          polarity: 'negative',
          position: [-0.32, 0.12, 0.52]
        }
      ]
    },
    {
      id: 'comp-sw',
      type: 'switch',
      name: 'Single-Pole Knife Switch',
      description: 'Mechanical copper knife switch with insulated handle. Click to open or close.',
      position: [-0.8, 0.15, -0.6],
      rotation: [0, 0, 0],
      properties: {
        isOpen: false
      },
      terminals: [
        {
          id: 'sw-t1',
          componentId: 'comp-sw',
          name: 'Hinge Terminal',
          label: 'IN',
          polarity: 'neutral',
          position: [-0.35, 0.08, 0.2]
        },
        {
          id: 'sw-t2',
          componentId: 'comp-sw',
          name: 'Jaw Contact Terminal',
          label: 'OUT',
          polarity: 'neutral',
          position: [0.35, 0.08, 0.2]
        }
      ]
    },
    {
      id: 'comp-res1',
      type: 'resistor',
      name: 'Precision Resistor R1 (10 Ω)',
      description: 'First series load resistor (Brown-Black-Black-Gold = 10 Ω ±5%).',
      position: [0.5, 0.15, -0.6],
      rotation: [0, 0, 0],
      properties: {
        resistance: 10.0,
        tolerance: 0.05
      },
      terminals: [
        {
          id: 'res1-t1',
          componentId: 'comp-res1',
          name: 'Left Terminal A',
          label: 'A',
          polarity: 'neutral',
          position: [-0.45, 0.08, 0.0]
        },
        {
          id: 'res1-t2',
          componentId: 'comp-res1',
          name: 'Right Terminal B',
          label: 'B',
          polarity: 'neutral',
          position: [0.45, 0.08, 0.0]
        }
      ]
    },
    {
      id: 'comp-res2',
      type: 'resistor',
      name: 'Precision Resistor R2 (20 Ω)',
      description: 'Second series load resistor (Red-Black-Black-Gold = 20 Ω ±5%).',
      position: [0.5, 0.15, 0.5],
      rotation: [0, 0, 0],
      properties: {
        resistance: 20.0,
        tolerance: 0.05
      },
      terminals: [
        {
          id: 'res2-t1',
          componentId: 'comp-res2',
          name: 'Left Terminal A',
          label: 'A',
          polarity: 'neutral',
          position: [-0.45, 0.08, 0.0]
        },
        {
          id: 'res2-t2',
          componentId: 'comp-res2',
          name: 'Right Terminal B',
          label: 'B',
          polarity: 'neutral',
          position: [0.45, 0.08, 0.0]
        }
      ]
    },
    {
      id: 'comp-ammeter',
      type: 'ammeter',
      name: 'Digital In-Line Ammeter',
      description: 'Measures series current flow through the combined network.',
      position: [2.0, 0.35, -0.2],
      rotation: [0, -0.3, 0],
      properties: {
        internalResistance: 0.05
      },
      terminals: [
        {
          id: 'amm-in',
          componentId: 'comp-ammeter',
          name: 'Current In (+)',
          label: '+A',
          polarity: 'positive',
          position: [-0.25, 0.12, 0.38]
        },
        {
          id: 'amm-out',
          componentId: 'comp-ammeter',
          name: 'Current Out (-)',
          label: '-COM',
          polarity: 'negative',
          position: [0.25, 0.12, 0.38]
        }
      ]
    },
    {
      id: 'comp-voltmeter',
      type: 'voltmeter',
      name: 'Digital Multimeter / Voltmeter',
      description: 'Measures potential drop across R1 or R2.',
      position: [-0.7, 0.35, 0.6],
      rotation: [0, 0.15, 0],
      properties: {
        inputImpedance: 10000000
      },
      terminals: [
        {
          id: 'vm-pos',
          componentId: 'comp-voltmeter',
          name: 'Voltage Probe (+ Red)',
          label: 'VΩ',
          polarity: 'positive',
          position: [0.22, 0.08, 0.36]
        },
        {
          id: 'vm-neg',
          componentId: 'comp-voltmeter',
          name: 'Common Probe (- Black)',
          label: 'COM',
          polarity: 'negative',
          position: [-0.22, 0.08, 0.36]
        }
      ]
    }
  ],
  initialWires: [
    {
      id: 'wire-1',
      fromTerminalId: 'ps-pos',
      toTerminalId: 'sw-t1',
      color: '#ef4444'
    },
    {
      id: 'wire-2',
      fromTerminalId: 'sw-t2',
      toTerminalId: 'res1-t1',
      color: '#ef4444'
    },
    {
      id: 'wire-3',
      fromTerminalId: 'res1-t2',
      toTerminalId: 'res2-t1',
      color: '#3b82f6'
    },
    {
      id: 'wire-4',
      fromTerminalId: 'res2-t2',
      toTerminalId: 'amm-in',
      color: '#3b82f6'
    },
    {
      id: 'wire-5',
      fromTerminalId: 'amm-out',
      toTerminalId: 'ps-neg',
      color: '#181b21'
    },
    // Voltmeter measuring across R1
    {
      id: 'wire-vm-pos',
      fromTerminalId: 'vm-pos',
      toTerminalId: 'res1-t1',
      color: '#dc2626'
    },
    {
      id: 'wire-vm-neg',
      fromTerminalId: 'vm-neg',
      toTerminalId: 'res1-t2',
      color: '#181b21'
    }
  ],
  challenges: [
    {
      id: 'ch-series-circuit',
      title: 'Energize Series Network',
      instruction: 'Close the knife switch and supply 12V to achieve 0.400 A in the 30 Ω series circuit.',
      targetMetric: 'closed_circuit',
      isCompleted: false
    },
    {
      id: 'ch-verify-current',
      title: 'Target Current Draw',
      instruction: 'Verify total current is exactly 0.40 A (12 V / (10 Ω + 20 Ω)).',
      targetMetric: 'current',
      targetValue: 0.4,
      tolerance: 0.03,
      isCompleted: false
    },
    {
      id: 'ch-record-points',
      title: 'Record Lab Observations',
      instruction: 'Record at least 3 measurement data points at different supply voltages.',
      targetMetric: 'recorded_points',
      targetValue: 3,
      isCompleted: false
    }
  ],
  hints: [
    'In a series circuit, R_eq = R1 + R2 = 10 + 20 = 30 Ω.',
    'Current is identical everywhere along an unbranched series loop.',
    'Voltage divides proportionally: V1 = I·R1 = 4.0 V, V2 = I·R2 = 8.0 V.'
  ],
  theoryNotes: {
    law: 'Series & Parallel Network Laws',
    formula: 'R_series = Σ R_i,  1/R_parallel = Σ (1/R_i)',
    explanation: 'In series circuits, charges pass sequentially through each resistive element, accumulating voltage drops. In parallel circuits, branches experience identical potential difference while total current divides.',
    derivationSteps: [
      'KVL: V_total = V1 + V2 = I·R1 + I·R2',
      'Factoring I: V_total = I(R1 + R2)',
      'Therefore R_eq = V_total / I = R1 + R2',
      'Voltage divider ratio: V_k = V_total · (R_k / R_total)'
    ]
  }
};
