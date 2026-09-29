import { GoogleGenerativeAI } from '@google/generative-ai';
import { AdvisorRequest, AdvisorResponse, generateLocalLabAdvice } from './local-advisor';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function askGeminiLabAssistant(req: AdvisorRequest): Promise<AdvisorResponse> {
  // If no Gemini API key is configured, use the intelligent local physics advisor
  if (!apiKey || apiKey.trim() === '') {
    return generateLocalLabAdvice(req);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast, concise educational assistance
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are the MageLabs Virtual Laboratory AI Assistant for the experiment: "${req.experimentTitle}".
The student is working in a realistic 3D laboratory bench.
Current Experiment State:
- Switch State: ${req.components.find(c => c.type === 'switch')?.properties.isOpen ? 'OPEN (interrupted)' : 'CLOSED (conducting)'}
- Power Supply Voltage: ${req.simulationResult.totalVoltage} V
- Total Equivalent Resistance: ${req.simulationResult.equivalentResistance} Ohms
- Total Loop Current: ${req.simulationResult.totalCurrent} Amperes
- Ammeter Reading: ${req.simulationResult.ammeterReading} A
- Voltmeter Reading: ${req.simulationResult.voltmeterReading} V
- Circuit Continuity: ${req.simulationResult.isClosedCircuit ? 'CLOSED LOOP' : 'OPEN / INCOMPLETE'}
- Short Circuit Status: ${req.simulationResult.isShortCircuit ? 'DANGER SHORT CIRCUIT' : 'Normal'}
- Total Wires on Bench: ${req.wires.length}
- Status Message: ${req.simulationResult.statusMessage}
${req.simulationResult.warnings.length > 0 ? `- Warnings: ${req.simulationResult.warnings.join(', ')}` : ''}

Mode: ${req.mode || 'explain'} (Can be 'hint', 'explain', 'diagnose', or 'deep-dive')
Student Question: "${req.question}"

Instructions:
1. Ground your answer strictly in the current virtual laboratory state above.
2. If mode is 'hint', do NOT give away the complete answer immediately. Give a guiding Socratic clue encouraging the student to observe the apparatus.
3. If mode is 'diagnose', explain what physical reason prevents the circuit from working (e.g. open switch, 0V power supply, or disconnected wire).
4. If mode is 'explain', explain the physics clearly using Ohm's Law (V = IR), potential difference, and charge carriers.
5. If mode is 'deep-dive', provide the mathematical derivation or microscopic physics.
6. Keep formatting clean with GitHub markdown and LaTeX math where suitable. Do NOT hallucinate equipment not present.
7. Return a concise, friendly, encouraging response.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      answer: text,
      mode: req.mode || 'explain',
      stateSummary: `V = ${req.simulationResult.totalVoltage.toFixed(1)}V, I = ${req.simulationResult.totalCurrent.toFixed(3)}A, R = ${req.simulationResult.equivalentResistance.toFixed(1)}Ω`,
      confidence: 0.99
    };
  } catch (error) {
    console.warn("Gemini API call failed or timed out, falling back to local advisor:", error);
    return generateLocalLabAdvice(req);
  }
}
