import { NextRequest, NextResponse } from 'next/server';
import { askGeminiLabAssistant } from '@/lib/ai/gemini';
import { AdvisorRequest } from '@/lib/ai/local-advisor';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AdvisorRequest;

    if (!body || !body.question) {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

    const advice = await askGeminiLabAssistant(body);
    return NextResponse.json(advice);
  } catch (err: any) {
    console.error('AI assistant route error:', err);
    return NextResponse.json(
      {
        error: 'Failed to generate guidance.',
        details: err?.message || 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
