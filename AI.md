# MageLabs Context-Aware AI Guidance System

## 1. Grounded Context Injection

The AI assistant receives full structured telemetry from the virtual laboratory bench:

```json
{
  "experimentId": "ohms-law",
  "experimentTitle": "Ohm's Law & Circuit Analysis",
  "simulationResult": {
    "isClosedCircuit": true,
    "isOpenSwitch": false,
    "isShortCircuit": false,
    "totalVoltage": 12.0,
    "equivalentResistance": 10.1,
    "totalCurrent": 1.188,
    "ammeterReading": 1.188,
    "voltmeterReading": 11.88
  },
  "mode": "explain",
  "question": "What happens if I increase resistance?"
}
```

## 2. Pedagogical Modes

- **Hint**: Prompts the student with Socratic questions without spoiling direct numerical answers.
- **Explain**: Teaches the physical mechanism (electrostatic potential, electron drift velocity, lattice scattering).
- **Diagnose**: Inspects open knife switches, 0V power settings, or loose wires and gives corrective actions.
- **Deep-Dive**: Provides microscopic derivations and Maxwell-Boltzmann charge carrier transport.

## 3. Graceful Fallback Engine

When `GEMINI_API_KEY` is not provided or network is offline, `lib/ai/local-advisor.ts` provides deterministic, state-grounded scientific responses with 100% reliability.
