import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
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

