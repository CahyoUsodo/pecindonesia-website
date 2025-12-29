"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { adminFetch } from "@/lib/admin-api-client"

interface DeleteFaqButtonProps {
  faqId: string
}

export default function DeleteFaqButton({ faqId }: DeleteFaqButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await adminFetch(`/api/admin/faqs/${faqId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Force hard refresh to ensure data is updated
        window.location.reload()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Gagal menghapus FAQ" }))
        alert(errorData.error || "Gagal menghapus FAQ")
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isLoading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

