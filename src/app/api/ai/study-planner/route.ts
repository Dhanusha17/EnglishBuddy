import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { ai } from '@/lib/ai/AIService';
import { PromptBuilder } from '@/lib/ai/PromptBuilder';
import { StudyPlanResponse } from '@/lib/ai/ResponseFormatter';
import { z } from 'zod';

const schema = z.object({
  goal: z.string().min(1),
  timeAvailableHours: z.number().min(1).max(168),
  weakSkills: z.array(z.string()).optional(),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { goal, timeAvailableHours, weakSkills } = schema.parse(body);

  const prompt = PromptBuilder.buildStudyPlanPrompt(goal, timeAvailableHours, weakSkills);

  const response = await ai.generateStructuredResponse<StudyPlanResponse>(
    prompt,
    undefined,
    { temperature: 0.5 }
  );

  return NextResponse.json({ data: response }, { status: 200 });
});