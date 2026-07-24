import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL } from "@/lib/gemini";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resumeId, resumeData } = await req.json();

  if (!resumeId || !resumeData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `
You are an expert HR Technical Recruiter and ATS (Applicant Tracking System) software simulator.
Please evaluate the following resume data provided in JSON format.

Resume JSON:
\${JSON.stringify(resumeData)}

Please provide a detailed review of this resume. Your response MUST be valid JSON matching the following schema EXACTLY, without any markdown formatting like \`\`\`json.
{
  "score": <number 0-100>,
  "atsCompatibility": "<string describing how ATS friendly it is>",
  "grammar": "<string evaluating grammar and tone>",
  "missingKeywords": ["keyword1", "keyword2"],
  "formattingTips": ["tip1", "tip2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"]
}
  `;

  const result = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  const responseText = result.text || "";
  
  // Parse JSON response (handle potential markdown blocks)
  let parsedFeedback;
  try {
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    parsedFeedback = JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI response parse error:", error);
    return NextResponse.json({ error: "Failed to process AI response" }, { status: 500 });
  }

  const review = await db.resumeReview.create({
    data: {
      resumeId: resumeId,
      score: parsedFeedback.score || 0,
      feedback: JSON.stringify(parsedFeedback),
    }
  });

  return NextResponse.json({ review: parsedFeedback, dbRecord: review });
});
