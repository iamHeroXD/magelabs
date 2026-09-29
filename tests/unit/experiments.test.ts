import test from 'node:test';
import assert from 'node:assert/strict';

import { simulateCircuit } from '../../lib/experiments/ohms-law/simulator';
import { SERIES_PARALLEL_EXPERIMENT } from '../../lib/experiments/series-parallel/definition';
import { INTERNAL_RESISTANCE_EXPERIMENT } from '../../lib/experiments/internal-resistance/definition';
import { RC_TRANSIENT_EXPERIMENT } from '../../lib/experiments/rc-transient/definition';
import { CircuitComponent } from '../../lib/experiments/types';

test("Series & Parallel Simulator - Two resistors in series R_eq = R1 + R2", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(SERIES_PARALLEL_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(SERIES_PARALLEL_EXPERIMENT.initialWires));

  // Switch closed
  const sw = components.find(c => c.type === 'switch')!;
  sw.properties.isOpen = false;

  // 12V supply, R1 = 10Ω, R2 = 20Ω
  const result = simulateCircuit(components, wires);

  assert.equal(result.isClosedCircuit, true, "Series network must be closed");
  assert.equal(result.isOpenSwitch, false);

  // Expected R_eq ≈ 30.1 Ω (10 + 20 + ammeter + contacts)
  assert.ok(result.equivalentResistance >= 30.0 && result.equivalentResistance <= 30.3, `R_eq expected ~30.1Ω, got ${result.equivalentResistance}`);

  // Expected Current = 12 / 30.1 ≈ 0.398 A
  assert.ok(result.totalCurrent >= 0.38 && result.totalCurrent <= 0.42, `Current expected ~0.4A, got ${result.totalCurrent}`);
  assert.equal(result.ammeterReading, result.totalCurrent, "Ammeter in series must measure total branch current");

  // Voltmeter across R1 (10Ω): V1 = I * R1 ≈ 0.398 * 10 ≈ 3.98 V
  assert.ok(result.voltmeterReading >= 3.8 && result.voltmeterReading <= 4.2, `Voltmeter across R1 expected ~4.0V, got ${result.voltmeterReading}`);
});

test("Internal Resistance of a Cell - Terminal voltage drop under load", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(INTERNAL_RESISTANCE_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(INTERNAL_RESISTANCE_EXPERIMENT.initialWires));

  const sw = components.find(c => c.type === 'switch')!;
  
  // Case A: Switch is OPEN (Open-circuit EMF measurement)
  sw.properties.isOpen = true;
  const resultOpen = simulateCircuit(components, wires);
  assert.equal(resultOpen.isClosedCircuit, false);
  assert.equal(resultOpen.totalCurrent, 0);
  assert.equal(resultOpen.voltmeterReading, 9.0, "Open-circuit EMF must read 9.0V");

  // Case B: Switch is CLOSED with 10Ω load
  sw.properties.isOpen = false;
  const resultClosed = simulateCircuit(components, wires);
  assert.equal(resultClosed.isClosedCircuit, true);
  assert.ok(resultClosed.totalCurrent > 0, "Current flows when switch is closed");

  // Terminal voltage across battery drops due to internal resistance r: V = ℰ - Ir = 9.0 - (0.891 * 2) ≈ 7.22V
  assert.ok(resultClosed.voltmeterReading >= 7.1 && resultClosed.voltmeterReading <= 7.35, `Terminal voltage under load must drop to ~7.22V, got ${resultClosed.voltmeterReading}`);
});

test("RC Transient Experiment - Closed circuit initialization", () => {
  const components: CircuitComponent[] = JSON.parse(JSON.stringify(RC_TRANSIENT_EXPERIMENT.standardComponents));
  const wires = JSON.parse(JSON.stringify(RC_TRANSIENT_EXPERIMENT.initialWires));

  const sw = components.find(c => c.type === 'switch')!;
  sw.properties.isOpen = false;

  const result = simulateCircuit(components, wires);
  assert.equal(result.isClosedCircuit, true);
  assert.ok(result.totalCurrent > 0, "Charging circuit conducts current");
  assert.ok(result.equivalentResistance > 10, "Total resistance includes series limiter and lamp");
});
