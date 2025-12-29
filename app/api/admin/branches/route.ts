import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("GET /api/admin/branches - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(branches)
  } catch (error) {
    console.error("Error fetching branches:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("POST /api/admin/branches - Unauthorized", {
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

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        googleMapsLink: googleMapsLink || null,
        contactNumber: contactNumber || null,
      },
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error) {
    console.error("Error creating branch:", error)
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    )
  }
}

