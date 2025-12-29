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

export default function NewServicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    order: 0,
  })

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await adminFetchJson("/api/admin/services", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      router.push("/admin/services")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Layanan</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tambah Layanan</CardTitle>
          <CardDescription>
            Tambahkan layanan baru untuk website
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
              <Label htmlFor="title">Judul Layanan *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                disabled={isLoading}
                placeholder="Contoh: English Course"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="english-course"
                pattern="[a-z0-9-]+"
                title="Slug harus lowercase, hanya huruf, angka, dan dash"
              />
              <p className="text-sm text-gray-500">
                Slug akan otomatis dibuat dari judul. Slug harus unik dan digunakan untuk URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                disabled={isLoading}
                rows={6}
                placeholder="Tuliskan deskripsi layanan..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Urutan *</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                required
                disabled={isLoading}
                placeholder="0"
              />
              <p className="text-sm text-gray-500">
                Urutan menentukan posisi layanan di halaman. Angka lebih kecil akan muncul lebih dulu.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Layanan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/services")}
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
