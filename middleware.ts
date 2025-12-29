import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Only handle /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }
  
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
      // Prevent redirect loop by checking if callbackUrl is not login page
      if (callbackUrl && callbackUrl !== "/admin/login" && callbackUrl.startsWith("/admin")) {
        return NextResponse.redirect(new URL(callbackUrl, request.url))
      }
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    // Not logged in, allow access to login page
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    response.headers.set("x-invoke-path", pathname)
    return response
  }

  // Protect other /admin routes - redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Authenticated, allow access with pathname header
  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  response.headers.set("x-invoke-path", pathname)
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}

