import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // In a real app, this would get the logged-in admin's ID
    const adminUser = await db.user.findFirst(); 
    if (!adminUser) return NextResponse.json({ error: "No admin found" }, { status: 400 });

    let settings = await db.settings.findUnique({
      where: { userId: adminUser.id }
    });

    if (!settings) {
      settings = await db.settings.create({
        data: { userId: adminUser.id }
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const adminUser = await db.user.findFirst(); 
    if (!adminUser) return NextResponse.json({ error: "No admin found" }, { status: 400 });

    const settings = await db.settings.update({
      where: { userId: adminUser.id },
      data: {
        dailyStudyGoalMins: data.dailyStudyGoalMins,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        theme: data.theme,
        isPublicProfile: data.isPublicProfile,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
