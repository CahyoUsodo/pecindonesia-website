import { prisma } from "@/lib/prisma"
import BranchesPageClient from "./branches-client"

export const metadata = {
  title: "Cabang - PEC Indonesia",
  description: "Temukan lokasi cabang PEC Indonesia terdekat. Kami hadir di Pamulang, Depok, dan Jakarta Selatan.",
}

export default async function BranchesPage() {
  let branches
  
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

