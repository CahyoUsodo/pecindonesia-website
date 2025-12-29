import { prisma } from "@/lib/prisma"
import FadeInSection from "@/components/fade-in-section"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import TestimonialCard from "@/components/testimonial-card"
import AnimatedCard from "@/components/animated-card"
import { Testimonial } from "@prisma/client"

export const metadata = {
  title: "Testimoni - PEC Indonesia",
  description: "Baca pengalaman dan kesuksesan siswa-siswa PEC Indonesia dalam mencapai prestasi terbaik mereka.",
}

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = []
  
  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    })
    console.log("✅ Testimonials loaded:", testimonials.length)
  } catch (error) {
    console.error("❌ Database connection error:", error)
    testimonials = []
  }

  // Hanya ambil 10 testimoni teratas untuk carousel
  const topTestimonials = testimonials.slice(0, 10)
  const remainingTestimonials = testimonials.slice(10)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Testimoni Siswa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dengarkan pengalaman dan kesuksesan siswa-siswa kami
            </p>
          </div>
        </FadeInSection>

        {/* Testimonials Carousel - Hanya untuk 10 testimoni teratas */}
        {topTestimonials.length > 0 && (
          <div className="mb-16">
            <TestimonialsCarousel 
              testimonials={topTestimonials}
              itemsPerPage={5}
              autoRotateInterval={15000}
            />
          </div>
        )}

        {/* Testimoni Lainnya - Grid biasa untuk sisanya */}
        {remainingTestimonials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Testimoni Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingTestimonials.map((testimonial, index) => (
                <AnimatedCard key={testimonial.id} delay={index * 0.1}>
                  <TestimonialCard
                    studentName={testimonial.studentName}
                    role={testimonial.role}
                    reviewText={testimonial.reviewText}
                    rating={testimonial.rating}
                    photoUrl={testimonial.photoUrl}
                  />
                </AnimatedCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
