"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"

export default function LoginWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session) {
      const callbackUrl = searchParams.get("callbackUrl") || "/admin"
      // Use window.location for full page reload to ensure middleware redirect works
      window.location.href = callbackUrl
    }
  }, [status, session, searchParams])

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // If authenticated, don't render login form (will redirect)
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    )
  }

  // Not authenticated, show login form
  return <>{children}</>
}

