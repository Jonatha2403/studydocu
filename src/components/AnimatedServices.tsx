'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const servicios = [
  '📄 Ensayos académicos personalizados',
  '🧠 Exámenes bimestrales y de recuperación',
  '🧪 Exámenes complexivos y de validación',
  '💻 Programación Python – UTPL',
  '📚 Revisión de normas APA',
  '🧩 Mapas conceptuales estructurados',
  '🎓 Aprobamos plataformas universitarias de todas las carreras',
  '⚖️ Derecho y Administración de Empresas',
  '📒 Contabilidad y Auditoría',
  '📝 Asistencia en quices y exámenes online',
  '📌 Tareas explicadas paso a paso',
  '📊 Presentaciones PowerPoint profesionales',
  '🧾 Asesorías por Zoom en tiempo real'
]

const groupSize = 2

export default function AnimatedServices() {
  const [startIndex, setStartIndex] = useState(0)

  const nextGroup = () => {
    setStartIndex((prev) => (prev + groupSize) % servicios.length)
  }

  useEffect(() => {
    const interval = setInterval(nextGroup, 3000)
    return () => clearInterval(interval)
  }, [])

  const currentGroup = servicios.slice(startIndex, startIndex + groupSize)
  const visible = currentGroup.length === groupSize
    ? currentGroup
    : [...currentGroup, ...servicios.slice(0, groupSize - currentGroup.length)]

  return (
    <div className="flex flex-col items-center mt-8 px-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 justify-center">
      <AnimatePresence mode="wait">
        {visible.map((text, i) => (
          <motion.div
            key={`${text}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-100 shadow-md text-sm sm:text-base"
          >
            <Sparkles size={18} className="text-purple-500" />
            <span>{text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
