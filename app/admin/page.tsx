import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MapPin, HelpCircle, FileText } from "lucide-react"

export default async function AdminDashboard() {
  const [servicesCount, testimonialsCount, branchesCount, faqsCount, contentCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.branch.count(),
      prisma.faq.count(),
      prisma.content.count(),
    ])

  const stats = [
    {
      title: "Layanan",
      count: servicesCount,
      icon: BookOpen,
      href: "/admin/services",
    },
    {
      title: "Testimoni",
      count: testimonialsCount,
      icon: Users,
      href: "/admin/testimonials",
    },
    {
      title: "Cabang",
      count: branchesCount,
      icon: MapPin,
      href: "/admin/branches",
    },
    {
      title: "FAQ",
      count: faqsCount,
      icon: HelpCircle,
      href: "/admin/faqs",
    },
    {
      title: "Konten",
      count: contentCount,
      icon: FileText,
      href: "/admin/content",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{stat.title}</CardTitle>
                <Icon className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

