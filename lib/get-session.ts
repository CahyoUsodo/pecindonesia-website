import { auth } from "@/lib/auth"

export async function getServerSession() {
  try {
    const session = await auth()
    
    if (!session) {
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

