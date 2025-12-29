import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware completely for /admin/login
  if (pathname === "/admin/login") {
    const response = NextResponse.next()
    // Add header to help layout identify the pathname
    response.headers.set("x-pathname", pathname)
    return response
  }

  // Only protect other /admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Add header for authenticated routes
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

