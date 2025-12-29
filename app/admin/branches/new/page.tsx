"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { adminFetchJson } from "@/lib/admin-api-client"

export default function NewBranchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    googleMapsLink: "",
    contactNumber: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await adminFetchJson("/api/admin/branches", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      console.log("Branch created successfully:", result)
      router.push("/admin/branches")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating branch:", error)
      const errorMessage = error.message || "Terjadi kesalahan. Silakan coba lagi."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/branches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Cabang</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tambah Cabang</CardTitle>
          <CardDescription>
            Tambahkan cabang baru PEC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Cabang *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Contoh: PEC Pamulang"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                disabled={isLoading}
                rows={3}
                placeholder="Jl. Raya Pamulang No. 123, Tangerang Selatan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsLink">Link Google Maps (Opsional)</Label>
              <Input
                id="googleMapsLink"
                type="url"
                value={formData.googleMapsLink}
                onChange={(e) =>
                  setFormData({ ...formData, googleMapsLink: e.target.value })
                }
                disabled={isLoading}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Nomor Telepon (Opsional)</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                disabled={isLoading}
                placeholder="021-12345678"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Cabang"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/branches")}
                disabled={isLoading}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

