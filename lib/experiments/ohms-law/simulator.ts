import { CircuitComponent, WireConnection, CircuitSimulationResult } from '../types';

/**
 * Deterministic topological circuit analyzer and Ohm's Law physics solver.
 * Solves circuit continuity, branch currents, nodal potential drops,
 * component power dissipation, and measurement instrument readouts.
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
    statusMessage: "Circuit incomplete. Connect wires between equipment.",
    warnings: [],
    diagnosticTips: []
  };

  // Find power supply
  const powerSupply = components.find(c => c.type === 'power-supply');
  if (!powerSupply) {
    result.statusMessage = "No power source present on the workbench.";
    return result;
  }

  const supplyVoltage = Number(powerSupply.properties.voltage ?? 0);
  result.totalVoltage = supplyVoltage;

  // Initialize reading records for all components
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
    result.statusMessage = "No wires connected. Click on terminal posts to route wires.";
    result.diagnosticTips.push("Connect the red terminal (+) of the power supply to the switch or resistor.");
    return result;
  }

  // Build terminal-to-terminal graph
  // Each terminal belongs to a component.
  const terminalMap = new Map<string, { componentId: string; terminalName: string }>();
  for (const comp of components) {
    for (const term of comp.terminals) {
      terminalMap.set(term.id, { componentId: comp.id, terminalName: term.name });
    }
  }

  // Adjacency map: terminalId -> Array of connected terminalIds
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

  // Internal component connectivity:
  // Components like resistors, switches, bulbs, ammeters pass current between their two terminals
  // IF any internal condition is satisfied (e.g. switch is not open).
  const compInternalTerminals = new Map<string, [string, string]>();
  for (const comp of components) {
    if (comp.terminals.length >= 2) {
      compInternalTerminals.set(comp.id, [comp.terminals[0].id, comp.terminals[1].id]);
    }
  }

  const posTerminal = powerSupply.terminals.find(t => t.polarity === 'positive');
  const negTerminal = powerSupply.terminals.find(t => t.polarity === 'negative');

  if (!posTerminal || !negTerminal) {
    result.statusMessage = "Power supply terminals misconfigured.";
    return result;
  }

  // Check if any switch in the circuit is open
  const openSwitches = components.filter(c => c.type === 'switch' && c.properties.isOpen);
  if (openSwitches.length > 0) {
    result.isOpenSwitch = true;
  }

  // Traverse circuit loop from posTerminal to negTerminal using DFS / BFS
  // A path is an alternating sequence of (wire step) and (component pass-through step).
  interface PathNode {
    currentTerminal: string;
    visitedComponents: Set<string>;
    visitedTerminals: Set<string>;
    pathComponents: CircuitComponent[];
  }

  const queue: PathNode[] = [{
    currentTerminal: posTerminal.id,
    visitedComponents: new Set<string>([powerSupply.id]),
    visitedTerminals: new Set<string>([posTerminal.id]),
    pathComponents: []
  }];

  let foundClosedLoop: CircuitComponent[] | null = null;

  while (queue.length > 0) {
    const { currentTerminal, visitedComponents, visitedTerminals, pathComponents } = queue.shift()!;

    // Check connected wires from current terminal
    const wireNeighbors = adj.get(currentTerminal) || [];
    for (const nextTermId of wireNeighbors) {
      if (nextTermId === negTerminal.id) {
        // Reached negative terminal of power supply! Loop closed!
        foundClosedLoop = pathComponents;
        break;
      }

      if (visitedTerminals.has(nextTermId)) continue;

      const nextTermMeta = terminalMap.get(nextTermId);
      if (!nextTermMeta) continue;

      const nextComp = components.find(c => c.id === nextTermMeta.componentId);
      if (!nextComp || visitedComponents.has(nextComp.id)) continue;

      // Now pass through the component to its other terminal
      const internalPair = compInternalTerminals.get(nextComp.id);
      if (!internalPair) continue;

      const otherTermId = internalPair[0] === nextTermId ? internalPair[1] : internalPair[0];

      // If component is a switch and it's open, current cannot pass through
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

    if (foundClosedLoop) break;
  }

  if (!foundClosedLoop) {
    if (result.isOpenSwitch) {
      result.statusMessage = "Switch is OPEN. The circuit is interrupted; no current flows.";
      result.diagnosticTips.push("Click on the knife switch blade to close the circuit.");
    } else {
      result.statusMessage = "Circuit is incomplete (open loop). Check connections.";
      result.diagnosticTips.push("Ensure wires form an unbroken loop from (+) back to (-) of the power supply.");
    }
    return result;
  }

  // We have a closed circuit loop!
  result.isClosedCircuit = true;

  // Calculate equivalent series resistance
  let totalResistance = 0.05; // Base wire contact resistance (ohms)
  for (const comp of foundClosedLoop) {
    if (comp.type === 'resistor') {
      totalResistance += Number(comp.properties.resistance ?? 10);
    } else if (comp.type === 'light-bulb') {
      totalResistance += Number(comp.properties.resistance ?? 10);
    } else if (comp.type === 'ammeter') {
      totalResistance += Number(comp.properties.internalResistance ?? 0.05);
    } else if (comp.type === 'switch') {
      totalResistance += 0.01; // Negligible contact resistance
    }
  }

  result.equivalentResistance = Math.round(totalResistance * 100) / 100;

  // Detect short circuit condition (less than 0.2 ohms total)
  if (totalResistance < 0.2 && supplyVoltage > 0) {
    result.isShortCircuit = true;
    result.totalCurrent = 0;
    result.statusMessage = "DANGER: SHORT CIRCUIT DETECTED! Safety cut-off tripped.";
    result.warnings.push("A direct wire connection without sufficient load resistance causes dangerous overheating.");
    result.diagnosticTips.push("Insert a resistor or light bulb into the circuit loop before powering on.");
    return result;
  }

  // Ohm's Law: I = V / R
  const loopCurrent = supplyVoltage > 0 && totalResistance > 0 
    ? supplyVoltage / totalResistance 
    : 0;

  result.totalCurrent = Math.round(loopCurrent * 1000) / 1000;

  // Calculate individual component drops & powers
  for (const comp of foundClosedLoop) {
    let r = 0;
    if (comp.type === 'resistor') r = Number(comp.properties.resistance ?? 10);
    else if (comp.type === 'light-bulb') r = Number(comp.properties.resistance ?? 10);
    else if (comp.type === 'ammeter') r = Number(comp.properties.internalResistance ?? 0.05);

    const vDrop = loopCurrent * r;
    const power = loopCurrent * loopCurrent * r;

    let brightness = 0;
    if (comp.type === 'light-bulb') {
      const ratedP = Number(comp.properties.ratedPower ?? 5);
      brightness = Math.min(1.0, Math.pow(power / ratedP, 0.65));
      if (power > ratedP * 2.5) {
        result.warnings.push(`Warning: Bulb ${comp.name} is overloaded (${power.toFixed(1)}W)!`);
      }
    }

    result.componentReadings[comp.id] = {
      current: Math.round(loopCurrent * 1000) / 1000,
      voltageDrop: Math.round(vDrop * 100) / 100,
      power: Math.round(power * 100) / 100,
      brightness: Math.round(brightness * 100) / 100,
      isOverloaded: power > 20
    };
  }

  // Check Ammeter reading
  const ammeterInLoop = foundClosedLoop.find(c => c.type === 'ammeter');
  if (ammeterInLoop) {
    result.ammeterReading = result.totalCurrent;
  } else {
    // If not in the main loop, ammeter reads 0
    result.ammeterReading = 0;
  }

  // Check Voltmeter reading
  // Voltmeter measures potential difference across the components it is connected across
  const voltmeter = components.find(c => c.type === 'voltmeter');
  if (voltmeter && voltmeter.terminals.length >= 2) {
    const vPosTerm = voltmeter.terminals.find(t => t.polarity === 'positive') || voltmeter.terminals[0];
    const vNegTerm = voltmeter.terminals.find(t => t.polarity === 'negative') || voltmeter.terminals[1];

    const vPosConnectedTo = adj.get(vPosTerm.id) || [];
    const vNegConnectedTo = adj.get(vNegTerm.id) || [];

    if (vPosConnectedTo.length > 0 && vNegConnectedTo.length > 0) {
      // Find what component is bridged
      const posTargetMeta = terminalMap.get(vPosConnectedTo[0]);
      const negTargetMeta = terminalMap.get(vNegConnectedTo[0]);

      if (posTargetMeta && negTargetMeta) {
        if (posTargetMeta.componentId === negTargetMeta.componentId) {
          // Connected across a single component
          const bridgedCompId = posTargetMeta.componentId;
          const reading = result.componentReadings[bridgedCompId];
          result.voltmeterReading = reading ? reading.voltageDrop : 0;
        } else if (
          (posTargetMeta.componentId === powerSupply.id && negTargetMeta.componentId === powerSupply.id) ||
          posTargetMeta.componentId === powerSupply.id
        ) {
          result.voltmeterReading = supplyVoltage;
        } else {
          // Differential measurement
          const readingA = result.componentReadings[posTargetMeta.componentId]?.voltageDrop || 0;
          result.voltmeterReading = readingA;
        }
      }
    } else {
      // Voltmeter probes unconnected
      result.voltmeterReading = 0;
    }
  }

  // Status message synthesis
  if (supplyVoltage === 0) {
    result.statusMessage = "Circuit closed, but power supply is set to 0.0V. Turn voltage dial up.";
  } else {
    result.statusMessage = `Circuit Active: Current I = ${result.totalCurrent.toFixed(3)} A, Total R = ${result.equivalentResistance.toFixed(1)} Ω, V = ${result.totalVoltage.toFixed(1)} V.`;
  }

  return result;
}
