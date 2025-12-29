import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import DeleteContentButton from "@/components/admin/delete-content-button"

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminContentPage() {
  const contents = await prisma.content.findMany({
    orderBy: { key: "asc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Konten</h1>
        <Button asChild>
          <Link href="/admin/content/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Konten
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <CardTitle className="text-lg">{content.key}</CardTitle>
              <p className="text-sm text-gray-500">{content.type}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {content.value}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/content/${content.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DeleteContentButton contentId={content.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

