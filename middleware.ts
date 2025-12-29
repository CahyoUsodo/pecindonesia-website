import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Only handle /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }
  
  // Allow all /admin routes to be accessed directly
  // Password protection is handled at API route level
  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  response.headers.set("x-invoke-path", pathname)
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}

