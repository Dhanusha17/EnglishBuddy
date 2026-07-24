import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { ai } from '@/lib/ai/AIService';
import { PromptBuilder } from '@/lib/ai/PromptBuilder';
import { GDCoachResponse } from '@/lib/ai/ResponseFormatter';
import { z } from 'zod';

const schema = z.object({
  topic: z.string().min(1),
  statement: z.string().min(1).max(3000),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { topic, statement } = schema.parse(body);

  const prompt = PromptBuilder.buildGDCoachEvaluationPrompt(topic, statement);

  const response = await ai.generateStructuredResponse<GDCoachResponse>(
    prompt,
    undefined,
    { temperature: 0.5 }
  );

  return NextResponse.json({ data: response }, { status: 200 });
});