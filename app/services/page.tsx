import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Service } from "@prisma/client"

export const metadata = {
  title: "Layanan - PEC Indonesia",
  description: "Jelajahi berbagai program pendidikan berkualitas di PEC Indonesia: English Course, Math Tutoring, dan Bimbingan Belajar.",
}

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ServicesPage() {
  let services: Service[] = []
  
  try {
    services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Database connection error:", error)
    services = []
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Layanan Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Program pendidikan berkualitas untuk membantu siswa mencapai prestasi terbaik
          </p>
        </div>

        {/* Services List - Vertical Layout */}
        <div className="space-y-20">
          {services.map((service) => (
            <div key={service.id} id={service.slug} className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h2>
              </div>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/branches`}>
                      Hubungi Kami
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ingin Tahu Lebih Lanjut?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Hubungi cabang PEC terdekat untuk informasi lebih detail tentang program yang tersedia.
              </p>
              <Button asChild size="lg">
                <Link href="/branches">Lihat Cabang Kami</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

