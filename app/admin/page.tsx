"use client"

import { useEffect, useState } from "react"
import AdminPasswordGuard from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MapPin, HelpCircle, FileText } from "lucide-react"
import { adminFetchJson } from "@/lib/admin-api-client"

interface Stats {
  services: number
  testimonials: number
  branches: number
  faqs: number
  content: number
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminFetchJson("/api/admin/stats")
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
        // Set default values on error
        setStats({ services: 0, testimonials: 0, branches: 0, faqs: 0, content: 0 })
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-600">Gagal memuat data</div>
  }

  const statItems = [
    {
      title: "Layanan",
      count: stats.services,
      icon: BookOpen,
      href: "/admin/services",
    },
    {
      title: "Testimoni",
      count: stats.testimonials,
      icon: Users,
      href: "/admin/testimonials",
    },
    {
      title: "Cabang",
      count: stats.branches,
      icon: MapPin,
      href: "/admin/branches",
    },
    {
      title: "FAQ",
      count: stats.faqs,
      icon: HelpCircle,
      href: "/admin/faqs",
    },
    {
      title: "Konten",
      count: stats.content,
      icon: FileText,
      href: "/admin/content",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat) => {
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

export default function AdminDashboard() {
  return (
    <AdminPasswordGuard>
      <AdminDashboardContent />
    </AdminPasswordGuard>
  )
}

