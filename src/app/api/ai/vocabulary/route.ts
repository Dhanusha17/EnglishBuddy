import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { awardXp, updateStreak } from "@/lib/gamification";

const vocabSchema = z.object({
  word: z.string().min(1, "Please provide a word").max(50),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 10, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { word } = vocabSchema.parse(body);

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are an expert English vocabulary builder. Provide detailed information for the word "${word}".
Return pure JSON without markdown blocks.
JSON format:
{
  "meaning": "Clear and concise meaning",
  "synonyms": ["word1", "word2"],
  "antonyms": ["word3", "word4"],
  "example": "A real-world example sentence.",
  "pronunciation": "Phonetic spelling or IPA",
  "difficulty": "Beginner | Intermediate | Advanced"
}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiText = response.text || "{}";
    const result = JSON.parse(aiText);

    // Save vocab progress
    await db.vocabularyProgress.create({
      data: {
        userId: session.sub,
        word: word.toLowerCase(),
        meaning: result.meaning || "",
        synonyms: JSON.stringify(result.synonyms || []),
        antonyms: JSON.stringify(result.antonyms || []),
        example: result.example || "",
        pronunciation: result.pronunciation || "",
        difficulty: result.difficulty || "Intermediate",
      }
    });

    await db.aiUsageAnalytics.create({
      data: { userId: session.sub, module: "VOCABULARY", tokensUsed: 0 }
    });

    await updateStreak(session.sub);
    await awardXp(session.sub, 10, "AI_VOCAB_" + Date.now());

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});