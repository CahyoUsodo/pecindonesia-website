import { NextRequest, NextResponse } from "next/server"
import { requireAdminPassword } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { valid } = requireAdminPassword(request)
  
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [services, testimonials, branches, faqs, content] = await Promise.all([
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.branch.count(),
      prisma.faq.count(),
      prisma.content.count(),
    ])

    return NextResponse.json({
      services,
      testimonials,
      branches,
      faqs,
      content,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

