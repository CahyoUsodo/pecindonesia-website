import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 })
  }

  try {
    // Get first admin as default (since no session-based user)
    const admin = await prisma.admin.findFirst({
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(admin)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Gagal memuat profil" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, currentPassword, newPassword, adminId } = body

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 })
    }

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID wajib diisi" }, { status: 400 })
    }

    // Get current admin
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 })
    }

    // Check if email already exists for another admin
    if (email !== admin.email) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      })

      if (existingAdmin) {
        return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
      }
    }

    const updateData: any = {
      email,
    }

    // If trying to change password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Password saat ini wajib diisi untuk mengubah password" }, { status: 400 })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password saat ini tidak benar" }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 })
  }
}

