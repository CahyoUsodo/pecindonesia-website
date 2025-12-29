import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to find relevant FAQ based on keywords
function findRelevantFaq(message: string, faqs: any[]): any | null {
  const messageLower = message.toLowerCase()
  
  // Extract keywords from message
  const keywords = messageLower.split(/\s+/).filter(word => word.length > 2)
  
  // Score each FAQ based on keyword matches
  const scoredFaqs = faqs.map(faq => {
    const questionLower = faq.question.toLowerCase()
    const answerLower = faq.answer.toLowerCase()
    
    let score = 0
    
    // Check if keywords appear in question or answer
    keywords.forEach(keyword => {
      if (questionLower.includes(keyword)) score += 2 // Higher weight for question match
      if (answerLower.includes(keyword)) score += 1
    })
    
    // Special keyword matching for common topics
    const onlineKeywords = ["online", "daring", "dari rumah", "belajar online", "kelas online", "zoom", "virtual"]
    const biayaKeywords = ["biaya", "harga", "cost", "price", "bayar", "pembayaran", "uang"]
    const daftarKeywords = ["daftar", "pendaftaran", "register", "registrasi", "cara daftar"]
    const programKeywords = ["program", "layanan", "service", "kursus", "bimbel", "tutoring"]
    const lokasiKeywords = ["lokasi", "cabang", "alamat", "dimana", "dimana", "tempat"]
    const durasiKeywords = ["durasi", "lama", "berapa lama", "waktu", "semester"]
    const trialKeywords = ["trial", "uji coba", "coba", "test", "percobaan"]
    
    if (onlineKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("online") || answerLower.includes("online")) {
        score += 10
      }
    }
    
    if (biayaKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("biaya") || questionLower.includes("harga")) {
        score += 10
      }
    }
    
    if (daftarKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("daftar") || questionLower.includes("pendaftaran")) {
        score += 10
      }
    }
    
    if (programKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("program") || questionLower.includes("layanan")) {
        score += 10
      }
    }
    
    if (lokasiKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("lokasi") || questionLower.includes("cabang")) {
        score += 10
      }
    }
    
    if (durasiKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("durasi") || questionLower.includes("lama")) {
        score += 10
      }
    }
    
    if (trialKeywords.some(kw => messageLower.includes(kw))) {
      if (questionLower.includes("trial") || questionLower.includes("uji coba")) {
        score += 10
      }
    }
    
    return { faq, score }
  })
  
  // Sort by score and return the best match
  scoredFaqs.sort((a, b) => b.score - a.score)
  
  // Return FAQ if score is high enough (at least 2 points)
  if (scoredFaqs.length > 0 && scoredFaqs[0].score >= 2) {
    return scoredFaqs[0].faq
  }
  
  return null
}

// Function to find branch by city/location mentioned in message
function findBranchByLocation(message: string, branches: any[]): any | null {
  const messageLower = message.toLowerCase()
  
  // Common city/location keywords
  const cityKeywords: { [key: string]: string[] } = {
    "pamulang": ["pamulang", "tangerang selatan", "tangsel"],
    "depok": ["depok"],
    "jakarta selatan": ["jakarta selatan", "jaksel", "jakarta", "fatmawati"],
    "tangerang": ["tangerang", "tgr"],
  }
  
  // Check each branch
  for (const branch of branches) {
    const branchNameLower = branch.name.toLowerCase()
    const branchAddressLower = branch.address.toLowerCase()
    
    // Check if branch name or address matches any city keywords
    for (const [city, keywords] of Object.entries(cityKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        // Check if this branch is in the mentioned city
        if (branchNameLower.includes(city) || branchAddressLower.includes(city)) {
          return branch
        }
      }
    }
    
    // Direct match with branch name
    if (messageLower.includes(branchNameLower.replace("pec ", "").trim())) {
      return branch
    }
    
    // Check if message contains parts of branch address
    const addressParts = branchAddressLower.split(/[,\s]+/)
    const matchingParts = addressParts.filter(part => 
      part.length > 3 && messageLower.includes(part)
    )
    if (matchingParts.length > 0) {
      return branch
    }
  }
  
  return null
}

// Function to format branch information
function formatBranchInfo(branch: any, requestedInfo?: string[]): string {
  const parts: string[] = []
  
  if (!requestedInfo || requestedInfo.includes("nama") || requestedInfo.includes("cabang")) {
    parts.push(`📍 ${branch.name}`)
  }
  
  if (!requestedInfo || requestedInfo.includes("alamat") || requestedInfo.includes("address")) {
    parts.push(`Alamat: ${branch.address}`)
  }
  
  if (branch.contactNumber && (!requestedInfo || requestedInfo.includes("telepon") || requestedInfo.includes("nomor") || requestedInfo.includes("phone"))) {
    let phoneNumber = branch.contactNumber.replace(/\D/g, "")
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.substring(1)
    } else if (!phoneNumber.startsWith("62")) {
      phoneNumber = "62" + phoneNumber
    }
    parts.push(`📞 Telepon: ${branch.contactNumber}`)
    parts.push(`WhatsApp: wa.me/${phoneNumber}`)
  }
  
  if (branch.googleMapsLink && (!requestedInfo || requestedInfo.includes("maps") || requestedInfo.includes("google") || requestedInfo.includes("lokasi"))) {
    parts.push(`🗺️ Google Maps: ${branch.googleMapsLink}`)
  }
  
  return parts.join("\n")
}

// Fallback response function when OpenAI is not available
function getFallbackResponse(message: string, faqs: any[], services: any[], branches: any[]): string {
  const messageLower = message.toLowerCase()
  
  // Check if user is asking about branch information
  const branchKeywords = ["cabang", "alamat", "lokasi", "telepon", "nomor", "phone", "maps", "google maps", "tangerang", "depok", "jakarta"]
  const isBranchQuery = branchKeywords.some(keyword => messageLower.includes(keyword))
  
  if (isBranchQuery) {
    const foundBranch = findBranchByLocation(message, branches)
    
    if (foundBranch) {
      // Determine what information is requested
      const requestedInfo: string[] = []
      if (messageLower.includes("telepon") || messageLower.includes("nomor") || messageLower.includes("phone")) {
        requestedInfo.push("telepon")
      }
      if (messageLower.includes("alamat") || messageLower.includes("address")) {
        requestedInfo.push("alamat")
      }
      if (messageLower.includes("maps") || messageLower.includes("google")) {
        requestedInfo.push("maps")
      }
      
      return formatBranchInfo(foundBranch, requestedInfo.length > 0 ? requestedInfo : undefined)
    }
    
    // If no specific branch found, list all branches
    if (messageLower.includes("semua") || messageLower.includes("list") || messageLower.includes("daftar")) {
      const branchList = branches.map(branch => formatBranchInfo(branch)).join("\n\n")
      return `Berikut adalah daftar cabang PEC:\n\n${branchList}`
    }
  }
  
  // Try to find relevant FAQ first
  const relevantFaq = findRelevantFaq(message, faqs)
  if (relevantFaq) {
    return relevantFaq.answer
  }
  
  // Check for common questions with keyword matching
  if (messageLower.includes("biaya") || messageLower.includes("harga") || messageLower.includes("cost") || messageLower.includes("price")) {
    const faq = faqs.find(f => f.question.toLowerCase().includes("biaya") || f.question.toLowerCase().includes("harga"))
    if (faq) return faq.answer
    return "Biaya bervariasi tergantung program yang dipilih. Untuk informasi lengkap mengenai biaya, silakan hubungi cabang PEC terdekat atau hubungi customer service kami di 021-12345678."
  }

  if (messageLower.includes("daftar") || messageLower.includes("pendaftaran") || messageLower.includes("register")) {
    const faq = faqs.find(f => f.question.toLowerCase().includes("daftar") || f.question.toLowerCase().includes("pendaftaran"))
    if (faq) return faq.answer
    return "Anda dapat mendaftar dengan mengunjungi cabang PEC terdekat atau menghubungi kami melalui nomor telepon yang tersedia. Tim kami akan membantu proses pendaftaran dan memberikan informasi lengkap tentang program yang tersedia."
  }

  if (messageLower.includes("program") || messageLower.includes("layanan") || messageLower.includes("service")) {
    const serviceList = services.map(s => `- ${s.title}: ${s.description.substring(0, 100)}...`).join("\n")
    return `PEC menyediakan berbagai program pendidikan:\n\n${serviceList}\n\nUntuk informasi lebih lanjut, silakan hubungi cabang terdekat.`
  }

  if (messageLower.includes("lokasi") || messageLower.includes("cabang") || messageLower.includes("alamat")) {
    const branchList = branches.slice(0, 3).map(branch => `- ${branch.name}: ${branch.address}`).join("\n")
    return `PEC memiliki cabang di beberapa lokasi:\n\n${branchList}\n\nUntuk informasi lengkap termasuk nomor telepon dan Google Maps, silakan kunjungi halaman Cabang atau sebutkan nama kota/daerah yang Anda cari.`
  }

  // Default response
  return "Terima kasih atas pertanyaan Anda. Untuk informasi lebih lengkap, silakan hubungi cabang PEC terdekat atau kunjungi halaman Layanan dan FAQ di website kami. Anda juga dapat menghubungi kami di 021-12345678 atau email info@pec.id."
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key tidak di-set. Silakan tambahkan OPENAI_API_KEY di environment variables." },
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Fetch FAQs, Services, and Branches for context
    const [faqs, services, branches] = await Promise.all([
      prisma.faq.findMany().catch(() => []),
      prisma.service.findMany().catch(() => []),
      prisma.branch.findMany().catch(() => []),
    ])

    // Build context from FAQs and Services
    const faqContext = faqs
      .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join("\n\n")

    const servicesContext = services
      .map((service) => `${service.title}: ${service.description}`)
      .join("\n\n")

    const branchesContext = branches
      .map((branch) => {
        let info = `${branch.name}\nAlamat: ${branch.address}`
        if (branch.contactNumber) {
          info += `\nTelepon: ${branch.contactNumber}`
        }
        if (branch.googleMapsLink) {
          info += `\nGoogle Maps: ${branch.googleMapsLink}`
        }
        return info
      })
      .join("\n\n")

    // Simple keyword-based fallback if OpenAI fails
    const messageLower = message.toLowerCase()
    const fallbackResponse = getFallbackResponse(messageLower, faqs, services, branches)

    try {
      const systemPrompt = `Anda adalah asisten virtual untuk PEC (Practical Education Center) Indonesia, sebuah lembaga pendidikan yang menyediakan English Course, Math Tutoring, dan Bimbingan Belajar untuk siswa SD, SMP, dan SMA.

Informasi tentang layanan kami:
${servicesContext}

Pertanyaan yang sering diajukan (FAQ):
${faqContext}

Informasi Cabang PEC:
${branchesContext}

PENTING: 
- Gunakan jawaban dari FAQ di atas jika pertanyaan pengguna memiliki makna yang sama atau mirip dengan pertanyaan FAQ, meskipun kata-katanya berbeda.
- Contoh: Jika pengguna bertanya "apakah bisa belajar online dari rumah", ini sama dengan FAQ "Apakah PEC menyediakan kelas online?" - gunakan jawaban FAQ tersebut.
- Jika pengguna meminta informasi cabang tertentu (nomor telepon, alamat, Google Maps), berikan informasi lengkap dari cabang yang disebutkan.
- Contoh: Jika pengguna bertanya "berikan nomor telepon untuk PEC Tangerang" atau "alamat cabang Depok", berikan informasi spesifik dari cabang tersebut termasuk nomor telepon, alamat lengkap, dan link Google Maps jika tersedia.
- Format informasi cabang: Nama Cabang, Alamat lengkap, Nomor Telepon (dengan link WhatsApp jika tersedia), dan Link Google Maps.
- Jawab pertanyaan pengguna dengan ramah, informatif, dan dalam bahasa Indonesia.
- Jika pertanyaan tidak terkait dengan PEC atau tidak ada dalam konteks, arahkan pengguna untuk menghubungi cabang terdekat.
- Prioritaskan menggunakan jawaban dari FAQ yang relevan atau informasi cabang yang spesifik daripada membuat jawaban baru.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const response = completion.choices[0]?.message?.content || fallbackResponse
      return NextResponse.json({ response })
    } catch (openaiError: any) {
      // If OpenAI fails, use fallback response
      console.error("OpenAI error, using fallback:", openaiError)
      return NextResponse.json({ response: fallbackResponse })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    
    // More specific error messages
    let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi nanti."
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      if (errorMsg.includes("api key") || errorMsg.includes("401")) {
        errorMessage = "OpenAI API key tidak valid atau tidak di-set. Silakan hubungi administrator."
      } else if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("exceeded")) {
        errorMessage = "Quota OpenAI API telah habis. Silakan hubungi cabang PEC terdekat untuk informasi lebih lanjut melalui nomor telepon yang tersedia."
      } else if (errorMsg.includes("rate limit")) {
        errorMessage = "Terlalu banyak request. Silakan tunggu beberapa saat dan coba lagi."
      } else {
        errorMessage = "Maaf, layanan chat sementara tidak tersedia. Silakan hubungi kami melalui nomor telepon atau email yang tersedia di halaman Cabang."
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

