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
 */
export function getAdminPasswordFromRequest(request: NextRequest): string | null {
  return request.headers.get("X-Admin-Password")
}

/**
 * Middleware helper untuk memverifikasi password dari request
 * Return true jika password valid, false jika tidak
 */
export function requireAdminPassword(request: NextRequest): { valid: boolean; password: string | null } {
  const password = getAdminPasswordFromRequest(request)
  
  if (!password) {
    return { valid: false, password: null }
  }
  
  const isValid = verifyAdminPassword(password)
  return { valid: isValid, password }
}

