import { ExperimentDefinition } from '../types';

export const RC_TRANSIENT_EXPERIMENT: ExperimentDefinition = {
  id: 'rc-transient',
  title: 'RC Transient Response & Time Constant (τ = RC)',
  subtitle: 'Investigating Exponential Capacitor Charging, Discharging, and Energy Storage',
  subject: 'physics',
  difficulty: 'intermediate',
  estimatedDuration: '15-20 min',
  description: 'Study the time-dependent charging and discharging dynamics of a capacitor through a resistor. Measure voltage growth toward steady-state supply potential V(t) = V₀(1 - e^(-t/RC)), determine the characteristic time constant τ = RC, and verify instantaneous current decay.',
  learningObjectives: [
    'Observe exponential capacitor charging and terminal voltage saturation',
    'Calculate the theoretical circuit time constant τ = R · C',
    'Measure the time required for capacitor potential to reach 63.2% of supply voltage',
    'Demonstrate energy conservation and exponential current decay: i(t) = (V₀/R)e^(-t/RC)'
  ],
  standardComponents: [
    {
      id: 'comp-ps',
      type: 'power-supply',
      name: 'DC Charging Supply (10.0 V)',
      description: 'Stabilized DC source providing charging potential difference.',
      position: [-2.2, 0.45, -0.6],
      rotation: [0, 0.2, 0],
      properties: {
        voltage: 10.0,
        maxVoltage: 20.0,
        maxCurrent: 3.0,
        isOn: true
      },
      terminals: [
        {
          id: 'ps-pos',
          componentId: 'comp-ps',
          name: 'Charging Positive (+)',
          label: '+',
          polarity: 'positive',
          position: [0.32, 0.12, 0.52]
        },
        {
          id: 'ps-neg',
          componentId: 'comp-ps',
          name: 'Common Return (-)',
          label: '-',
          polarity: 'negative',
          position: [-0.32, 0.12, 0.52]
        }
      ]
    },
    {
      id: 'comp-sw',
      type: 'switch',
      name: 'Charge / Discharge Knife Switch',
      description: 'Engages charging loop from supply or isolates for capacitor monitoring.',
      position: [-0.8, 0.15, -0.6],
      rotation: [0, 0, 0],
      properties: {
        isOpen: false
      },
      terminals: [
        {
          id: 'sw-t1',
          componentId: 'comp-sw',
          name: 'Supply Contact IN',
          label: 'IN',
          polarity: 'neutral',
          position: [-0.35, 0.08, 0.2]
        },
        {
          id: 'sw-t2',
          componentId: 'comp-sw',
          name: 'Network Contact OUT',
          label: 'OUT',
          polarity: 'neutral',
          position: [0.35, 0.08, 0.2]
        }
      ]
    },
    {
      id: 'comp-res',
      type: 'resistor',
      name: 'Series Limiting Resistor R (10 Ω)',
      description: 'Precision charging series resistor that governs charging rate τ = RC.',
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
          name: 'Input Terminal A',
          label: 'A',
          polarity: 'neutral',
          position: [-0.45, 0.08, 0.0]
        },
        {
          id: 'res-t2',
          componentId: 'comp-res',
          name: 'Capacitor Lead B',
          label: 'B',
          polarity: 'neutral',
          position: [0.45, 0.08, 0.0]
        }
      ]
    },
    {
      id: 'comp-bulb',
      type: 'light-bulb',
      name: 'Capacitive Load Indicator Lamp',
      description: 'Filament lamp demonstrating transient surge at t=0 and decaying as capacitor charges.',
      position: [0.8, 0.3, 0.5],
      rotation: [0, 0, 0],
      properties: {
        resistance: 5.0,
        ratedPower: 12.0
      },
      terminals: [
        {
          id: 'bulb-t1',
          componentId: 'comp-bulb',
          name: 'Capacitor Positive (+)',
          label: 'T1',
          polarity: 'neutral',
          position: [-0.26, 0.1, 0.0]
        },
        {
          id: 'bulb-t2',
          componentId: 'comp-bulb',
          name: 'Capacitor Ground (-)',
          label: 'T2',
          polarity: 'neutral',
          position: [0.26, 0.1, 0.0]
        }
      ]
    },
    {
      id: 'comp-ammeter',
      type: 'ammeter',
      name: 'Transient Series Ammeter',
      description: 'Monitors instantaneous charging current entering the capacitor.',
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
      name: 'Digital Multimeter (V_c Monitor)',
      description: 'High impedance meter continuously measuring potential across the capacitor.',
      position: [-0.6, 0.35, 0.6],
      rotation: [0, 0.1, 0],
      properties: {
        inputImpedance: 10000000
      },
      terminals: [
        {
          id: 'vm-pos',
          componentId: 'comp-voltmeter',
          name: 'Probe (+ Red)',
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
      toTerminalId: 'bulb-t1',
      color: '#3b82f6'
    },
    {
      id: 'wire-5',
      fromTerminalId: 'bulb-t2',
      toTerminalId: 'ps-neg',
      color: '#181b21'
    },
    // Voltmeter measuring across capacitive element
    {
      id: 'wire-vm-pos',
      fromTerminalId: 'vm-pos',
      toTerminalId: 'bulb-t1',
      color: '#dc2626'
    },
    {
      id: 'wire-vm-neg',
      fromTerminalId: 'vm-neg',
      toTerminalId: 'bulb-t2',
      color: '#181b21'
    }
  ],
  challenges: [
    {
      id: 'ch-energize-rc',
      title: 'Initiate RC Charging',
      instruction: 'Close the knife switch with supply set to 10 V to start transient charging.',
      targetMetric: 'closed_circuit',
      isCompleted: false
    },
    {
      id: 'ch-measure-tau',
      title: 'Observe Time Constant 63.2% Point',
      instruction: 'Observe capacitor voltage increase toward 6.32 V at t = τ.',
      targetMetric: 'current',
      targetValue: 0.67,
      tolerance: 0.08,
      isCompleted: false
    },
    {
      id: 'ch-record-data',
      title: 'Record Transient Data',
      instruction: 'Record at least 3 points during the charging curve in your lab notebook.',
      targetMetric: 'recorded_points',
      targetValue: 3,
      isCompleted: false
    }
  ],
  hints: [
    'At t = 0, an uncharged capacitor acts like an instantaneous short circuit (V_C = 0).',
    'As charge accumulates, back-EMF increases and current decays exponentially.',
    'At t = τ = RC, the capacitor voltage reaches exactly (1 - 1/e) ≈ 63.2% of supply voltage.'
  ],
  theoryNotes: {
    law: 'RC Circuit Transient Kinematics',
    formula: 'V_C(t) = V₀(1 - e^(-t / RC)),  i(t) = (V₀ / R) e^(-t / RC)',
    explanation: 'By Kirchhoff’s loop rule, V₀ - i(t)R - q(t)/C = 0. Substituting i = dq/dt yields a first-order differential equation whose solution is exponential approach toward asymptotic steady-state.',
    derivationSteps: [
      'KVL: V₀ - R(dq/dt) - q/C = 0',
      'Rearrange: dq / (C·V₀ - q) = dt / (RC)',
      'Integrate with initial condition q(0) = 0: ln(1 - q / C·V₀) = -t / RC',
      'Exponentiate: q(t) = C·V₀(1 - e^(-t / RC))',
      'Since V_C = q/C: V_C(t) = V₀(1 - e^(-t / RC))'
    ]
  }
};
