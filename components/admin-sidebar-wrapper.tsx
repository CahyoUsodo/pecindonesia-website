import AdminSidebar from "@/components/admin-sidebar"

export default function AdminSidebarWrapper() {
  // No session needed - password auth is handled client-side
  return <AdminSidebar />
}

