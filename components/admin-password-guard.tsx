"use client"

import { useEffect, useState } from "react"
import AdminPasswordForm from "./admin-password-form"

export default function AdminPasswordGuard({ children }: { children: React.ReactNode }) {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if password exists in localStorage
    const password = localStorage.getItem("admin_password")
    setHasPassword(!!password)
  }, [])

  // Show loading state while checking
  if (hasPassword === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Show password form if no password
  if (!hasPassword) {
    return <AdminPasswordForm />
  }

  // Show children if password exists
  return <>{children}</>
}

