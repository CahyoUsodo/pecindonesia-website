import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/get-session"
import AdminSidebarWrapper from "@/components/admin-sidebar-wrapper"

// Force all admin pages to be dynamic (not statically generated)
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check session - middleware handles redirects, so we just check here
  const session = await getServerSession()

  // If no session, middleware should have redirected already
  // But if we're here without session, just render children (for login page)
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Now a client component with mobile toggle */}
        <AdminSidebarWrapper />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">{children}</main>
      </div>
    </div>
  )
}

