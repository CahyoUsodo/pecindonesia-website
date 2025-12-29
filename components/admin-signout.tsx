"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function AdminSignOut() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // Sign out and wait for it to complete
      await signOut({ 
        redirect: false,
        callbackUrl: "/admin/login" 
      })
      
      // Use window.location for full page reload to ensure session is cleared
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Error signing out:", error)
      // Fallback: redirect anyway
      window.location.href = "/admin/login"
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      <LogOut size={16} className="mr-2" />
      {isLoading ? "Keluar..." : "Keluar"}
    </Button>
  )
}

