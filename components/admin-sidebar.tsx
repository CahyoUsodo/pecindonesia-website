"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, MapPin, BookOpen, HelpCircle, X, Menu, UserCog, Settings } from "lucide-react"
import AdminSignOut from "@/components/admin-signout"

interface AdminSidebarProps {
  userEmail?: string
  userRole?: string
}

export default function AdminSidebar({ userEmail, userRole }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Always show menu items - userEmail and userRole are optional
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/content", label: "Konten", icon: FileText },
    { href: "/admin/services", label: "Layanan", icon: BookOpen },
    { href: "/admin/testimonials", label: "Testimoni", icon: Users },
    { href: "/admin/branches", label: "Cabang", icon: MapPin },
    { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
    // Only show admin management for SUPER_ADMIN
    ...(userRole === "SUPER_ADMIN" ? [{ href: "/admin/admins", label: "Manajemen Admin", icon: UserCog }] : []),
    { href: "/admin/profile", label: "Profil", icon: Settings },
  ]

  // Debug in development
  if (process.env.NODE_ENV === "development") {
    console.log("AdminSidebar - Props:", { userEmail, userRole, menuItemsCount: menuItems.length })
  }

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Menu Button - Only show when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md shadow-lg"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-sm min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary">PEC Admin</h1>
              {userEmail && (
                <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
              )}
              {userRole && (
                <p className="text-xs text-primary font-semibold mt-1">
                  {userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </p>
              )}
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden ml-4 p-2 hover:bg-gray-100 rounded flex-shrink-0"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.length > 0 ? (
            menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-primary text-white" 
                      : "hover:bg-primary/10 hover:text-primary"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })
          ) : (
            <div className="text-sm text-gray-500 p-4">Menu sedang dimuat...</div>
          )}
        </nav>
        <div className="p-4 border-t">
          <AdminSignOut />
        </div>
      </aside>
    </>
  )
}

