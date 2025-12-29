import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("GET /api/admin/faqs - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { valid, password } = requireAdminPassword(request)
  
  if (!valid) {
    console.error("POST /api/admin/faqs - Unauthorized", {
      hasPassword: !!password,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing required fields: question and answer" }, { status: 400 })
    }

    const newFaq = await prisma.faq.create({
      data: {
        question,
        answer,
      },
    })

    return NextResponse.json(newFaq, { status: 201 })
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}

