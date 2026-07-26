import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "interview") {
    const qs = await db.interviewQuestion.findMany({ take: 20 });
    return NextResponse.json(qs.map((q: any) => ({
      question: q.question,
      explanation: q.type + " - " + q.difficulty,
      sampleAnswer: "Practice answering this with the STAR method.",
      tips: ["Be concise", "Provide examples"],
      mistakes: ["Being vague"],
      completed: false
    })));
  }

  if (type === "gd") {
    const topics = await db.gDTopic.findMany({ take: 20 });
    return NextResponse.json(topics.map((t: any) => ({
      topic: t.title,
      category: t.category,
      difficulty: "Medium",
      pointsFor: ["Supports innovation"],
      pointsAgainst: ["Requires adaptation"]
    })));
  }

  if (type === "company") {
    const companies = await db.company.findMany({ take: 20 });
    return NextResponse.json(companies.map((c: any) => ({
      id: c.id,
      name: c.name,
      industry: c.industry || "Tech",
      hiringStages: 4,
      difficulty: "Medium"
    })));
  }

  if (type === "email") {
    const templates = await db.emailTemplate.findMany({ take: 10 });
    return NextResponse.json(templates.map((t: any) => ({
      title: t.title,
      subject: t.subject || "Template",
      body: t.body || "Email body...",
      type: "Professional"
    })));
  }

  return NextResponse.json([]);
});
