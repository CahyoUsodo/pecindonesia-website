import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, BookOpen } from "lucide-react"

export const metadata = {
  title: "Tentang Kami - PEC Indonesia",
  description: "Pelajari lebih lanjut tentang sejarah, visi, dan misi PEC Indonesia sebagai lembaga pendidikan terbaik dan terbesar.",
}

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPage() {
  let history, vision, mission
  
  try {
    history = await prisma.content.findUnique({ where: { key: "about_history" } })
    vision = await prisma.content.findUnique({ where: { key: "about_vision" } })
    mission = await prisma.content.findUnique({ where: { key: "about_mission" } })
  } catch (error) {
    console.error("Database connection error:", error)
    history = null
    vision = null
    mission = null
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tentang PEC Indonesia
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lembaga Pendidikan Terbaik & Terbesar untuk Masa Depan Cerah
          </p>
        </div>

        {/* History Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Sejarah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                {history?.value || "PEC (Practical Education Center) didirikan dengan visi untuk memberikan pendidikan praktis dan berkualitas tinggi."}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Visi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                {vision?.value || "Menjadi lembaga pendidikan terbaik, terbesar, dan terfavorit dengan menghasilkan output siswa yang berprestasi, bermental juara, serta memiliki kecerdasan emosi (EQ) yang baik."}
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Misi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                {mission?.value ? (
                  mission.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .map((item, index) => {
                      // Remove bullet point if already present (support various bullet formats)
                      const cleanItem = item.replace(/^[•\-\*]\s*/, '').trim()
                      if (!cleanItem) return null
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                          <span className="flex-1">{cleanItem}</span>
                        </li>
                      )
                    })
                    .filter((item) => item !== null)
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Menjadikan lembaga sebagai pusat kemuliaan dengan menolong, menyelamatkan, dan mengantarkan para siswa meraih kesuksesan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Membuat sebanyak mungkin orang Indonesia mampu berbahasa Inggris dan berprestasi, dengan menciptakan metode pengajaran PEC yang mudah, sederhana, menyenangkan, serta dengan biaya yang terjangkau.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Mengembangkan kecerdasan emosi dan kepribadian unggul siswa.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Menjadi mitra terbaik sekolah, masyarakat, dan orang tua dalam meraih kesuksesan siswa.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Menciptakan pusat pendidikan yang bagaikan taman indah penuh bunga warna-warni harum semerbak mewangi.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg mt-0.5 flex-shrink-0 font-bold">•</span>
                      <span className="flex-1">Menjadi rumah kedua dan orang tua kedua bagi siswa.</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mengapa Memilih PEC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengajar Berpengalaman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tim pengajar profesional dan berpengalaman di bidangnya masing-masing.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembelajaran Modern</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Menggunakan metode pembelajaran yang inovatif dan menyenangkan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ruang kelas nyaman dan fasilitas pendukung yang memadai.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

