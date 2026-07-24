import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { ai } from '@/lib/ai/AIService';
import { PromptBuilder } from '@/lib/ai/PromptBuilder';
import { SpeakingAnalysisResponse } from '@/lib/ai/ResponseFormatter';
import { z } from 'zod';

const schema = z.object({
  transcript: z.string().min(1).max(5000),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { transcript } = schema.parse(body);

  const prompt = PromptBuilder.buildSpeakingAnalysisPrompt(transcript);

  const response = await ai.generateStructuredResponse<SpeakingAnalysisResponse>(
    prompt,
    undefined,
    { temperature: 0.3 }
  );

  return NextResponse.json({ data: response }, { status: 200 });
});