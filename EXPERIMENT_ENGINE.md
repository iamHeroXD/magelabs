# MageLabs Experiment Engine Specification

## 1. Domain Modeling

The experiment engine decouples experiment definitions from rendering components, making it straightforward to add new laboratories across Physics, Chemistry, and Biology.

Every experiment implements the `ExperimentDefinition` contract:

```typescript
export interface ExperimentDefinition {
  id: string;
  title: string;
  subtitle: string;
  subject: 'physics' | 'chemistry' | 'biology';
  difficulty: 'introductory' | 'intermediate' | 'advanced';
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
```

## 2. Circuit Component Schema

Each physical component on the workbench defines its local terminal binding posts:

```typescript
export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  terminals: Terminal[];
  properties: Record<string, any>;
}
```

## 3. Mathematical Verification of Ohm's Law

The circuit solver evaluates:
1. **Loop Continuity**: Breadth-first graph traversal from `ps-pos` to `ps-neg`.
2. **Equivalent Resistance**:
   $$R_{eq} = R_{resistor} + R_{bulb} + R_{ammeter} + R_{wire}$$
3. **Loop Current**:
   $$I = \frac{V_{supply}}{R_{eq}}$$
4. **Component Voltage Drop**:
   $$V_i = I \cdot R_i$$
5. **Component Power Dissipation**:
   $$P_i = I^2 \cdot R_i$$
6. **Luminous Output**:
   $$\text{Brightness} = \min\left(1.0, \left(\frac{P_{bulb}}{P_{rated}}\right)^{0.65}\right)$$

## 4. Extensibility Roadmap

- **Physics**: Simple Pendulum ($T = 2\pi\sqrt{L/g}$), Convex Lens Optics ($\frac{1}{f} = \frac{1}{v} - \frac{1}{u}$).
- **Chemistry**: Strong Acid-Base Titration ($M_a V_a = M_b V_b$), pH Buffer Equilibrium.
- **Biology**: Compound Light Microscopy (Numerical Aperture, Cell Wall Identification).
