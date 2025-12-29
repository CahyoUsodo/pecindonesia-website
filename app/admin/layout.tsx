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

  // If no session, just render children (middleware will handle redirect to login)
  // This allows login page to render without sidebar
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // User is authenticated - show full admin layout with sidebar
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

