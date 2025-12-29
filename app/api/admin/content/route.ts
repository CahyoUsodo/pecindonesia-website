import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("GET /api/admin/content - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const contents = await prisma.content.findMany({
      orderBy: { key: "asc" },
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("POST /api/admin/content - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, value, type } = body

    if (!key || !value || !type) {
      return NextResponse.json({ error: "Missing required fields: key, value, and type" }, { status: 400 })
    }

    // Check if key already exists
    const existingContent = await prisma.content.findUnique({
      where: { key },
    })

    if (existingContent) {
      return NextResponse.json({ error: "Content with this key already exists" }, { status: 400 })
    }

    const newContent = await prisma.content.create({
      data: {
        key,
        value,
        type,
      },
    })

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}

