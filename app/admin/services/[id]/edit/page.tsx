"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [serviceId, setServiceId] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    order: 0,
  })

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setServiceId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!serviceId) return

    async function fetchService() {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch service")
        }
        const data = await response.json()
        setFormData({
          title: data.title || "",
          description: data.description || "",
          slug: data.slug || "",
          order: data.order ?? 0,
        })
      } catch (error) {
        setError("Gagal memuat data layanan")
        console.error("Error fetching service:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchService()
  }, [serviceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update service")
      }

      router.push("/admin/services")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Layanan</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Layanan</CardTitle>
          <CardDescription>
            Perbarui informasi layanan
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                Slug harus unik dan digunakan untuk URL.
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
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
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
