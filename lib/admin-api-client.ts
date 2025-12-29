"use client"

/**
 * Helper function untuk membuat fetch request dengan password dari localStorage
 * Auto-include header X-Admin-Password
 * Handle 401 error (clear localStorage dan reload)
 */
export async function adminFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  // Get password from localStorage
  if (typeof window === "undefined") {
    throw new Error("adminFetch can only be used in client components")
  }
  
  const password = localStorage.getItem("admin_password")
  if (!password) {
    throw new Error("Password not set. Please enter admin password first.")
  }
  
  // Merge headers
  const headers = new Headers(options.headers)
  headers.set("X-Admin-Password", password)
  
  // Set Content-Type to JSON if body is provided and not FormData
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
  }
  
  // Make request
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  // Handle 401 Unauthorized - clear password and reload
  if (response.status === 401) {
    localStorage.removeItem("admin_password")
    window.location.reload()
    throw new Error("Unauthorized - Password invalid or expired")
  }
  
  return response
}

/**
 * Helper untuk JSON response
 */
export async function adminFetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await adminFetch(url, options)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

