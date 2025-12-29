"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"
import { adminFetchJson } from "@/lib/admin-api-client"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await adminFetchJson("/api/admin/profile")
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
        }))
      } catch (error) {
        setError("Gagal memuat data profil")
        console.error("Error fetching profile:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate password if trying to change
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError("Password baru minimal 6 karakter")
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Password baru dan konfirmasi password tidak cocok")
        return
      }
      if (!formData.currentPassword) {
        setError("Masukkan password saat ini untuk mengubah password")
        return
      }
    }

    setIsLoading(true)

    try {
      const updateData: any = {
        email: formData.email,
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      await adminFetchJson("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      setSuccess("Profil berhasil diperbarui!")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      
      // Refresh after 2 seconds
      setTimeout(() => {
        router.refresh()
      }, 2000)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600 mt-2">Kelola informasi dan password akun Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>
            Perbarui email dan password akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="admin@pec.id"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Ubah Password</h3>
              <p className="text-sm text-gray-500">
                Kosongkan jika tidak ingin mengubah password
              </p>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  disabled={isLoading}
                  placeholder="Masukkan password saat ini"
                />
                <p className="text-xs text-gray-500">
                  Wajib diisi jika ingin mengubah password
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  disabled={isLoading}
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading || !formData.newPassword}
                  placeholder="Ulangi password baru"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

