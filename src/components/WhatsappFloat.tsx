'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function WhatsappFloat() {
  return (
    <Link
      href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20necesito%20ayuda%20con%20un%20servicio%20acad%C3%A9mico"
      target="_blank"
      aria-label="Chatea con StudyDocu por WhatsApp"
      className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
    >
      <Image
        src="/whatsapp-logo.png"
        alt="WhatsApp"
        width={28}
        height={28}
        className="rounded-full"
      />
    </Link>
  )
}

