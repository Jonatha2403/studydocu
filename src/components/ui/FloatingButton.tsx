'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Upload, Search, Sparkles, X, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function FloatingButton() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? ''
  const hiddenRoutes = ['/login', '/registro']
  if (hiddenRoutes.includes(pathname)) return null

  return (
    // 🔹 Contenedor relativo, sin w-12 h-12
    <div className="relative">
      {/* Botón principal 🤖 */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                   text-primary rounded-full shadow-xl flex items-center justify-center
                   hover:scale-105 active:scale-95 transition-all"
      >
        <span className="sr-only">Abrir menú de acciones</span>
        {open ? <X size={20} /> : <Bot size={20} />}
      </motion.button>

      {/* Menú flotante (encima del botón, pegado a la derecha) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="
              absolute bottom-14 right-0
              flex flex-col items-end gap-3
              z-50
            "
          >
            {/* Botón adicional */}
            <button
              onClick={() => alert('Botón extra presionado')}
              className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
            </button>

            {/* WhatsApp */}
            <Link
              href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20necesito%20ayuda%20con%20un%20servicio%20acad%C3%A9mico"
              target="_blank"
            >
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Image
                  src="/whatsapp-logo.png"
                  alt="WhatsApp"
                  width={16}
                  height={16}
                />
                WhatsApp
              </Button>
            </Link>

            {/* IA Educativa */}
            <Link href="/ia">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Sparkles size={16} /> IA educativa
              </Button>
            </Link>

            {/* Explorar */}
            <Link href="/explorar">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Search size={16} /> Explorar
              </Button>
            </Link>

            {/* Subir documento */}
            <Link href="/subir">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Upload size={16} /> Subir documento
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
