import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, description, content, category, model, temperature, maxTokens, status } = body

    if (!title || !content || !category) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const prompt = await db.promptTemplate.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        model,
        temperature: parseFloat(temperature as string),
        maxTokens: parseInt(maxTokens as string),
        status
      }
    })

    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Failed to update prompt:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.promptTemplate.delete({
      where: { id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete prompt:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
