import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

const profileUpdateSchema = z.object({
  bio: z.string().optional(),
  englishLevel: z.string().optional(),
  learningGoal: z.string().optional(),
});

export const GET = withErrorHandler(async () => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findUnique({
    where: { userId: session.sub },
  });

  return NextResponse.json(profile, { status: 200 });
});

export const PATCH = withErrorHandler(async (req: Request) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = profileUpdateSchema.parse(body);

  const updatedProfile = await db.profile.update({
    where: { userId: session.sub },
    data,
  });

  return NextResponse.json(updatedProfile, { status: 200 });
});
