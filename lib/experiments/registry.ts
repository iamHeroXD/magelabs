import { ExperimentDefinition } from './types';
import { OHMS_LAW_EXPERIMENT } from './ohms-law/definition';
import { SERIES_PARALLEL_EXPERIMENT } from './series-parallel/definition';
import { INTERNAL_RESISTANCE_EXPERIMENT } from './internal-resistance/definition';
import { RC_TRANSIENT_EXPERIMENT } from './rc-transient/definition';

export const EXPERIMENT_CATALOG: ExperimentDefinition[] = [
  OHMS_LAW_EXPERIMENT,
  SERIES_PARALLEL_EXPERIMENT,
  INTERNAL_RESISTANCE_EXPERIMENT,
  RC_TRANSIENT_EXPERIMENT,
  {
    id: 'simple-pendulum',
    title: 'Simple Pendulum & Gravitational Acceleration',
    subtitle: 'Determining local gravity (g) through harmonic oscillation period analysis',
    subject: 'physics',
    difficulty: 'introductory',
    estimatedDuration: '15 min',
    description: 'Vary string length and bob mass to investigate periodic motion and compute gravitational acceleration g = 4π²L / T².',
    learningObjectives: [
      'Measure oscillation period using a digital photogate timer',
      'Demonstrate independence of period from bob mass at small angles',
      'Calculate experimental gravitational acceleration g'
    ],
    standardComponents: [],
    initialWires: [],
    challenges: [
      {
        id: 'ch-pendulum-period',
        title: 'Calibrate Photogate Timer',
        instruction: 'Release bob at an amplitude under 15° and record 10 complete periods.',
        targetMetric: 'recorded_points',
        targetValue: 3,
        isCompleted: false
      }
    ],
    hints: ['Small angle approximation applies when amplitude is under 15 degrees.'],
    theoryNotes: {
      law: 'Simple Harmonic Motion',
      formula: 'T = 2π √(L/g)',
      explanation: 'For small oscillations, restoring force is proportional to displacement, producing isochronous oscillation.',
      derivationSteps: [
        'Restoring torque τ = -m g L sin(θ)',
        'For small angles sin(θ) ≈ θ',
        'Equation of motion: d²θ/dt² + (g/L)θ = 0',
        'Angular frequency ω = √(g/L), period T = 2π/ω = 2π√(L/g)'
      ]
    }
  },
  {
    id: 'acid-base-titration',
    title: 'Strong Acid-Strong Base Volumetric Titration',
    subtitle: 'Determining unknown HCl concentration using standardized NaOH and phenolphthalein',
    subject: 'chemistry',
    difficulty: 'intermediate',
    estimatedDuration: '20 min',
    description: 'Operate a precision burette with dropwise titrant control, monitor pH electrode readouts in real-time, and identify the equivalence stoichiometric endpoint.',
    learningObjectives: [
      'Calibrate digital pH meter and prepare volumetric burette',
      'Perform dropwise titration until permanent faint pink endpoint appears',
      'Calculate molarity using stoichiometric relationship MaVa = MbVb'
    ],
    standardComponents: [],
    initialWires: [],
    challenges: [
      {
        id: 'ch-titration-endpoint',
        title: 'Identify Equivalence Point',
        instruction: 'Add titrant dropwise until permanent faint pink color is achieved (pH ≈ 7.0 - 8.2).',
        targetMetric: 'recorded_points',
        targetValue: 3,
        isCompleted: false
      }
    ],
    hints: ['Rinse burette tip before recording initial meniscus reading.'],
    theoryNotes: {
      law: 'Neutralization Stoichiometry',
      formula: 'M_acid · V_acid = M_base · V_base',
      explanation: 'At the stoichiometric equivalence point, moles of hydronium ions (H3O+) equal moles of hydroxide ions (OH-).',
      derivationSteps: [
        'HCl + NaOH -> NaCl + H2O',
        'n(H+) = n(OH-)',
        'C_a · V_a = C_b · V_b'
      ]
    }
  },
  {
    id: 'compound-microscope',
    title: 'Compound Light Microscope & Cell Morphology',
    subtitle: 'High-magnification cellular observation of Onion Allium epidermis and Human Cheek cells',
    subject: 'biology',
    difficulty: 'introductory',
    estimatedDuration: '15 min',
    description: 'Adjust coarse/fine focus, iris condenser diaphragm, and 4x/10x/40x objectives to examine cell walls, nuclei, and chloroplasts.',
    learningObjectives: [
      'Mount glass specimen slide onto mechanical stage',
      'Adjust condenser aperture and brightness for optimal contrast',
      'Identify cell wall, cell membrane, cytoplasm, and nucleus'
    ],
    standardComponents: [],
    initialWires: [],
    challenges: [
      {
        id: 'ch-microscope-focus',
        title: 'Optimize Specimen Contrast',
        instruction: 'Focus specimen under 10x objective and adjust condenser diaphragm aperture.',
        targetMetric: 'recorded_points',
        targetValue: 2,
        isCompleted: false
      }
    ],
    hints: ['Always start focusing with the lowest magnification 4x objective.'],
    theoryNotes: {
      law: 'Optical Magnification',
      formula: 'Total Magnification = M_ocular · M_objective',
      explanation: 'Compound microscope uses objective lens to create real enlarged image, magnified further by ocular eyepiece.',
      derivationSteps: [
        'Objective magnification = -v / u',
        'Eyepiece magnification = D / f_e',
        'Total = (L / f_o) · (D / f_e)'
      ]
    }
  }
];

export function getExperimentById(id: string): ExperimentDefinition | undefined {
  return EXPERIMENT_CATALOG.find(e => e.id === id);
}

export function getExperimentsBySubject(subject?: string): ExperimentDefinition[] {
  if (!subject || subject === 'all') return EXPERIMENT_CATALOG;
  return EXPERIMENT_CATALOG.filter(e => e.subject === subject);
}
