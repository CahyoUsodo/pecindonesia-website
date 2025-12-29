"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { adminFetchJson } from "@/lib/admin-api-client"

interface EditFaqPageProps {
  params: Promise<{ id: string }>
}

export default function EditFaqPage({ params }: EditFaqPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [faqId, setFaqId] = useState<string>("")
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  })

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setFaqId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!faqId) return

    async function fetchFaq() {
      try {
        const data = await adminFetchJson(`/api/admin/faqs/${faqId}`)
        setFormData({
          question: data.question || "",
          answer: data.answer || "",
        })
      } catch (error) {
        setError("Gagal memuat data FAQ")
        console.error("Error fetching FAQ:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchFaq()
  }, [faqId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await adminFetchJson(`/api/admin/faqs/${faqId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      router.push("/admin/faqs")
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
          <Link href="/admin/faqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit FAQ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit FAQ</CardTitle>
          <CardDescription>
            Perbarui informasi FAQ
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
              <Label htmlFor="question">Pertanyaan *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Contoh: Apa saja program yang tersedia di PEC?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Jawaban *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                required
                disabled={isLoading}
                rows={6}
                placeholder="Tuliskan jawaban untuk pertanyaan tersebut..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/faqs")}
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

