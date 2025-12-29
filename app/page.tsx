import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"

export default async function Home() {
  // Fetch dynamic content with error handling
  let heroTitle, heroSubtitle, heroDescription
  let services: Array<{ id: string; title: string; description: string; slug: string }> = []
  
  try {
    heroTitle = await prisma.content.findUnique({ where: { key: "hero_title" } })
    heroSubtitle = await prisma.content.findUnique({ where: { key: "hero_subtitle" } })
    heroDescription = await prisma.content.findUnique({ where: { key: "hero_description" } })
    services = await prisma.service.findMany({ take: 3 })
    console.log("✅ Data loaded successfully:", { 
      heroTitle: heroTitle?.value, 
      servicesCount: services.length 
    })
  } catch (error) {
    console.error("❌ Database connection error:", error)
    // Use fallback values if database is not available
    heroTitle = null
    heroSubtitle = null
    heroDescription = null
    services = []
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {heroTitle?.value || "Selamat Datang di PEC Indonesia"}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-semibold mb-6">
              {heroSubtitle?.value || "Lembaga Pendidikan Terbaik & Terbesar"}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              {heroDescription?.value || "Kami menyediakan program pendidikan berkualitas tinggi untuk siswa SD hingga SMA."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/services">Lihat Layanan</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/about">Tentang Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Program pendidikan berkualitas untuk membantu siswa mencapai prestasi terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/services#${service.slug}`}>
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/services">
                Lihat Semua Layanan
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Siswa Aktif</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Program Unggulan</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">35+</h3>
              <p className="text-gray-600">Tahun Pengalaman</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
