import { NextRequest, NextResponse } from 'next/server';
import { EXPERIMENT_CATALOG } from '@/lib/experiments/registry';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface MatchResponse {
  matched: boolean;
  experiment?: {
    id: string;
    title: string;
    subject: string;
    description: string;
    url: string;
  };
  explanation: string;
  confidence: number;
}

const apiKey = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required.' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. Keyword heuristics first for deterministic reliability
    // Matches Ohm's Law
    if (
      cleanQuery.includes('voltage') ||
      cleanQuery.includes('current') ||
      cleanQuery.includes('resistance') ||
      cleanQuery.includes('ohm') ||
      cleanQuery.includes('circuit') ||
      cleanQuery.includes('v = ir') ||
      cleanQuery.includes('electricity') ||
      cleanQuery.includes('bulb') ||
      cleanQuery.includes('resistor')
    ) {
      const exp = EXPERIMENT_CATALOG.find(e => e.id === 'ohms-law')!;
      return NextResponse.json({
        matched: true,
        experiment: {
          id: exp.id,
          title: exp.title,
          subject: exp.subject,
          description: exp.description,
          url: `/labs/${exp.id}`
        },
        explanation: `Matched "${query}" directly to ${exp.title}. You will investigate how voltage and resistance govern electric current.`,
        confidence: 0.98
      } satisfies MatchResponse);
    }

    // Matches Pendulum
    if (
      cleanQuery.includes('pendulum') ||
      cleanQuery.includes('gravity') ||
      cleanQuery.includes('harmonic') ||
      cleanQuery.includes('oscillation') ||
      cleanQuery.includes('period')
    ) {
      const exp = EXPERIMENT_CATALOG.find(e => e.id === 'simple-pendulum')!;
      return NextResponse.json({
        matched: true,
        experiment: {
          id: exp.id,
          title: exp.title,
          subject: exp.subject,
          description: exp.description,
          url: `/labs/${exp.id}`
        },
        explanation: `Matched "${query}" to the ${exp.title}. You will explore periodic motion and gravitational acceleration.`,
        confidence: 0.95
      } satisfies MatchResponse);
    }

    // Matches Titration
    if (
      cleanQuery.includes('titrat') ||
      cleanQuery.includes('acid') ||
      cleanQuery.includes('base') ||
      cleanQuery.includes('ph') ||
      cleanQuery.includes('neutralization')
    ) {
      const exp = EXPERIMENT_CATALOG.find(e => e.id === 'acid-base-titration')!;
      return NextResponse.json({
        matched: true,
        experiment: {
          id: exp.id,
          title: exp.title,
          subject: exp.subject,
          description: exp.description,
          url: `/labs/${exp.id}`
        },
        explanation: `Matched "${query}" to ${exp.title}. You will perform acid-base neutralization.`,
        confidence: 0.95
      } satisfies MatchResponse);
    }

    // Matches Microscope
    if (
      cleanQuery.includes('microscope') ||
      cleanQuery.includes('cell') ||
      cleanQuery.includes('biology') ||
      cleanQuery.includes('onion') ||
      cleanQuery.includes('slide')
    ) {
      const exp = EXPERIMENT_CATALOG.find(e => e.id === 'compound-microscope')!;
      return NextResponse.json({
        matched: true,
        experiment: {
          id: exp.id,
          title: exp.title,
          subject: exp.subject,
          description: exp.description,
          url: `/labs/${exp.id}`
        },
        explanation: `Matched "${query}" to ${exp.title}. You will observe cellular structures under magnification.`,
        confidence: 0.95
      } satisfies MatchResponse);
    }

    // 2. If Gemini API is available, ask Gemini to semantically match to one of our catalog experiments
    if (apiKey && apiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are the MageLabs Experiment Matcher.
A student asked: "${query}".

Here is our exact catalog of available laboratories:
${EXPERIMENT_CATALOG.map(e => `- ID: "${e.id}", Title: "${e.title}", Subject: "${e.subject}", Description: "${e.description}"`).join('\n')}

Rule: NEVER invent an experiment not in the list.
If the student's request matches one of these experiments, respond in valid JSON with:
{ "matched": true, "experimentId": "<one of the exact IDs from the list>", "reason": "<concise explanation>" }

If the student's request is for something completely different (e.g. quantum entanglement, chemical synthesis of aspirin, rocket propulsion), respond in valid JSON with:
{ "matched": false, "reason": "This specific experiment is not currently available in MageLabs." }
`;

        const aiRes = await model.generateContent(prompt);
        const jsonMatch = aiRes.response.text().match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.matched && parsed.experimentId) {
            const exp = EXPERIMENT_CATALOG.find(e => e.id === parsed.experimentId);
            if (exp) {
              return NextResponse.json({
                matched: true,
                experiment: {
                  id: exp.id,
                  title: exp.title,
                  subject: exp.subject,
                  description: exp.description,
                  url: `/labs/${exp.id}`
                },
                explanation: parsed.reason || `Matched to ${exp.title}.`,
                confidence: 0.90
              } satisfies MatchResponse);
            }
          }
        }
      } catch (aiErr) {
        console.warn('Gemini experiment matching fallback to not found:', aiErr);
      }
    }

    // 3. Transparent Honest Fallback: Not Available
    return NextResponse.json({
      matched: false,
      explanation: `We could not find an active laboratory matching "${query}". MageLabs currently offers verified interactive laboratories in Ohm's Law (Physics), Simple Harmonic Motion, Volumetric Titration, and Compound Microscopy.`,
      confidence: 0.0
    } satisfies MatchResponse);

  } catch (err: any) {
    console.error('Match API error:', err);
    return NextResponse.json(
      { error: 'Internal matcher error.' },
      { status: 500 }
    );
  }
}
