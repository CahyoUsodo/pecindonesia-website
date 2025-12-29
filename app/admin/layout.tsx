"use client"

import AdminSidebarWrapper from "@/components/admin-sidebar-wrapper"
import AdminPasswordGuard from "@/components/admin-password-guard"

// Force all admin pages to be dynamic (not statically generated)
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Password protection is handled by AdminPasswordGuard
  return (
    <AdminPasswordGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Always render */}
          <AdminSidebarWrapper />

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 min-h-screen">{children}</main>
        </div>
      </div>
    </AdminPasswordGuard>
  )
}

