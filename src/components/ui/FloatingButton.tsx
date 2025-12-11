'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Upload, Search, Sparkles, X, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export default function FloatingButton() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? ''

  // Rutas donde NO debe aparecer el botón flotante
  const hiddenRoutes = ['/login', '/registro']
  if (hiddenRoutes.includes(pathname)) return null

  return (
    <div className="relative">
      {/* BOTONES PRINCIPAL */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="
          w-12 h-12 rounded-full shadow-xl
          bg-white dark:bg-gray-900
          border border-gray-300 dark:border-gray-700
          flex items-center justify-center
          hover:scale-105 active:scale-95
          transition-all
        "
        aria-label="Abrir menú de acciones"
      >
        {open ? <X size={20} /> : <Bot size={20} />}
      </motion.button>

      {/* MENÚ FLOTANTE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.20 }}
            className="
              absolute bottom-14 right-0
              flex flex-col items-end gap-3 z-50
            "
          >
            {/* 🟣 Chat / Asistente académico */}
            <button
              onClick={() => alert('Asistente académico en desarrollo')}
              className="
                bg-white dark:bg-gray-800 
                p-3 rounded-full shadow-lg
                hover:scale-105 transition-all
              "
              aria-label="Asistente académico"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
            </button>

            {/* ✨ IA educativa */}
            <Link href="/ia">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Sparkles size={16} />
                IA educativa
              </Button>
            </Link>

            {/* 🔎 Explorar */}
            <Link href="/explorar">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Search size={16} /> Explorar
              </Button>
            </Link>

            {/* ⬆ Subir documento */}
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
