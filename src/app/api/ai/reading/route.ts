import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { ai } from '@/lib/ai/AIService';
import { PromptBuilder } from '@/lib/ai/PromptBuilder';
import { ReadingAnalysisResponse } from '@/lib/ai/ResponseFormatter';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(1).max(8000),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { text } = schema.parse(body);

  const prompt = PromptBuilder.buildReadingAnalysisPrompt(text);

  const response = await ai.generateStructuredResponse<ReadingAnalysisResponse>(
    prompt,
    undefined,
    { temperature: 0.3 }
  );

  return NextResponse.json({ data: response }, { status: 200 });
});