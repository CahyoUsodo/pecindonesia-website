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
    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
    })

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(branch)
  } catch (error) {
    console.error("Error fetching branch:", error)
    return NextResponse.json(
      { error: "Failed to fetch branch" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("PUT /api/admin/branches/[id] - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, address, googleMapsLink, contactNumber } = body

    if (!name || !address) {
      return NextResponse.json(
        { error: "Nama dan alamat wajib diisi" },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.update({
      where: { id: params.id },
      data: {
        name,
        address,
        googleMapsLink: googleMapsLink || null,
        contactNumber: contactNumber || null,
      },
    })

    return NextResponse.json(branch)
  } catch (error) {
    console.error("Error updating branch:", error)
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    )
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
    await prisma.branch.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

