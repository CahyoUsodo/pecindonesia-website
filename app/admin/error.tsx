"use client"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Maaf, terjadi kesalahan saat memuat halaman admin."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}

