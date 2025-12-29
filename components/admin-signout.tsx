"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function AdminSignOut() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = () => {
    setIsLoading(true)
    // Clear password from localStorage
    localStorage.removeItem("admin_password")
    // Reload page to show password form
    window.location.reload()
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

