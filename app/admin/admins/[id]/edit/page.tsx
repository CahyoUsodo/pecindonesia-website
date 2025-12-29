"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface EditAdminPageProps {
  params: Promise<{ id: string }>
}

export default function EditAdminPage({ params }: EditAdminPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [adminId, setAdminId] = useState<string>("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  })
  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setAdminId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!adminId) return

    async function fetchAdmin() {
      try {
        const data = await adminFetchJson(`/api/admin/admins/${adminId}`)
        setFormData({
          email: data.email || "",
          password: "",
          role: data.role || "ADMIN",
        })
      } catch (error) {
        setError("Gagal memuat data admin")
        console.error("Error fetching admin:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchAdmin()
  }, [adminId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const updateData: any = {
        email: formData.email,
        role: formData.role,
      }

      // Only include password if user wants to change it
      if (changePassword && formData.password) {
        updateData.password = formData.password
      }

      await adminFetchJson(`/api/admin/admins/${adminId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      router.push("/admin/admins")
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
          <Link href="/admin/admins">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Admin</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Admin</CardTitle>
          <CardDescription>
            Perbarui informasi admin
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="changePassword" className="cursor-pointer">
                  Ubah Password
                </Label>
              </div>
              {changePassword && (
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  minLength={6}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/admins")}
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

