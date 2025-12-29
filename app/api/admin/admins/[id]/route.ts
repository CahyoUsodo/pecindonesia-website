import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json(admin)
  } catch (error) {
    console.error("Error fetching admin:", error)
    return NextResponse.json({ error: "Failed to fetch admin" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !role) {
      return NextResponse.json({ error: "Missing required fields: email and role" }, { status: 400 })
    }

    // Check if email already exists for another admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin && existingAdmin.id !== params.id) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 400 })
    }

    const updateData: any = {
      email,
      role,
    }

    // Only update password if provided
    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 })
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
    await prisma.admin.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 })
  }
}

