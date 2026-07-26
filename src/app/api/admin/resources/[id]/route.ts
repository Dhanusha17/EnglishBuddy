import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, description, category, tags, difficulty, language, fileType, fileUrl, status, visibility } = body

    if (!title || !category) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const resource = await db.resource.update({
      where: { id },
      data: {
        title,
        description,
        category,
        tags,
        difficulty,
        language,
        visibility,
        fileType,
        fileUrl,
        status
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Failed to update resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.resource.delete({
      where: { id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
