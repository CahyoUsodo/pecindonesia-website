import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields: email, password, and role" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "ADMIN",
      },
    })

    // Don't return password
    const { password: _, ...adminWithoutPassword } = newAdmin

    return NextResponse.json(adminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}

