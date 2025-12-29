"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, ExternalLink, Search, X, ChevronDown } from "lucide-react"

// Helper function to convert phone number to WhatsApp format
function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, "")
  
  // If starts with 0, replace with 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1)
  }
  
  // If doesn't start with 62, add it
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned
  }
  
  return `https://wa.me/${cleaned}`
}

interface Branch {
  id: string
  name: string
  address: string
  contactNumber: string | null
  googleMapsLink: string | null
}

interface BranchesPageClientProps {
  branches: Branch[]
}

export default function BranchesPageClient({ branches }: BranchesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [citySearchQuery, setCitySearchQuery] = useState("")

  // Extract unique cities from branches
  const cities = useMemo(() => {
    const citySet = new Set<string>()
    branches.forEach((branch) => {
      const address = branch.address
      
      // Try to extract city from common patterns
      // Pattern 1: "Kota [City]" or "Kabupaten [City]"
      const kotaMatch = address.match(/(?:Kota|kota|KABUPATEN|Kabupaten)\s+([^,]+)/i)
      if (kotaMatch) {
        citySet.add(kotaMatch[1].trim())
      }
      
      // Pattern 2: "Kec. [Kecamatan], [City]"
      const kecMatch = address.match(/Kec\.\s+[^,]+,\s*([^,]+)/i)
      if (kecMatch) {
        citySet.add(kecMatch[1].trim())
      }
      
      // Pattern 3: Split by comma and take second to last part (usually city)
      const parts = address.split(",").map(p => p.trim())
      if (parts.length >= 2) {
        // Usually city is in the second to last part
        const possibleCity = parts[parts.length - 2]
        // Filter out common non-city words
        if (possibleCity && 
            !possibleCity.match(/^(kec|kecamatan|kel|kelurahan|rt|rw|no|jalan|jl|jl\.)$/i) &&
            possibleCity.length > 3) {
          citySet.add(possibleCity)
        }
      }
    })
    return Array.from(citySet).sort()
  }, [branches])

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery) return cities
    return cities.filter(city =>
      city.toLowerCase().includes(citySearchQuery.toLowerCase())
    )
  }, [cities, citySearchQuery])

  // Filter branches based on search and city
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (branch.contactNumber &&
          branch.contactNumber.includes(searchQuery))

      // City filter
      const matchesCity =
        selectedCity === "all" ||
        branch.address.toLowerCase().includes(selectedCity.toLowerCase())

      return matchesSearch && matchesCity
    })
  }, [branches, searchQuery, selectedCity])

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cabang Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan lokasi cabang PEC terdekat dengan Anda
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari cabang berdasarkan nama, alamat, atau nomor telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* City Filter - Dropdown */}
          {cities.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="city-filter" className="text-sm font-medium">
                Filter berdasarkan Kota ({cities.length} kota tersedia)
              </Label>
              <div className="relative">
                <select
                  id="city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full md:w-64 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Kota</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {selectedCity !== "all" && (
                <button
                  onClick={() => setSelectedCity("all")}
                  className="text-sm text-primary hover:underline"
                >
                  Reset filter kota
                </button>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Menampilkan {filteredBranches.length} dari {branches.length} cabang
          </div>
        </div>

        {/* Branches Grid */}
        {filteredBranches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {branch.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Alamat:</p>
                    <p className="text-gray-900">{branch.address}</p>
                  </div>
                  
                  {branch.contactNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Telepon:</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <a
                          href={formatWhatsAppNumber(branch.contactNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {branch.contactNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {branch.googleMapsLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <a
                        href={branch.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Buka di Google Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Tidak ada cabang yang ditemukan.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Coba ubah kata kunci pencarian atau filter kota.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

