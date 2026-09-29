import { ExperimentDefinition } from '../types';

export const OHMS_LAW_EXPERIMENT: ExperimentDefinition = {
  id: 'ohms-law',
  title: "Ohm's Law & Circuit Analysis",
  subtitle: "Investigating the fundamental relationship between Voltage, Current, and Resistance",
  subject: 'physics',
  difficulty: 'introductory',
  estimatedDuration: '15-20 min',
  description: "Construct a direct-current circuit on a laboratory workbench. Manipulate power supply voltage and load resistance, take precise multimeter and ammeter readings, and plot empirical V-I curves to discover Ohm's law (V = IR).",
  learningObjectives: [
    "Assemble a complete series circuit with a DC power supply, resistor, switch, and meters.",
    "Demonstrate that electric current (I) is directly proportional to potential difference (V).",
    "Calculate electrical resistance using the slope of empirical V-I measurement data.",
    "Observe and diagnose open-circuit, short-circuit, and switch interruption states.",
    "Understand power dissipation (P = I²R) and its effect on filament illumination."
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
      id: 'comp-res',
      type: 'resistor',
      name: 'Precision Ceramic Resistor',
      description: 'High-stability laboratory resistor with 4 standard EIA color code bands.',
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
          name: 'Left Terminal',
          label: 'A',
          polarity: 'neutral',
          position: [-0.45, 0.08, 0.0]
        },
        {
          id: 'res-t2',
          componentId: 'comp-res',
          name: 'Right Terminal',
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
      description: 'Measures series current flow with high accuracy and low internal shunt resistance.',
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
      id: 'comp-bulb',
      type: 'light-bulb',
      name: 'Incandescent Filament Lamp',
      description: 'Clear miniature Edison bulb. Radiates warm illumination proportional to I²R.',
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
          name: 'Center Contact (+)',
          label: 'T1',
          polarity: 'neutral',
          position: [-0.26, 0.1, 0.0]
        },
        {
          id: 'bulb-t2',
          componentId: 'comp-bulb',
          name: 'Thread Base (-)',
          label: 'T2',
          polarity: 'neutral',
          position: [0.26, 0.1, 0.0]
        }
      ]
    },
    {
      id: 'comp-voltmeter',
      type: 'voltmeter',
      name: 'Digital Multimeter / Voltmeter',
      description: 'High input impedance digital meter for measuring potential difference across components.',
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
      color: '#ef4444' // Red
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
      color: '#3b82f6' // Blue
    },
    {
      id: 'wire-4',
      fromTerminalId: 'amm-out',
      toTerminalId: 'ps-neg',
      color: '#181b21' // Black
    },
    // Voltmeter probes measuring across resistor
    {
      id: 'wire-vm-pos',
      fromTerminalId: 'vm-pos',
      toTerminalId: 'res-t1',
      color: '#dc2626'
    },
    {
      id: 'wire-vm-neg',
      fromTerminalId: 'vm-neg',
      toTerminalId: 'res-t2',
      color: '#181b21'
    }
  ],
  challenges: [
    {
      id: 'ch-close-circuit',
      title: 'Energize the Circuit',
      instruction: 'Ensure the knife switch is closed and power supply voltage is set above 2.0 V.',
      targetMetric: 'closed_circuit',
      isCompleted: false
    },
    {
      id: 'ch-record-points',
      title: 'Collect V-I Data Points',
      instruction: 'Vary the power supply voltage (e.g. 4V, 8V, 12V, 16V) and record at least 4 distinct data points in the lab notebook.',
      targetMetric: 'recorded_points',
      targetValue: 4,
      isCompleted: false
    },
    {
      id: 'ch-target-current',
      title: 'Calibrate Current to 1.0 Ampere',
      instruction: 'Adjust the voltage knob until the ammeter displays exactly 1.00 A (±0.05 A).',
      targetMetric: 'current',
      targetValue: 1.0,
      tolerance: 0.05,
      isCompleted: false
    },
    {
      id: 'ch-swap-resistor',
      title: 'Observe Resistance Invariance',
      instruction: 'Change the resistor value to 50 Ω and record how the current response scales.',
      targetMetric: 'resistance',
      targetValue: 50.0,
      isCompleted: false
    }
  ],
  hints: [
    "If the ammeter reads 0.00 A, verify that the knife switch arm is clicked into the closed position.",
    "Ohm's law states V = I × R. If you keep R constant, doubling the voltage V will double the current I.",
    "The slope of a Voltage versus Current plot (ΔV / ΔI) directly equals the electrical resistance in Ohms.",
    "A direct path from (+) to (-) without a resistor causes a dangerous short circuit; MageLabs safety cutoff will trip."
  ],
  theoryNotes: {
    law: "Ohm's Law",
    formula: "V = I · R",
    explanation: "Georg Simon Ohm published in 1827 that the current through a conductor between two points is directly proportional to the voltage across the two points, provided the physical conditions (such as temperature) remain constant.",
    derivationSteps: [
      "Electric potential difference (V) creates an electric field that exerts electrostatic force F = qE on charge carriers.",
      "The drift velocity of free electrons is hindered by lattice scattering collisions in the conductor material.",
      "Macroscopic current I = n·q·A·v_d is directly proportional to the driving field E = V / L.",
      "Combining parameters yields V = I × (ρL / A) = I × R, establishing Ohm's Law."
    ]
  }
};
