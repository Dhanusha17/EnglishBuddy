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

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.resource.count({ where: whereClause })
    ])

    return NextResponse.json({
      resources,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, category, tags, difficulty, language, fileType, fileUrl, status, visibility } = body

    if (!title || !category || !fileUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const resource = await db.resource.create({
      data: {
        title,
        description,
        category,
        tags,
        difficulty,
        language,
        visibility: visibility || "PUBLIC",
        fileType: fileType || "document",
        fileUrl,
        status: status || "PUBLISHED"
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error("Failed to create resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
