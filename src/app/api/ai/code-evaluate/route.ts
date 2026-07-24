import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL } from "@/lib/gemini";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { problemId, code, language } = await req.json();

  if (!problemId || !code || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const problem = await db.codingProblem.findUnique({ where: { id: problemId } });
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

  const prompt = `
You are an expert technical interviewer and sandboxed code execution simulator.
Evaluate the following \${language} code submission against the problem description and test cases.

Problem: \${problem.title}
Description: \${problem.description}
Expected Test Cases: \${problem.testCases}

User Code (\${language}):
\`\`\`\${language}
\${code}
\`\`\`

Evaluate if the code is correct, optimal, and handles all edge cases.
Your response MUST be valid JSON matching the following schema EXACTLY, without any markdown formatting like \`\`\`json.
{
  "status": "<ACCEPTED or WRONG_ANSWER or ERROR>",
  "executionTimeMs": <estimated ms integer>,
  "feedback": "<string describing what was wrong or confirming it's correct>",
  "optimizations": ["tip1", "tip2"]
}
  `;

  const startTime = Date.now();
  const result = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  const aiExecutionTime = Date.now() - startTime;

  const responseText = result.text || "";
  
  let parsedFeedback;
  try {
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    parsedFeedback = JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI response parse error:", error);
    return NextResponse.json({ error: "Failed to process AI evaluation" }, { status: 500 });
  }

  const submission = await db.codingSubmission.create({
    data: {
      userId: session.sub,
      problemId: problem.id,
      code: code,
      language: language,
      status: parsedFeedback.status || "ERROR",
      executionTime: parsedFeedback.executionTimeMs || aiExecutionTime, // simulated time
    }
  });

  return NextResponse.json({ evaluation: parsedFeedback, submission });
});
