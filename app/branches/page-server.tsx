import { prisma } from "@/lib/prisma"
import BranchesPageClient from "./branches-client"
import { Branch } from "@prisma/client"

export const metadata = {
  title: "Cabang - PEC Indonesia",
  description: "Temukan lokasi cabang PEC Indonesia terdekat. Kami hadir di Pamulang, Depok, dan Jakarta Selatan.",
}

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BranchesPage() {
  let branches: Branch[] = []
  
  try {
    branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    })
  } catch (error) {
    console.error("Database connection error:", error)
    branches = []
  }

  return <BranchesPageClient branches={branches} />
}

