import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "ALL"
    
    const skip = (page - 1) * limit
    
    const whereClause: any = {}
    if (search) {
      whereClause.title = { contains: search }
    }
    if (category && category !== "ALL") {
      whereClause.category = category
    }

    const [prompts, total] = await Promise.all([
      db.promptTemplate.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.promptTemplate.count({ where: whereClause })
    ])

    return NextResponse.json({
      prompts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Failed to fetch prompts:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, content, category, model, temperature, maxTokens, status } = body

    if (!title || !content || !category) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const prompt = await db.promptTemplate.create({
      data: {
        title,
        description,
        content,
        category,
        model: model || "gemini-1.5-pro",
        temperature: temperature !== undefined ? parseFloat(temperature) : 0.7,
        maxTokens: maxTokens !== undefined ? parseInt(maxTokens) : 2048,
        status: status || "ACTIVE"
      }
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error("Failed to create prompt:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
