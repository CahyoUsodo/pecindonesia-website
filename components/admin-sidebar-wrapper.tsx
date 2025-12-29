import { getServerSession } from "@/lib/get-session"
import AdminSidebar from "@/components/admin-sidebar"

export default async function AdminSidebarWrapper() {
  const session = await getServerSession()
  
  return <AdminSidebar userEmail={session?.user?.email} userRole={session?.user?.role} />
}

