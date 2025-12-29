import type { NextRequest } from "next/server"

/**
 * Verifikasi password admin dengan password dari environment variable
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables")
    return false
  }
  return password === adminPassword
}

/**
 * Extract password dari request header
 * Mencoba beberapa variasi nama header untuk kompatibilitas
 */
export function getAdminPasswordFromRequest(request: NextRequest): string | null {
  // Try different header name variations (case-insensitive)
  const password = 
    request.headers.get("X-Admin-Password") ||
    request.headers.get("x-admin-password") ||
    request.headers.get("X-ADMIN-PASSWORD")
  
  return password
}

/**
 * Middleware helper untuk memverifikasi password dari request
 * Return true jika password valid, false jika tidak
 */
export function requireAdminPassword(request: NextRequest): { valid: boolean; password: string | null } {
  const password = getAdminPasswordFromRequest(request)
  
  if (!password) {
    // Log untuk debugging di production
    if (process.env.NODE_ENV === "production") {
      console.error("Admin password not found in request headers")
      console.error("Available headers:", Array.from(request.headers.keys()))
    }
    return { valid: false, password: null }
  }
  
  const isValid = verifyAdminPassword(password)
  
  // Log untuk debugging di production
  if (process.env.NODE_ENV === "production" && !isValid) {
    console.error("Admin password verification failed")
    console.error("ADMIN_PASSWORD is set:", !!process.env.ADMIN_PASSWORD)
  }
  
  return { valid: isValid, password }
}

