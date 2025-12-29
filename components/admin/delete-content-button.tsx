"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { adminFetch } from "@/lib/admin-api-client"

interface DeleteContentButtonProps {
  contentId: string
}

export default function DeleteContentButton({ contentId }: DeleteContentButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus konten ini?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await adminFetch(`/api/admin/content/${contentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Force hard refresh to ensure data is updated
        window.location.reload()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Gagal menghapus konten" }))
        alert(errorData.error || "Gagal menghapus konten")
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

