import { ExperimentDefinition } from '../types';

export const INTERNAL_RESISTANCE_EXPERIMENT: ExperimentDefinition = {
  id: 'internal-resistance',
  title: 'Internal Resistance & EMF of an Electrochemical Cell',
  subtitle: 'Determining Cell Electromotive Force (ℰ) and Internal Resistance (r) via V-I Load Lines',
  subject: 'physics',
  difficulty: 'intermediate',
  estimatedDuration: '15-20 min',
  description: 'Real chemical cells and DC sources possess internal resistance r that causes the terminal voltage V to drop below the open-circuit electromotive force ℰ under electrical load: V = ℰ - I·r. Vary load resistance, measure terminal voltage and current, and calculate r from the empirical slope.',
  learningObjectives: [
    'Measure open-circuit electromotive force (EMF, ℰ) with an unloaded high-impedance voltmeter',
    'Demonstrate terminal voltage drop as load current increases',
    'Construct an empirical V vs I load characteristic line',
    'Determine the cell internal resistance from the slope: r = -ΔV / ΔI'
  ],
  standardComponents: [
    {
      id: 'comp-ps',
      type: 'power-supply',
      name: 'Real Electrochemical Battery (ℰ = 9.0V, r = 2.0Ω)',
      description: 'Chemical cell with intrinsic internal resistance. Terminal potential drops under load.',
      position: [-2.2, 0.45, -0.6],
      rotation: [0, 0.2, 0],
      properties: {
        voltage: 9.0,
        maxVoltage: 12.0,
        maxCurrent: 4.0,
        internalResistance: 2.0,
        isOn: true
      },
      terminals: [
        {
          id: 'ps-pos',
          componentId: 'comp-ps',
          name: 'Battery Positive (+)',
          label: '+',
          polarity: 'positive',
          position: [0.32, 0.12, 0.52]
        },
        {
          id: 'ps-neg',
          componentId: 'comp-ps',
          name: 'Battery Negative (-)',
          label: '-',
          polarity: 'negative',
          position: [-0.32, 0.12, 0.52]
        }
      ]
    },
    {
      id: 'comp-sw',
      type: 'switch',
      name: 'Mechanical Knife Switch',
      description: 'Isolates battery to take open-circuit EMF measurements.',
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
      id: 'comp-res',
      type: 'resistor',
      name: 'Variable Load Resistor R_L (10 Ω)',
      description: 'Adjustable external load resistor to vary circuit current draw.',
      position: [0.6, 0.15, -0.6],
      rotation: [0, 0, 0],
      properties: {
        resistance: 10.0,
        tolerance: 0.05
      },
      terminals: [
        {
          id: 'res-t1',
          componentId: 'comp-res',
          name: 'Left Terminal A',
          label: 'A',
          polarity: 'neutral',
          position: [-0.45, 0.08, 0.0]
        },
        {
          id: 'res-t2',
          componentId: 'comp-res',
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
      name: 'Precision Series Ammeter',
      description: 'Measures load current I delivered by the battery.',
      position: [1.8, 0.35, -0.6],
      rotation: [0, -0.2, 0],
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
      name: 'Terminal Multimeter (Voltmeter)',
      description: 'Connected directly across battery terminals to measure terminal voltage V_term.',
      position: [-0.6, 0.35, 0.6],
      rotation: [0, 0.1, 0],
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
      toTerminalId: 'res-t1',
      color: '#ef4444'
    },
    {
      id: 'wire-3',
      fromTerminalId: 'res-t2',
      toTerminalId: 'amm-in',
      color: '#3b82f6'
    },
    {
      id: 'wire-4',
      fromTerminalId: 'amm-out',
      toTerminalId: 'ps-neg',
      color: '#181b21'
    },
    // Voltmeter measuring across battery terminals
    {
      id: 'wire-vm-pos',
      fromTerminalId: 'vm-pos',
      toTerminalId: 'ps-pos',
      color: '#dc2626'
    },
    {
      id: 'wire-vm-neg',
      fromTerminalId: 'vm-neg',
      toTerminalId: 'ps-neg',
      color: '#181b21'
    }
  ],
  challenges: [
    {
      id: 'ch-open-circuit',
      title: 'Measure Open-Circuit EMF',
      instruction: 'Open the knife switch to observe terminal voltage equal to battery EMF (ℰ = 9.0 V).',
      targetMetric: 'closed_circuit',
      isCompleted: false
    },
    {
      id: 'ch-load-voltage',
      title: 'Observe Terminal Drop Under Load',
      instruction: 'Close the switch with R = 10 Ω and record load current and terminal potential drop.',
      targetMetric: 'current',
      targetValue: 0.75,
      tolerance: 0.08,
      isCompleted: false
    },
    {
      id: 'ch-data-points',
      title: 'Record V-I Load Points',
      instruction: 'Record at least 4 measurement points at different load resistances.',
      targetMetric: 'recorded_points',
      targetValue: 4,
      isCompleted: false
    }
  ],
  hints: [
    'When the switch is open, I = 0, so V_terminal = ℰ.',
    'Under load, internal drop V_int = I·r subtracts from EMF: V_terminal = ℰ - I·r.',
    'Plotting V vs I produces a straight line with y-intercept ℰ and slope -r.'
  ],
  theoryNotes: {
    law: 'Terminal Potential Difference & Cell EMF',
    formula: 'V = ℰ - I · r',
    explanation: 'Every practical source of electrical energy has an internal impedance due to chemical ion migration or wire resistance. When current is drawn, energy is dissipated internally as heat (I²r), decreasing available terminal voltage.',
    derivationSteps: [
      'Total EMF drives current across total loop resistance: ℰ = I · (R_load + r)',
      'Expand: ℰ = I · R_load + I · r',
      'Terminal potential is voltage across load: V = I · R_load',
      'Rearrange for terminal potential: V = ℰ - I · r',
      'Slope of V vs I: dV/dI = -r'
    ]
  }
};
