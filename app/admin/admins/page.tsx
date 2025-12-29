import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import DeleteAdminButton from "@/components/admin/delete-admin-button"

export default async function AdminAdminsPage() {
  const session = await getServerSession()
  
  // Only SUPER_ADMIN can access this page
  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/admin")
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
  })

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
                {/* Don't allow deleting own account */}
                {admin.id !== session.user?.id && (
                  <DeleteAdminButton adminId={admin.id} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

