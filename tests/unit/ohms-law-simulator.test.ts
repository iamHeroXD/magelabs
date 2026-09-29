import test from 'node:test';
import assert from 'node:assert/strict';

import { simulateCircuit } from '../../lib/experiments/ohms-law/simulator';
import { OHMS_LAW_EXPERIMENT } from '../../lib/experiments/ohms-law/definition';
import { CircuitComponent } from '../../lib/experiments/types';

test("Ohm's Law Simulator - Baseline series circuit", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.initialWires));

  // Set switch to closed (isOpen = false)
  const sw = components.find((c: CircuitComponent) => c.type === 'switch')!;
  sw.properties.isOpen = false;

  // Set Power Supply to 12V, Resistor to 10 Ohms
  const ps = components.find((c: CircuitComponent) => c.type === 'power-supply')!;
  ps.properties.voltage = 12.0;

  const res = components.find((c: CircuitComponent) => c.type === 'resistor')!;
  res.properties.resistance = 10.0;

  const result = simulateCircuit(components, wires);

  assert.equal(result.isClosedCircuit, true, "Circuit must be closed");
  assert.equal(result.isShortCircuit, false, "Must not be short circuit");
  assert.equal(result.isOpenSwitch, false, "Switch is closed");

  // Expected resistance ~10.1 ohms (10 + 0.05 ammeter + 0.05 wire contact)
  assert.ok(result.equivalentResistance >= 10.0 && result.equivalentResistance <= 10.2, `R_eq expected ~10.1, got ${result.equivalentResistance}`);

  // Expected current: 12 / 10.1 ~ 1.188 A
  assert.ok(result.totalCurrent >= 1.15 && result.totalCurrent <= 1.22, `Current expected ~1.19A, got ${result.totalCurrent}`);
  assert.equal(result.ammeterReading, result.totalCurrent, "Ammeter in series must measure loop current");
  assert.ok(result.voltmeterReading >= 11.5 && result.voltmeterReading <= 12.0, `Voltmeter across resistor must read ~11.8V, got ${result.voltmeterReading}`);
});

test("Ohm's Law Simulator - Open switch interrupts circuit", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.initialWires));

  // Switch is OPEN
  const sw = components.find((c: CircuitComponent) => c.type === 'switch')!;
  sw.properties.isOpen = true;

  const result = simulateCircuit(components, wires);

  assert.equal(result.isClosedCircuit, false, "Circuit must not be closed when switch is open");
  assert.equal(result.isOpenSwitch, true, "Switch open flag must be true");
  assert.equal(result.totalCurrent, 0, "Current must be zero when switch is open");
  assert.equal(result.ammeterReading, 0, "Ammeter must read 0 A when switch is open");
});

test("Ohm's Law Simulator - Voltage proportionality (V = IR)", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.initialWires));

  const sw = components.find((c: CircuitComponent) => c.type === 'switch')!;
  sw.properties.isOpen = false;

  const res = components.find((c: CircuitComponent) => c.type === 'resistor')!;
  res.properties.resistance = 20.0;

  const ps = components.find((c: CircuitComponent) => c.type === 'power-supply')!;

  // Test at 5V
  ps.properties.voltage = 5.0;
  const res5V = simulateCircuit(components, wires);

  // Test at 10V (double voltage)
  ps.properties.voltage = 10.0;
  const res10V = simulateCircuit(components, wires);

  // Test at 20V (quadruple voltage)
  ps.properties.voltage = 20.0;
  const res20V = simulateCircuit(components, wires);

  assert.ok(Math.abs(res10V.totalCurrent - (res5V.totalCurrent * 2)) < 0.05, "Doubling voltage must double current");
  assert.ok(Math.abs(res20V.totalCurrent - (res5V.totalCurrent * 4)) < 0.05, "Quadrupling voltage must quadruple current");
});

test("Ohm's Law Simulator - Short circuit protection", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.standardComponents));
  
  // Directly connect Power Supply (+) to (-)
  const wires = [
    {
      id: 'short-wire',
      fromTerminalId: 'ps-pos',
      toTerminalId: 'ps-neg',
      color: '#ef4444'
    }
  ];

  const ps = components.find((c: CircuitComponent) => c.type === 'power-supply')!;
  ps.properties.voltage = 12.0;

  const result = simulateCircuit(components, wires);

  assert.equal(result.isShortCircuit, true, "Direct (+) to (-) connection must be identified as short circuit");
  assert.equal(result.totalCurrent, 0, "Safety breaker must set current to 0 on short circuit");
  assert.ok(result.statusMessage.includes("SHORT CIRCUIT"), "Status message must alert short circuit");
});

test("Ohm's Law Simulator - Disconnected wire incomplete circuit", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(OHMS_LAW_EXPERIMENT.standardComponents));
  
  // Provide only one wire
  const wires = [
    {
      id: 'wire-1',
      fromTerminalId: 'ps-pos',
      toTerminalId: 'sw-t1',
      color: '#ef4444'
    }
  ];

  const result = simulateCircuit(components, wires);
  assert.equal(result.isClosedCircuit, false, "Single dangling wire cannot close circuit");
  assert.equal(result.totalCurrent, 0, "Current must be 0 for open circuit");
});
