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
    const faq = await prisma.faq.findUnique({
      where: { id: params.id },
    })

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 })
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
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing required fields: question and answer" }, { status: 400 })
    }

    const updatedFaq = await prisma.faq.update({
      where: { id: params.id },
      data: {
        question,
        answer,
      },
    })

    return NextResponse.json(updatedFaq)
  } catch (error) {
    console.error("Error updating FAQ:", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
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
    await prisma.faq.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

