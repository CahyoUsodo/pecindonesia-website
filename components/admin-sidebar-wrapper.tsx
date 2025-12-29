import { getServerSession } from "@/lib/get-session"
import AdminSidebar from "@/components/admin-sidebar"

export default async function AdminSidebarWrapper() {
  const session = await getServerSession()
  
  // Debug: Log session to help troubleshoot
  if (process.env.NODE_ENV === "development") {
    console.log("AdminSidebarWrapper - Session:", {
      hasSession: !!session,
      email: session?.user?.email,
      role: session?.user?.role,
    })
  }
  
  return (
    <AdminSidebar 
      userEmail={session?.user?.email || undefined} 
      userRole={session?.user?.role || undefined} 
    />
  )
}

