import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTitrationEquilibrium,
  calculateUnknownMolarity,
} from "../../lib/chemistry/engine";

test("Titration Simulator - Initial acidic state (0 mL NaOH)", () => {
  const result = calculateTitrationEquilibrium(0.0, 25.0, 0.100, 0.100, true);

  // pH of 0.100 M HCl = -log10(0.100) = 1.00
  assert.equal(result.pH, 1.00, "Initial pH of 0.100M HCl must be 1.00");
  assert.equal(result.isEndpoint, false, "Initial state cannot be at endpoint");
  assert.equal(result.isOverTitrated, false);
  assert.equal(result.color, "#f8fafc", "Acidic solution with phenolphthalein must be colorless/clear");
});

test("Titration Simulator - Half-equivalence point (12.5 mL NaOH)", () => {
  const result = calculateTitrationEquilibrium(12.5, 25.0, 0.100, 0.100, true);

  // Moles acid remaining = 0.0025 - 0.00125 = 0.00125 mol
  // Total volume = 37.5 mL = 0.0375 L
  // [H+] = 0.00125 / 0.0375 = 0.0333 M -> pH ≈ 1.48
  assert.ok(result.pH >= 1.45 && result.pH <= 1.50, `Expected pH ~1.48, got ${result.pH}`);
  assert.equal(result.isEndpoint, false);
  assert.equal(result.color, "#f8fafc");
});

test("Titration Simulator - Exact stoichiometric equivalence point (25.0 mL NaOH)", () => {
  const result = calculateTitrationEquilibrium(25.0, 25.0, 0.100, 0.100, true);

  // In strong acid-strong base titration at 25°C, equivalence pH is 7.00
  assert.equal(result.pH, 7.00, "Equivalence pH for strong acid + strong base must be 7.00");
  assert.equal(result.isOverTitrated, false);
});

test("Titration Simulator - Phenolphthalein endpoint detection (25.06 mL NaOH)", () => {
  // Just past 25.00 mL, pH enters the phenolphthalein transition zone (8.2 - 8.6)
  const result = calculateTitrationEquilibrium(25.06, 25.0, 0.100, 0.100, true);

  assert.ok(result.pH >= 8.2, `Expected pH >= 8.2, got ${result.pH}`);
  assert.equal(result.isEndpoint, true, "Solution must flag endpoint reached");
  assert.equal(result.color, "#fbcfe8", "Endpoint solution must turn faint baby pink");
});

test("Titration Simulator - Over-titration (30.0 mL NaOH)", () => {
  const result = calculateTitrationEquilibrium(30.0, 25.0, 0.100, 0.100, true);

  assert.ok(result.pH > 11.5, `Over-titrated pH must be strongly basic, got ${result.pH}`);
  assert.equal(result.isOverTitrated, true, "Must flag over-titration");
  assert.equal(result.color, "#db2777", "Over-titrated solution must turn vivid magenta");
});

test("Titration Simulator - Absence of indicator maintains clear solution", () => {
  // If indicator is NOT added, even at pH 12 the solution remains clear
  const result = calculateTitrationEquilibrium(30.0, 25.0, 0.100, 0.100, false);

  assert.ok(result.pH > 11.5);
  assert.equal(result.color, "#f8fafc", "Without indicator, solution must remain clear");
});

test("Titration Stoichiometry - Unknown molarity calculation", () => {
  // 25.0 mL of unknown acid titrated by 25.0 mL of 0.100 M NaOH -> M_acid = 0.100 M
  const m1 = calculateUnknownMolarity(25.0, 25.0, 0.100);
  assert.equal(m1, 0.100, "Expected calculated molarity 0.100 M");

  // 24.2 mL of 0.100 M NaOH titrated 25.0 mL of unknown -> M_acid = (0.1 * 24.2) / 25 = 0.0968 M
  const m2 = calculateUnknownMolarity(24.2, 25.0, 0.100);
  assert.equal(m2, 0.0968, "Expected calculated molarity 0.0968 M");
});
