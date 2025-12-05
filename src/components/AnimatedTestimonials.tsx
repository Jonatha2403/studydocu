// components/AnimatedTestimonials.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonios = [
  { nombre: 'María Fernández – UTPL', mensaje: '“StudyDocu me ayudó a aprobar mis exámenes finales sin estrés.”' },
  { nombre: 'Carlos Jiménez – UTPL', mensaje: '“Gracias a StudyDocu entendí mejor mis tareas de contabilidad.”' },
  { nombre: 'Valentina Muñoz – UTPL', mensaje: '“El formato APA estaba perfecto. No tuve que corregir nada.”' },
  { nombre: 'Kevin Rojas – UTPL', mensaje: '“Me encantó la asesoría por Zoom. Resolvieron todas mis dudas.”' },
  { nombre: 'Daniela Ortega – UTPL', mensaje: '“El resumen automático me ahorró muchísimo tiempo.”' },

  { nombre: 'Esteban Salazar – UIDE', mensaje: '“Excelente acompañamiento para mis trabajos de Derecho.”' },
  { nombre: 'Lucía Herrera – UIDE', mensaje: '“Muy útil para repasar antes de los exámenes bimestrales.”' },
  { nombre: 'Juan Paredes – UIDE', mensaje: '“El mapa conceptual fue justo lo que necesitaba.”' },
  { nombre: 'Andrea Pino – UIDE', mensaje: '“StudyDocu me ayudó a subir mis notas este semestre.”' },
  { nombre: 'Santiago Viteri – UIDE', mensaje: '“Me encantó la claridad de los resúmenes entregados.”' },

  { nombre: 'Carla Martínez – UNED', mensaje: '“La plataforma es ideal para quienes estudiamos a distancia.”' },
  { nombre: 'Luis Rodríguez – UNED', mensaje: '“Recibí ayuda puntual para mis ensayos académicos.”' },
  { nombre: 'Elena Navarro – UNED', mensaje: '“Excelente servicio para adaptar a mis horarios flexibles.”' },
  { nombre: 'Álvaro Ruiz – UNED', mensaje: '“Una herramienta clave para mis estudios en Psicología.”' },
  { nombre: 'Patricia Gómez – UNED', mensaje: '“Nunca había encontrado un apoyo tan profesional en línea.”' },

  { nombre: 'Pedro Quiroz – UNEMI', mensaje: '“Me salvaron con mis trabajos de última hora.”' },
  { nombre: 'María José Mendoza – UNEMI', mensaje: '“El PowerPoint que me hicieron fue increíble.”' },
  { nombre: 'Diego Bravo – UNEMI', mensaje: '“Aprobé plataformas gracias a su asesoría.”' },
  { nombre: 'Gabriela León – UNEMI', mensaje: '“La mejor opción para los que trabajamos y estudiamos.”' },
  { nombre: 'Julio Mena – UNEMI', mensaje: '“Excelente atención y cumplimiento de tiempos.”' },

  { nombre: 'Natalia Ríos – UNL', mensaje: '“Mis tareas ahora se ven más ordenadas y completas.”' },
  { nombre: 'César Medina – UNL', mensaje: '“Estudiar contabilidad fue más fácil con su ayuda.”' },
  { nombre: 'Paola Zambrano – UNL', mensaje: '“Perfecto para quienes necesitamos una guía académica.”' },
  { nombre: 'Jhonatan Armijos – UNL', mensaje: '“Gracias a StudyDocu me fue bien en el examen complexivo.”' },
  { nombre: 'Tatiana Rueda – UNL', mensaje: '“Muy confiables y siempre disponibles por WhatsApp.”' },

  { nombre: 'Camila Torres – UEES', mensaje: '“La plataforma tiene un diseño moderno y es fácil de usar.”' },
  { nombre: 'Cristian Alvarado – UEES', mensaje: '“Me ayudaron con una investigación completa y con fuentes.”' },
  { nombre: 'Fernanda Castro – UEES', mensaje: '“Muy profesionales, cumplieron con todo lo ofrecido.”' },
  { nombre: 'David Jácome – UEES', mensaje: '“Ideal para los estudiantes que necesitamos flexibilidad.”' },
  { nombre: 'Isabela Reyes – UEES', mensaje: '“Recomiendo StudyDocu a todos mis compañeros de clase.”' }
]

const groupSize = 3 // Mostrar de 3 en 3

export default function AnimatedTestimonials() {
  const [startIndex, setStartIndex] = useState(0)

  const nextGroup = () => {
    setStartIndex((prev) => (prev + groupSize) % testimonios.length)
  }

  useEffect(() => {
    const interval = setInterval(nextGroup, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentGroup = testimonios.slice(startIndex, startIndex + groupSize)
  // Si estamos al final, cortamos y añadimos desde el inicio
  const visibleTestimonials =
    currentGroup.length === groupSize
      ? currentGroup
      : [...currentGroup, ...testimonios.slice(0, groupSize - currentGroup.length)]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={startIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleTestimonials.map((testimonio, i) => (
          <div
            key={`${testimonio.nombre}-${i}`}
            className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-md text-center"
          >
            <div className="flex justify-center mb-3 text-yellow-400">
              {[...Array(5)].map((_, j) => <Star key={j} size={18} />)}
            </div>
            <p className="text-muted-foreground italic mb-3">{testimonio.mensaje}</p>
            <div className="font-semibold text-foreground">{testimonio.nombre}</div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}