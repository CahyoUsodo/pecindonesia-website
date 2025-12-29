import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("POST /api/admin/services - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, slug, order } = body

    if (!title || !description || !slug) {
      return NextResponse.json({ error: "Missing required fields: title, description, and slug" }, { status: 400 })
    }

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug },
    })

    if (existingService) {
      return NextResponse.json({ error: "Service with this slug already exists" }, { status: 400 })
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        slug,
        order: order ?? 0,
      },
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

