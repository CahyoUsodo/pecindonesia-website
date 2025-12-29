export default function StructuredData() {
  const baseUrl = process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "PEC Indonesia",
    alternateName: "Practical Education Center",
    description: "Lembaga Pendidikan Terbaik & Terbesar untuk Masa Depan Cerah",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tangerang Selatan",
      addressRegion: "Banten",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-21-12345678",
      contactType: "Customer Service",
      email: "info@pec.id",
    },
    sameAs: [
      // Add social media links here when available
    ],
    offers: {
      "@type": "Offer",
      category: "Education",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

