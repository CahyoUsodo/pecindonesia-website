"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Don't render footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 relative">
                <Image
                  src="/logo.png"
                  alt="PEC Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">PEC Indonesia</span>
            </div>
            <p className="text-gray-400 mb-4">
              Lembaga Pendidikan Terbaik & Terbesar untuk Masa Depan Cerah
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pecindonesia?igsh=MXNrM3d6NDgwZnZuMw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@pujiempire3188"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-primary transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-400 hover:text-primary transition-colors">
                  Testimoni
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-gray-400 hover:text-primary transition-colors">
                  Cabang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Phone size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">021-12345678</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">info@pec.id</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Jl. Raya Duri Kosambi No.68,<br />
                  Kota Jakarta Barat
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PEC Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

