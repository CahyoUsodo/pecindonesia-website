import { NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password || typeof password !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 })
    }
    
    const isValid = verifyAdminPassword(password)
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}

