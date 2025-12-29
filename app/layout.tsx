import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StructuredData from "@/components/structured-data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ChatbotWidget from "@/components/chatbot-widget"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PEC Indonesia - Lembaga Pendidikan Terbaik & Terbesar",
  description: "Practical Education Center (PEC) - Lembaga pendidikan terbaik untuk English Course, Math Tutoring, dan Bimbingan Belajar untuk siswa SD, SMP, dan SMA.",
  keywords: ["PEC", "Pendidikan", "English Course", "Bimbel", "Tutoring", "Matematika"],
  authors: [{ name: "PEC Indonesia" }],
  openGraph: {
    title: "PEC Indonesia - Lembaga Pendidikan Terbaik & Terbesar",
    description: "Practical Education Center (PEC) - Lembaga pendidikan terbaik untuk siswa SD, SMP, dan SMA.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  )
}

