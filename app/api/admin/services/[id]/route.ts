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
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("PUT /api/admin/services/[id] - Unauthorized", {
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

    // Check if slug already exists for another service
    const existingService = await prisma.service.findUnique({
      where: { slug },
    })

    if (existingService && existingService.id !== params.id) {
      return NextResponse.json({ error: "Service with this slug already exists" }, { status: 400 })
    }

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        title,
        description,
        slug,
        order: order ?? 0,
      },
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
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
    await prisma.service.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

