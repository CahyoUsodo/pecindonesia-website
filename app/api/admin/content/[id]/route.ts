import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("PUT /api/admin/content/[id] - Unauthorized", {
      hasPassword: !!password,
      headers: Array.from(request.headers.entries()).filter(([key]) => 
        key.toLowerCase().includes("admin") || key.toLowerCase().includes("password")
      ),
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, value, type } = body

    if (!key || !value || !type) {
      return NextResponse.json({ error: "Missing required fields: key, value, and type" }, { status: 400 })
    }

    // Check if key already exists for another content
    const existingContent = await prisma.content.findUnique({
      where: { key },
    })

    if (existingContent && existingContent.id !== params.id) {
      return NextResponse.json({ error: "Content with this key already exists" }, { status: 400 })
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        key,
        value,
        type,
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error: any) {
    console.error("Error updating content:", error)
    return NextResponse.json({ 
      error: "Failed to update content",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.content.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

