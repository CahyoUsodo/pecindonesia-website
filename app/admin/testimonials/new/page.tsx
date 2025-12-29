"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { adminFetchJson, adminFetch } from "@/lib/admin-api-client"

export default function NewTestimonialPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    studentName: "",
    role: "",
    reviewText: "",
    rating: "5",
    photoUrl: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal mengupload gambar")
      }

      const data = await response.json()
      setFormData({ ...formData, photoUrl: data.url })
    } catch (error: any) {
      setError(error.message || "Gagal mengupload gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await adminFetchJson("/api/admin/testimonials", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      console.log("Testimonial created successfully:", result)
      router.push("/admin/testimonials")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating testimonial:", error)
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
          <Link href="/admin/testimonials">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Testimoni</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tambah Testimoni</CardTitle>
          <CardDescription>
            Tambahkan testimoni baru dari siswa
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
              <Label htmlFor="studentName">Nama Siswa *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role/Kelas *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Contoh: Siswa SMA Kelas 12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewText">Ulasan *</Label>
              <Textarea
                id="reviewText"
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData({ ...formData, reviewText: e.target.value })
                }
                required
                disabled={isLoading}
                rows={5}
                placeholder="Tuliskan ulasan dari siswa..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Foto Siswa (Opsional)</Label>
              
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isLoading || isUploading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Mengupload..." : "Upload Foto"}
                  </Label>
                </div>
                
                {formData.photoUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, photoUrl: "" })}
                    disabled={isLoading || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Preview Image */}
              {formData.photoUrl && (
                <div className="mt-4 relative w-32 h-32 border rounded-md overflow-hidden bg-gray-100">
                  {formData.photoUrl.startsWith('http') ? (
                    <Image
                      src={formData.photoUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        // Fallback jika gambar tidak bisa dimuat
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      URL tidak valid
                    </div>
                  )}
                </div>
              )}

              {/* Manual URL Input */}
              <div className="mt-4">
                <Label htmlFor="photoUrl" className="text-sm text-gray-600">
                  Atau masukkan URL foto secara manual:
                </Label>
                <Input
                  id="photoUrl"
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, photoUrl: e.target.value })
                  }
                  disabled={isLoading || isUploading}
                  placeholder="https://example.com/photo.jpg"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Testimoni"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/testimonials")}
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

