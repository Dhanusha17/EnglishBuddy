import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let prefs = await db.notificationPreference.findUnique({ where: { userId: session.sub } });
  if (!prefs) {
    prefs = await db.notificationPreference.create({ data: { userId: session.sub } });
  }

  return NextResponse.json(prefs);
});

export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { emailNotifications, inAppNotifications, dailyReminders, weeklyReports, marketingEmails } = body;

  const prefs = await db.notificationPreference.upsert({
    where: { userId: session.sub },
    update: {
      emailNotifications: emailNotifications ?? undefined,
      inAppNotifications: inAppNotifications ?? undefined,
      dailyReminders: dailyReminders ?? undefined,
      weeklyReports: weeklyReports ?? undefined,
      marketingEmails: marketingEmails ?? undefined
    },
    create: {
      userId: session.sub,
      emailNotifications: emailNotifications ?? true,
      inAppNotifications: inAppNotifications ?? true,
      dailyReminders: dailyReminders ?? false,
      weeklyReports: weeklyReports ?? true,
      marketingEmails: marketingEmails ?? false
    }
  });

  return NextResponse.json({ data: prefs, message: "Preferences updated successfully." });
});
