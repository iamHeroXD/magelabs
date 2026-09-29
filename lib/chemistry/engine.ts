export interface EquilibriumState {
  pH: number;
  pOH: number;
  hIonConcentration: number;
  ohIonConcentration: number;
  color: string;
  isEndpoint: boolean;
  isOverTitrated: boolean;
}

/**
 * Calculates strong acid-strong base equilibrium chemistry:
 * HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)
 */
export function calculateTitrationEquilibrium(
  titrantDispensedMl: number,
  analyteVolumeMl: number = 25.0,
  analyteConcentration: number = 0.100,
  titrantConcentration: number = 0.100,
  hasIndicator: boolean = true
): EquilibriumState {
  const vA = analyteVolumeMl / 1000; // L
  const vB = Math.max(0, titrantDispensedMl) / 1000; // L
  const totalVolume = vA + vB; // L

  const molesAcidInitial = analyteConcentration * vA;
  const molesBaseAdded = titrantConcentration * vB;

  let pH = 7.0;
  let pOH = 7.0;
  let hConc = 1e-7;
  let ohConc = 1e-7;

  const equivalenceVolumeMl = (analyteConcentration * analyteVolumeMl) / titrantConcentration;
  const deltaMl = titrantDispensedMl - equivalenceVolumeMl;

  // Very close to stoichiometric equivalence point
  if (Math.abs(deltaMl) < 0.005) {
    pH = 7.0;
    pOH = 7.0;
    hConc = 1e-7;
    ohConc = 1e-7;
  } else if (titrantDispensedMl < equivalenceVolumeMl) {
    // Acid in excess
    const molesAcidRemaining = molesAcidInitial - molesBaseAdded;
    hConc = Math.max(1e-14, molesAcidRemaining / totalVolume);
    pH = Math.max(0.5, Math.min(6.99, -Math.log10(hConc)));
    pOH = 14.0 - pH;
    ohConc = Math.pow(10, -pOH);
  } else {
    // Base in excess: realistic indicator/carbonic buffer inflection
    if (deltaMl <= 0.20) {
      // Inflection zone: smooth sigmoidal transition from 7.00 up through phenolphthalein range (8.2-10.0)
      const normalizedDelta = deltaMl / 0.20;
      pH = 7.00 + 4.2 * normalizedDelta; // At 0.05mL: pH = 8.05; at 0.06mL: pH = 8.26; at 0.10mL: pH = 9.10
    } else {
      const molesBaseExcess = molesBaseAdded - molesAcidInitial;
      ohConc = Math.max(1e-14, molesBaseExcess / totalVolume);
      pOH = Math.max(0.5, Math.min(6.99, -Math.log10(ohConc)));
      pH = Math.max(7.01, Math.min(13.8, 14.0 - pOH));
    }
    pOH = 14.0 - pH;
    hConc = Math.pow(10, -pH);
    ohConc = Math.pow(10, -pOH);
  }

  // Round pH to 2 decimal places (standard research-grade digital pH meter)
  pH = Math.round(pH * 100) / 100;
  pOH = Math.round(pOH * 100) / 100;

  // Indicator color transition (Phenolphthalein: pK_In ≈ 9.3)
  // Colorless below pH 8.2, faint pink at 8.2-8.6, magenta above 9.0
  let color = "#ffffff";
  let isEndpoint = false;
  let isOverTitrated = false;

  if (!hasIndicator) {
    color = "#f8fafc"; // Transparent water-clear
  } else {
    if (pH < 8.2) {
      color = "#f8fafc"; // Clear / Colorless
    } else if (pH >= 8.2 && pH <= 8.6) {
      color = "#fbcfe8"; // Faint pink (ideal stoichiometric endpoint)
      isEndpoint = true;
    } else if (pH > 8.6 && pH <= 9.3) {
      color = "#f472b6"; // Distinct pink
      isEndpoint = true;
    } else {
      color = "#db2777"; // Deep magenta (over-titrated)
      isOverTitrated = true;
    }
  }

  return {
    pH,
    pOH,
    hIonConcentration: hConc,
    ohIonConcentration: ohConc,
    color,
    isEndpoint,
    isOverTitrated,
  };
}

/**
 * Calculates unknown acid molarity from titration endpoint data:
 * M_a = (M_b * V_b) / V_a
 */
export function calculateUnknownMolarity(
  titrantUsedMl: number,
  analyteVolumeMl: number,
  titrantMolarity: number
): number {
  if (analyteVolumeMl <= 0) return 0;
  const molarity = (titrantMolarity * titrantUsedMl) / analyteVolumeMl;
  return Math.round(molarity * 10000) / 10000;
}
