import { CircuitSimulationResult, CircuitComponent, WireConnection } from '../experiments/types';

export interface AdvisorRequest {
  experimentId: string;
  experimentTitle: string;
  question: string;
  mode?: 'hint' | 'explain' | 'diagnose' | 'deep-dive';
  simulationResult: CircuitSimulationResult;
  components: CircuitComponent[];
  wires: WireConnection[];
  selectedComponentId?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface AdvisorResponse {
  answer: string;
  mode: 'hint' | 'explain' | 'diagnose' | 'deep-dive';
  stateSummary: string;
  suggestedAction?: string;
  confidence: number;
}

export function generateLocalLabAdvice(req: AdvisorRequest): AdvisorResponse {
  const { question, mode = 'explain', simulationResult, components, wires } = req;
  const qLower = question.toLowerCase();

  const powerSupply = components.find(c => c.type === 'power-supply');
  const voltage = Number(powerSupply?.properties.voltage ?? 0);
  const resistor = components.find(c => c.type === 'resistor');
  const resistance = Number(resistor?.properties.resistance ?? 10);
  const sw = components.find(c => c.type === 'switch');
  const isSwitchOpen = Boolean(sw?.properties.isOpen);

  let stateSummary = `V = ${voltage.toFixed(1)}V, I = ${simulationResult.totalCurrent.toFixed(3)}A, R_eq = ${simulationResult.equivalentResistance.toFixed(1)}Ω.`;
  if (!simulationResult.isClosedCircuit) {
    stateSummary += isSwitchOpen ? ' (Knife switch is OPEN)' : ' (Circuit loop is OPEN/INCOMPLETE)';
  } else if (simulationResult.isShortCircuit) {
    stateSummary += ' (DANGER: SHORT CIRCUIT)';
  } else {
    stateSummary += ' (Closed Loop Active)';
  }

  // 1. Diagnosing why bulb is not lighting or current is zero
  if (
    qLower.includes('why') && (qLower.includes('bulb') || qLower.includes('light') || qLower.includes('zero') || qLower.includes('no current') || qLower.includes('not working')) ||
    qLower.includes('what did i do wrong') ||
    mode === 'diagnose'
  ) {
    if (simulationResult.isShortCircuit) {
      return {
        answer: "⚠️ **Safety Cut-Off Active**: A short circuit is detected. There is a direct low-resistance path between the positive (+) and negative (-) terminals of the power supply without sufficient load. The internal breaker tripped to protect the components. Insert a resistor or lamp into the loop.",
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Disconnect the direct wire and route it through the resistor before returning to ground.",
        confidence: 0.98
      };
    }

    if (wires.length === 0) {
      return {
        answer: "There are currently no wires on the workbench. An electrical circuit requires a continuous conductive loop for electrons to circulate.",
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Click the red (+) terminal on the Power Supply to start routing a patch wire.",
        confidence: 0.99
      };
    }

    if (isSwitchOpen) {
      return {
        answer: "The **knife switch is currently OPEN**. In an open switch, there is an air gap with near-infinite resistance, which completely interrupts electron flow. No current can pass until the switch is closed.",
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Click directly on the knife switch blade on the workbench to close the circuit.",
        confidence: 0.99
      };
    }

    if (!simulationResult.isClosedCircuit) {
      return {
        answer: "Your circuit is **incomplete (open loop)**. For electric current to flow, charge carriers need an unbroken closed path from the positive terminal of the power supply, through the apparatus, and back to the negative terminal.",
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Trace your wire path: Power Supply (+) -> Switch -> Resistor -> Ammeter -> Power Supply (-).",
        confidence: 0.95
      };
    }

    if (voltage === 0) {
      return {
        answer: "Your circuit connections are correct and closed, but the **Power Supply voltage is set to 0.0 Volts**. Without an electrical potential difference (V = 0), there is no electrostatic driving force to propel charge carriers ($I = V/R = 0/R = 0$).",
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Turn the voltage knob clockwise or use the voltage slider to apply 6V or 12V.",
        confidence: 0.99
      };
    }

    if (simulationResult.totalCurrent > 0) {
      return {
        answer: `The circuit is actively energized! Current is flowing at **${simulationResult.totalCurrent.toFixed(3)} Amperes**. Voltage drop across the resistor is **${(simulationResult.totalCurrent * resistance).toFixed(2)} V**. Everything is operating according to Ohm's Law.`,
        mode: 'diagnose',
        stateSummary,
        suggestedAction: "Record this measurement point in your Lab Notebook to construct your V-I characteristic graph.",
        confidence: 0.95
      };
    }
  }

  // 2. Hint Mode
  if (mode === 'hint' || qLower.includes('hint')) {
    if (isSwitchOpen) {
      return {
        answer: "💡 **Hint**: Look closely at the mechanical knife switch. Is the copper blade making contact with the jaw terminal?",
        mode: 'hint',
        stateSummary,
        suggestedAction: "Click the switch arm to close it.",
        confidence: 0.95
      };
    }
    if (voltage < 2.0) {
      return {
        answer: "💡 **Hint**: Try turning up the voltage dial. Current $I$ is directly proportional to potential difference $V$. What happens to the ammeter readout when you double the voltage?",
        mode: 'hint',
        stateSummary,
        suggestedAction: "Increase voltage to 8V or 12V.",
        confidence: 0.92
      };
    }
    return {
      answer: "💡 **Hint**: Keep resistance constant, vary voltage across 4 different values (e.g. 4V, 8V, 12V, 16V), and record the current in the Lab Notebook. Notice how the ratio $V / I$ remains steady!",
      mode: 'hint',
      stateSummary,
      suggestedAction: "Log your data points in the Notebook panel on the right.",
      confidence: 0.93
    };
  }

  // 3. Question about increasing resistance
  if (qLower.includes('increase') && qLower.includes('resistance')) {
    return {
      answer: "According to Ohm's Law ($I = \\frac{V}{R}$), electric current is **inversely proportional** to electrical resistance when voltage is held constant.\n\nIf you increase resistance (for example from 10 Ω to 50 Ω at 12 V):\n- At 10 Ω: $I = 12 / 10 = 1.20\\text{ A}$\n- At 50 Ω: $I = 12 / 50 = 0.24\\text{ A}$\n\nGreater resistance increases internal lattice scattering of electrons, reducing the net rate of charge flow through the cross-section per second.",
      mode: 'explain',
      stateSummary,
      suggestedAction: "Switch resistor resistance in the controls to see the ammeter needle drop.",
      confidence: 0.97
    };
  }

  // 4. Question about slope or graph
  if (qLower.includes('slope') || qLower.includes('graph') || qLower.includes('v-i')) {
    return {
      answer: "In a **Voltage vs. Current (V-I)** graph:\n\n- If Voltage $V$ is plotted on the vertical y-axis and Current $I$ on the horizontal x-axis, the line follows $y = mx$, where $V = R \\cdot I$.\n- The **slope** of the line equals the electrical resistance: $\\text{Slope} = \\frac{\\Delta V}{\\Delta I} = R$.\n- A steeper line indicates a higher resistance component, while a gentler slope represents lower resistance.",
      mode: 'explain',
      stateSummary,
      suggestedAction: "View the dynamic V-I scatter plot in the Measurements panel.",
      confidence: 0.96
    };
  }

  // 5. Deep-dive mode
  if (mode === 'deep-dive' || qLower.includes('deep') || qLower.includes('derivation')) {
    return {
      answer: "🔬 **Microscopic Derivation of Ohm's Law**:\n\n1. When potential difference $V$ is applied across conductor length $L$, it sets up an electric field $E = V / L$.\n2. Each conduction electron of charge $e$ experiences electrostatic force $F = eE = e(V / L)$.\n3. Between collisions with lattice ions (relaxation time $\\tau$), electrons reach average drift velocity $v_d = \\frac{e \\tau}{m} E$.\n4. Current density is $J = n e v_d = \\left( \\frac{n e^2 \\tau}{m} \\right) E = \\sigma E$, where $\\sigma$ is electrical conductivity.\n5. Since total current $I = J \\cdot A$ and $V = E \\cdot L$, we get:\n$$I = \\sigma A \\frac{V}{L} = \\frac{V}{\\rho L / A} = \\frac{V}{R}$$\nThis microscopically proves $V = IR$.",
      mode: 'deep-dive',
      stateSummary,
      suggestedAction: "Review the theoretical notes tab in the lab overlay.",
      confidence: 0.99
    };
  }

  // Default general explanation
  return {
    answer: `In this laboratory, you are investigating **Ohm's Law: $V = I \\cdot R$**.\n\nCurrent state on your bench: **${voltage.toFixed(1)} V**, **${simulationResult.totalCurrent.toFixed(3)} A**, with **${resistance} Ω** resistance.\n\nTry varying the voltage knob to see how current scales proportionally, or toggle the switch to observe how an open circuit stops charge flow.`,
    mode: 'explain',
    stateSummary,
    suggestedAction: "Use the controls panel to adjust voltage or log measurement data.",
    confidence: 0.90
  };
}
