'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function WhatsappFloat() {
  return (
    <Link
      href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20necesito%20ayuda%20con%20un%20servicio%20acad%C3%A9mico"
      target="_blank"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-green-500 hover:bg-green-600 active:scale-95 transition-all duration-200 shadow-xl rounded-full p-4 flex items-center justify-center">
        <MessageCircle className="text-white" size={28} />
      </div>
    </Link>
  )
}
