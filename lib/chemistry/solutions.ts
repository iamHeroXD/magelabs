export interface ChemicalSolution {
  id: string;
  name: string;
  formula: string;
  concentrationM: number;
  pH: number;
  color: string;
  density: number; // g/mL
  description: string;
}

export const REAGENT_CATALOG: Record<string, ChemicalSolution> = {
  hcl: {
    id: "hcl",
    name: "Hydrochloric Acid",
    formula: "HCl",
    concentrationM: 0.100,
    pH: 1.00,
    color: "#f8fafc", // Clear
    density: 1.005,
    description: "Strong monoprotic mineral acid.",
  },
  naoh: {
    id: "naoh",
    name: "Sodium Hydroxide",
    formula: "NaOH",
    concentrationM: 0.100,
    pH: 13.00,
    color: "#f8fafc", // Clear
    density: 1.01,
    description: "Strong caustic alkali base used as volumetric titrant.",
  },
  cuso4: {
    id: "cuso4",
    name: "Copper(II) Sulfate",
    formula: "CuSO4",
    concentrationM: 0.250,
    pH: 4.20,
    color: "#0284c7", // Vivid azure blue
    density: 1.035,
    description: "Hydrated transition metal salt producing an intense sapphire-blue solution.",
  },
  water: {
    id: "water",
    name: "Deionized Water",
    formula: "H2O",
    concentrationM: 55.5,
    pH: 7.00,
    color: "#f8fafc",
    density: 1.000,
    description: "Type 1 analytical grade deionized water.",
  },
  universal: {
    id: "universal",
    name: "Universal Indicator",
    formula: "Mixed Indicator",
    concentrationM: 0.01,
    pH: 7.00,
    color: "#16a34a", // Green at neutral
    density: 0.98,
    description: "Full-range pH indicator: Red (pH 1-3), Yellow (4-6), Green (7), Blue (8-10), Purple (11-14).",
  },
  phenolphthalein: {
    id: "phenolphthalein",
    name: "Phenolphthalein Indicator",
    formula: "C20H14O4",
    concentrationM: 0.01,
    pH: 7.00,
    color: "#fbcfe8",
    density: 0.95,
    description: "Acid-base indicator with sharp transition at pH 8.2-10.0.",
  },
};

/**
 * Computes mixed fluid properties when pouring Solution A into Solution B
 */
export function mixSolutions(
  source: { volumeMl: number; solutionId: string; indicator?: string },
  target: { volumeMl: number; solutionId: string; indicator?: string }
): {
  volumeMl: number;
  solutionId: string;
  pH: number;
  color: string;
  indicator?: string;
} {
  const totalVolume = source.volumeMl + target.volumeMl;
  if (totalVolume <= 0) {
    return { volumeMl: 0, solutionId: target.solutionId, pH: 7.0, color: "#f8fafc" };
  }

  const sReagent = REAGENT_CATALOG[source.solutionId] || REAGENT_CATALOG.water;
  const tReagent = REAGENT_CATALOG[target.solutionId] || REAGENT_CATALOG.water;
  const indicator = target.indicator || source.indicator;

  // Compute moles of H+ and OH-
  const molesHSource = Math.pow(10, -sReagent.pH) * (source.volumeMl / 1000);
  const molesHTarget = Math.pow(10, -tReagent.pH) * (target.volumeMl / 1000);
  const totalH = molesHSource + molesHTarget;
  const concH = totalH / (totalVolume / 1000);

  let newPh = -Math.log10(Math.max(1e-14, concH));
  newPh = Math.round(Math.max(0.5, Math.min(13.8, newPh)) * 100) / 100;

  // Determine resulting color
  let newColor = "#f8fafc";

  // Copper sulfate dominates if present
  if (source.solutionId === "cuso4" || target.solutionId === "cuso4") {
    newColor = "#0284c7"; // Intense azure
  } else if (indicator === "universal") {
    // Universal indicator color scale
    if (newPh <= 3.0) newColor = "#ef4444"; // Vivid red
    else if (newPh <= 6.0) newColor = "#f59e0b"; // Orange/yellow
    else if (newPh <= 7.5) newColor = "#22c55e"; // Neutral green
    else if (newPh <= 10.0) newColor = "#0284c7"; // Cyan/blue
    else newColor = "#7c3aed"; // Violet/purple
  } else if (indicator === "phenolphthalein") {
    if (newPh < 8.2) newColor = "#f8fafc";
    else if (newPh <= 8.6) newColor = "#fbcfe8"; // Faint baby pink
    else if (newPh <= 9.3) newColor = "#f472b6"; // Pink
    else newColor = "#db2777"; // Deep magenta
  }

  const resultingSolutionId =
    source.solutionId === "cuso4" || target.solutionId === "cuso4"
      ? "cuso4"
      : newPh < 6
      ? "hcl"
      : newPh > 8
      ? "naoh"
      : "water";

  return {
    volumeMl: Math.round(totalVolume * 10) / 10,
    solutionId: resultingSolutionId,
    pH: newPh,
    color: newColor,
    indicator,
  };
}
