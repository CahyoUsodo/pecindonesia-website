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
  
  // Debug in development
  if (process.env.NODE_ENV === "development") {
    console.log("AdminLayout - Session check:", {
      hasSession: !!session,
      pathname,
      email: session?.user?.email,
    })
  }
  
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

  // Always show sidebar for non-login pages (even if session is missing, for debugging)
  // Middleware should have redirected to login if no session, but we show sidebar anyway
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Always render for non-login pages */}
        <AdminSidebarWrapper />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 min-h-screen">{children}</main>
      </div>
    </div>
  )
}

