import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  studentName: string
  role: string
  reviewText: string
  rating: number
  photoUrl?: string | null
}

export default function TestimonialCard({
  studentName,
  role,
  reviewText,
  rating,
  photoUrl,
}: TestimonialCardProps) {
  return (
    <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="p-6">
        {/* Top Section - Quote */}
        <div className="mb-4">
          <p className="text-gray-700 italic leading-relaxed">&ldquo;{reviewText}&rdquo;</p>
        </div>

        {/* Star Rating - Moved to top */}
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < rating
                    ? "fill-primary text-primary"
                    : "fill-gray-300 text-gray-300"
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom Section - Avatar + Name + Role */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={studentName}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <span className="text-primary font-semibold text-lg">
                {studentName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{studentName}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

