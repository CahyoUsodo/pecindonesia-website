"use client"

import { useEffect, useState } from "react"
import AdminPasswordGuard from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import DeleteAdminButton from "@/components/admin/delete-admin-button"
import { adminFetchJson } from "@/lib/admin-api-client"

interface Admin {
  id: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

function AdminAdminsPageContent() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdmins() {
      try {
        const data = await adminFetchJson<Admin[]>("/api/admin/admins")
        setAdmins(data)
      } catch (error) {
        console.error("Error loading admins:", error)
        setAdmins([])
      } finally {
        setLoading(false)
      }
    }
    loadAdmins()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Admin</h1>
        <Button asChild>
          <Link href="/admin/admins/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Admin
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardHeader>
              <CardTitle className="text-lg">{admin.email}</CardTitle>
              <p className="text-sm text-gray-500">
                Role: <span className="font-semibold text-primary">
                  {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/admins/${admin.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DeleteAdminButton adminId={admin.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminAdminsPage() {
  return (
    <AdminPasswordGuard>
      <AdminAdminsPageContent />
    </AdminPasswordGuard>
  )
}

