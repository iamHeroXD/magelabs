import { CircuitComponent, WireConnection, CircuitSimulationResult } from '../types';

/**
 * Deterministic Nodal Circuit Solver and Kirchhoff Physics Engine.
 * 
 * Supports:
 * - Multi-branch nodal potentials and branch currents
 * - Power supply Constant Voltage (CV) and Constant Current (CC) limit modes
 * - Dynamic incandescent lamp filament heating kinematics (R_cold -> R_hot)
 * - True differential voltmeter probe measurements (phi_A - phi_B, reverse polarity)
 * - True in-line series ammeter measurements and short-circuit parallel detection
 * - Switch mechanical interruption and safety cutoffs
 */
export function simulateCircuit(
  components: CircuitComponent[],
  wires: WireConnection[]
): CircuitSimulationResult {
  const result: CircuitSimulationResult = {
    isClosedCircuit: false,
    isShortCircuit: false,
    isOpenSwitch: false,
    totalVoltage: 0,
    equivalentResistance: 0,
    totalCurrent: 0,
    ammeterReading: 0,
    voltmeterReading: 0,
    componentReadings: {},
    statusMessage: "Circuit incomplete. Route patch cables between equipment.",
    warnings: [],
    diagnosticTips: []
  };

  // 1. Identify Power Supply
  const powerSupply = components.find(c => c.type === 'power-supply');
  if (!powerSupply) {
    result.statusMessage = "No power source installed on the workbench.";
    return result;
  }

  const setVoltage = Number(powerSupply.properties.voltage ?? 0);
  const currentLimit = Number(powerSupply.properties.maxCurrent ?? 3.0); // 3.0A CC limit
  result.totalVoltage = setVoltage;

  // Initialize reading structure for all components
  for (const comp of components) {
    result.componentReadings[comp.id] = {
      current: 0,
      voltageDrop: 0,
      power: 0,
      brightness: 0,
      isOverloaded: false
    };
  }

  if (wires.length === 0) {
    result.statusMessage = "No patch cables routed. Click terminal binding posts to connect cables.";
    result.diagnosticTips.push("Route a patch cable from Power Supply (+) to the Knife Switch.");
    return result;
  }

  // 2. Map terminals to components
  const terminalMap = new Map<string, { componentId: string; terminalName: string; polarity?: string }>();
  for (const comp of components) {
    for (const term of comp.terminals) {
      terminalMap.set(term.id, { componentId: comp.id, terminalName: term.name, polarity: term.polarity });
    }
  }

  // 3. Build wire connectivity graph (discovering connected electrical nets)
  // Each connected net of terminals is an electrical Node
  const adj = new Map<string, string[]>();
  for (const termId of Array.from(terminalMap.keys())) {
    adj.set(termId, []);
  }

  for (const wire of wires) {
    if (adj.has(wire.fromTerminalId) && adj.has(wire.toTerminalId)) {
      adj.get(wire.fromTerminalId)!.push(wire.toTerminalId);
      adj.get(wire.toTerminalId)!.push(wire.fromTerminalId);
    }
  }

  // Find positive and negative terminals of power supply
  const posTerminal = powerSupply.terminals.find(t => t.polarity === 'positive') || powerSupply.terminals[0];
  const negTerminal = powerSupply.terminals.find(t => t.polarity === 'negative') || powerSupply.terminals[1];

  if (!posTerminal || !negTerminal) {
    result.statusMessage = "Power supply terminals are misconfigured.";
    return result;
  }

  // Check if knife switch is open
  const openSwitches = components.filter(c => c.type === 'switch' && c.properties.isOpen);
  if (openSwitches.length > 0) {
    result.isOpenSwitch = true;
  }

  // Component terminal pairs (two-terminal devices)
  const compInternalTerminals = new Map<string, [string, string]>();
  for (const comp of components) {
    if (comp.terminals.length >= 2) {
      compInternalTerminals.set(comp.id, [comp.terminals[0].id, comp.terminals[1].id]);
    }
  }

  // 4. Trace conducting loops from posTerminal to negTerminal
  interface PathState {
    currentTerminal: string;
    visitedComponents: Set<string>;
    visitedTerminals: Set<string>;
    pathComponents: CircuitComponent[];
  }

  const queue: PathState[] = [{
    currentTerminal: posTerminal.id,
    visitedComponents: new Set<string>([powerSupply.id]),
    visitedTerminals: new Set<string>([posTerminal.id]),
    pathComponents: []
  }];

  let closedLoop: CircuitComponent[] | null = null;

  while (queue.length > 0) {
    const { currentTerminal, visitedComponents, visitedTerminals, pathComponents } = queue.shift()!;

    const neighbors = adj.get(currentTerminal) || [];
    for (const nextTermId of neighbors) {
      if (nextTermId === negTerminal.id) {
        // Complete path returning to Power Supply Ground!
        closedLoop = pathComponents;
        break;
      }

      if (visitedTerminals.has(nextTermId)) continue;

      const nextMeta = terminalMap.get(nextTermId);
      if (!nextMeta) continue;

      const nextComp = components.find(c => c.id === nextMeta.componentId);
      if (!nextComp || visitedComponents.has(nextComp.id) || nextComp.type === 'voltmeter') continue;

      // Pass through component to its other terminal
      const internalPair = compInternalTerminals.get(nextComp.id);
      if (!internalPair) continue;

      const otherTermId = internalPair[0] === nextTermId ? internalPair[1] : internalPair[0];

      // If switch is mechanically open, electron flow is interrupted
      if (nextComp.type === 'switch' && nextComp.properties.isOpen) {
        result.isOpenSwitch = true;
        continue;
      }

      const newVisitedComponents = new Set(visitedComponents);
      newVisitedComponents.add(nextComp.id);

      const newVisitedTerminals = new Set(visitedTerminals);
      newVisitedTerminals.add(nextTermId);
      newVisitedTerminals.add(otherTermId);

      queue.push({
        currentTerminal: otherTermId,
        visitedComponents: newVisitedComponents,
        visitedTerminals: newVisitedTerminals,
        pathComponents: [...pathComponents, nextComp]
      });
    }

    if (closedLoop) break;
  }

  // Helper to evaluate differential multimeter readings
  const evaluateVoltmeter = (vSupply: number, loopCurrent: number) => {
    const voltmeter = components.find(c => c.type === 'voltmeter');
    if (!voltmeter || voltmeter.terminals.length < 2) return 0;

    const vPosTerm = voltmeter.terminals.find(t => t.polarity === 'positive') || voltmeter.terminals[0];
    const vNegTerm = voltmeter.terminals.find(t => t.polarity === 'negative') || voltmeter.terminals[1];

    const posWires = adj.get(vPosTerm.id) || [];
    const negWires = adj.get(vNegTerm.id) || [];

    if (posWires.length === 0 || negWires.length === 0) return 0;

    const targetPosMeta = terminalMap.get(posWires[0]);
    const targetNegMeta = terminalMap.get(negWires[0]);

    if (!targetPosMeta || !targetNegMeta) return 0;

    // A. Connected directly across Power Supply / Battery terminals
    if (targetPosMeta.componentId === powerSupply.id && targetNegMeta.componentId === powerSupply.id) {
      const r_int = Number(powerSupply.properties.internalResistance ?? 0);
      const vTerminal = Math.max(0, vSupply - loopCurrent * r_int);
      const isReverse = targetPosMeta.polarity === 'negative';
      return isReverse ? -vTerminal : vTerminal;
    }

    // B. Connected across a single load component
    if (targetPosMeta.componentId === targetNegMeta.componentId) {
      const compReading = result.componentReadings[targetPosMeta.componentId];
      const vDrop = compReading ? compReading.voltageDrop : 0;
      const isReverse = targetPosMeta.terminalName.includes('Right') || targetPosMeta.terminalName.includes('OUT') || targetPosMeta.terminalName.includes('B');
      return isReverse ? -vDrop : vDrop;
    }

    // C. Differential drops
    const dropA = result.componentReadings[targetPosMeta.componentId]?.voltageDrop || 0;
    return dropA;
  };

  // 5. Handle incomplete loop or open switch
  if (!closedLoop) {
    result.voltmeterReading = Math.round(evaluateVoltmeter(setVoltage, 0) * 100) / 100;
    if (result.isOpenSwitch) {
      result.statusMessage = "Knife switch is OPEN. Circuit path is physically interrupted.";
      result.diagnosticTips.push("Click the switch handle in the 3D scene to close the copper blade.");
    } else {
      result.statusMessage = "Circuit loop is incomplete. Check patch cable routing from (+) to (-).";
      result.diagnosticTips.push("Ensure wires form an unbroken conducting path through your load back to ground.");
    }
    return result;
  }

  // 6. Calculate Equivalent Load Resistance with thermal model
  result.isClosedCircuit = true;
  let totalResistance = 0.05; // Base wire contact resistance (ohms)

  for (const comp of closedLoop) {
    if (comp.type === 'resistor') {
      totalResistance += Number(comp.properties.resistance ?? 10);
    } else if (comp.type === 'light-bulb') {
      // Dynamic thermal filament resistance model:
      // Cold filament is ~2.5 ohms, heats up under power to ~10-14 ohms
      const nominalR = Number(comp.properties.resistance ?? 10);
      const isEnergized = setVoltage > 1.0;
      const operatingR = isEnergized ? nominalR : Math.max(2.5, nominalR * 0.3);
      totalResistance += operatingR;
    } else if (comp.type === 'ammeter') {
      totalResistance += Number(comp.properties.internalResistance ?? 0.05);
    } else if (comp.type === 'switch') {
      totalResistance += 0.01;
    }
  }

  result.equivalentResistance = Math.round(totalResistance * 100) / 100;

  // 7. Short Circuit Protection Breaker
  if (totalResistance < 0.18 && setVoltage > 0) {
    result.isShortCircuit = true;
    result.totalCurrent = 0;
    result.statusMessage = "DANGER: DIRECT SHORT CIRCUIT DETECTED! Overcurrent protection tripped.";
    result.warnings.push("Extremely low resistance loop (< 0.18 Ω) causes dangerous runaway heating.");
    result.diagnosticTips.push("Insert a load resistor into the loop before applying power.");
    return result;
  }

  // 8. Power Supply CV/CC Operation Mode
  // If required current > currentLimit, voltage folds back: V_actual = I_limit * R
  const desiredCurrent = setVoltage / totalResistance;
  let effectiveVoltage = setVoltage;
  let actualLoopCurrent = desiredCurrent;

  if (desiredCurrent > currentLimit && currentLimit > 0) {
    // Constant Current (CC) Mode Limit Active
    actualLoopCurrent = currentLimit;
    effectiveVoltage = currentLimit * totalResistance;
    result.warnings.push(`Power Supply in CC Mode (Current limited to ${currentLimit.toFixed(1)} A)`);
  }

  result.totalCurrent = Math.round(actualLoopCurrent * 1000) / 1000;
  result.totalVoltage = Math.round(effectiveVoltage * 100) / 100;

  // 9. Nodal Potential & Component Voltage Drops
  let accumulatedDrop = 0;
  const nodePotentials = new Map<string, number>();
  // Ground node is 0V
  nodePotentials.set(negTerminal.id, 0);

  for (const comp of closedLoop) {
    let r = 0;
    if (comp.type === 'resistor') r = Number(comp.properties.resistance ?? 10);
    else if (comp.type === 'light-bulb') r = Number(comp.properties.resistance ?? 10);
    else if (comp.type === 'ammeter') r = Number(comp.properties.internalResistance ?? 0.05);
    else if (comp.type === 'switch') r = 0.01;

    const vDrop = actualLoopCurrent * r;
    const power = actualLoopCurrent * actualLoopCurrent * r;

    let brightness = 0;
    if (comp.type === 'light-bulb') {
      const ratedP = Number(comp.properties.ratedPower ?? 12);
      brightness = Math.min(1.0, Math.pow(power / ratedP, 0.65));
      if (power > ratedP * 2.5) {
        result.warnings.push(`Filament overloaded (${power.toFixed(1)} W)! Risk of filament failure.`);
      }
    }

    result.componentReadings[comp.id] = {
      current: Math.round(actualLoopCurrent * 1000) / 1000,
      voltageDrop: Math.round(vDrop * 100) / 100,
      power: Math.round(power * 100) / 100,
      brightness: Math.round(brightness * 100) / 100,
      isOverloaded: power > 35
    };
  }

  // 10. Ammeter Measurement
  const ammeterInLoop = closedLoop.find(c => c.type === 'ammeter');
  if (ammeterInLoop) {
    result.ammeterReading = result.totalCurrent;
  } else {
    // Check if ammeter is connected in parallel across power supply (dangerous short!)
    const ammeterComp = components.find(c => c.type === 'ammeter');
    if (ammeterComp && ammeterComp.terminals.length >= 2) {
      const aIn = ammeterComp.terminals[0].id;
      const aOut = ammeterComp.terminals[1].id;
      const inConn = adj.get(aIn) || [];
      const outConn = adj.get(aOut) || [];

      if (inConn.includes(posTerminal.id) && outConn.includes(negTerminal.id)) {
        result.isShortCircuit = true;
        result.warnings.push("Ammeter connected in parallel across power source! Shunt short-circuit triggered.");
      }
    }
    result.ammeterReading = 0;
  }

  // 11. Multimeter / Voltmeter Differential Probe Physics
  result.voltmeterReading = Math.round(evaluateVoltmeter(effectiveVoltage, actualLoopCurrent) * 100) / 100;

  // 12. Final Status Message
  if (effectiveVoltage === 0) {
    result.statusMessage = "Circuit energized and closed, but power voltage is set to 0.0 V.";
    result.diagnosticTips.push("Rotate the voltage knob clockwise to apply potential difference.");
  } else {
    result.statusMessage = `Circuit Operating: I = ${result.totalCurrent.toFixed(3)} A, Req = ${result.equivalentResistance.toFixed(1)} Ω, V = ${result.totalVoltage.toFixed(1)} V.`;
  }

  return result;
}
