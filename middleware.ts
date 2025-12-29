import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check token for all admin routes
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // Handle /admin/login - redirect to /admin if already authenticated
  if (pathname === "/admin/login") {
    if (token) {
      // User is already logged in, redirect to admin dashboard
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin"
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    // Not logged in, allow access to login page with pathname header
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  // Protect other /admin routes - redirect to login if not authenticated
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Authenticated, allow access with pathname header
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

