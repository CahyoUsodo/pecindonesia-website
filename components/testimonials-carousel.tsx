"use client"

import { useState, useEffect } from "react"
import TestimonialCard from "@/components/testimonial-card"
import AnimatedCard from "@/components/animated-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: string
  studentName: string
  role: string
  reviewText: string
  rating: number
  photoUrl: string | null
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  itemsPerPage?: number
  autoRotateInterval?: number // in milliseconds
}

export default function TestimonialsCarousel({
  testimonials,
  itemsPerPage = 5,
  autoRotateInterval = 5000, // 5 seconds
}: TestimonialsCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  // Auto-rotate carousel
  useEffect(() => {
    if (totalPages <= 1) return // Don't auto-rotate if only one page

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [totalPages, autoRotateInterval])

  // Get testimonials for current page
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTestimonials = testimonials.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Belum ada testimoni tersedia.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {currentTestimonials.map((testimonial, index) => (
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

      {/* Navigation Controls - Only show if more than one page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            aria-label="Previous page"
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage
                    ? "bg-primary w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next page"
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, testimonials.length)} dari {testimonials.length} testimoni
        </div>
      )}
    </div>
  )
}

