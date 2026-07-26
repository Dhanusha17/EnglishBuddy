import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const data = await req.json();
    const test = await db.test.update({
      where: { id: params.id },
      data: {
        title: data.title,
        status: data.status,
      },
    });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await db.test.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 });
  }
}
