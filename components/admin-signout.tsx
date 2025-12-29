"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminSignOut() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut size={16} className="mr-2" />
      Keluar
    </Button>
  )
}

