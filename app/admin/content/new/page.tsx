"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { adminFetchJson } from "@/lib/admin-api-client"

export default function NewContentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    type: "text",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await adminFetchJson("/api/admin/content", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      console.log("Content created successfully:", result)
      router.push("/admin/content")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating content:", error)
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
          <Link href="/admin/content">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Konten</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tambah Konten</CardTitle>
          <CardDescription>
            Tambahkan konten baru untuk website
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
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Contoh: hero_title, about_vision"
                pattern="[a-z0-9_]+"
                title="Key harus lowercase, hanya huruf, angka, dan underscore"
              />
              <p className="text-sm text-gray-500">
                Key harus unik dan menggunakan format lowercase dengan underscore (contoh: hero_title, about_vision)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe Konten *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe konten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Isi Konten *</Label>
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                required
                disabled={isLoading}
                rows={8}
                placeholder="Masukkan isi konten..."
              />
              <p className="text-sm text-gray-500">
                Untuk konten yang panjang (seperti misi dengan beberapa poin), gunakan format baris baru (Enter) untuk setiap poin.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Konten"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/content")}
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

