import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

const settingsUpdateSchema = z.object({
  theme: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
});

export const GET = withErrorHandler(async () => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await db.settings.findUnique({
    where: { userId: session.sub },
  });

  return NextResponse.json(settings, { status: 200 });
});

export const PATCH = withErrorHandler(async (req: Request) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = settingsUpdateSchema.parse(body);

  const updatedSettings = await db.settings.update({
    where: { userId: session.sub },
    data,
  });

  return NextResponse.json(updatedSettings, { status: 200 });
});
