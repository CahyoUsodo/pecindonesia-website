import { headers } from "next/headers"
import { getServerSession } from "@/lib/get-session"
import AdminSidebarWrapper from "@/components/admin-sidebar-wrapper"

// Force all admin pages to be dynamic (not statically generated)
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || ""
  
  // Check if we're on login page
  const isLoginPage = pathname === "/admin/login" || pathname.includes("/admin/login")
  
  // If on login page, don't show sidebar (middleware handles redirect if authenticated)
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // If no session, render without sidebar (middleware should have redirected to login)
  // But we render children anyway to avoid blank page
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // User is authenticated and not on login page - show full admin layout with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebarWrapper />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">{children}</main>
      </div>
    </div>
  )
}

