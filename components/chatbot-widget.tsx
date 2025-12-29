"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ChatbotWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Don't render chatbot on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  // Helper to render message content with clickable links (WhatsApp, Google Maps, dll)
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+)/g

    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      const trimmed = part.trim()
      const isUrl =
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("wa.me/")

      if (!isUrl) {
        return <span key={index}>{part}</span>
      }

      const href = trimmed.startsWith("wa.me/") ? `https://${trimmed}` : trimmed

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary break-all"
        >
          {trimmed}
        </a>
      )
    })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      
      if (data.error) {
        // Show user-friendly error message
        setMessages((prev) => [...prev, { role: "assistant", content: data.error }])
        return
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "Maaf, saya tidak dapat menjawab pertanyaan tersebut." }])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Maaf, terjadi kesalahan. Silakan hubungi cabang PEC terdekat untuk informasi lebih lanjut."
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-50"
        aria-label="Open chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 w-[calc(100%-2rem)] sm:w-96 h-[70vh] sm:h-[500px] max-h-[80vh] flex flex-col shadow-2xl z-50"
        >
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">Chat dengan PEC</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chatbot">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>Halo! Ada yang bisa saya bantu?</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 break-words ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {renderMessageContent(msg.content)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Mengetik...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tulis pesan..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}

