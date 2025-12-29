import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, MapPin } from "lucide-react"
import DeleteBranchButton from "@/components/admin/delete-branch-button"

export default async function AdminBranchesPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cabang</h1>
        <Button asChild>
          <Link href="/admin/branches/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Cabang
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {branch.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">{branch.address}</p>
              {branch.contactNumber && (
                <p className="text-sm text-gray-600 mb-4">Tel: {branch.contactNumber}</p>
              )}
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/branches/${branch.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DeleteBranchButton branchId={branch.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

