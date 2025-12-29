import { redirect } from "next/navigation"
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
  const pathname = headersList.get("x-pathname") || ""
  
  // Check if we're on login page
  const isLoginPage = pathname === "/admin/login" || pathname.includes("/admin/login")
  
  // If user is authenticated and on login page, redirect to dashboard
  // This prevents login form from showing when user is already logged in
  if (session && isLoginPage) {
    redirect("/admin")
  }

  // If no session, just render children (middleware will handle redirect to login)
  // This allows login page to render without sidebar
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

