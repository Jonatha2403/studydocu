'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const allServicios = [
  { titulo: '📄 Ensayos académicos personalizados', categoria: 'Ensayos' },
  { titulo: '🧠 Exámenes bimestrales y de recuperación', categoria: 'Exámenes' },
  { titulo: '🧪 Exámenes complexivos y de validación', categoria: 'Exámenes' },
  { titulo: '💻 Programación Python – UTPL', categoria: 'Plataformas' },
  { titulo: '📚 Revisión de normas APA', categoria: 'Normas' },
  { titulo: '🧩 Mapas conceptuales estructurados', categoria: 'Diseño' },
  { titulo: '🎓 Aprobamos plataformas universitarias de todas las carreras', categoria: 'Plataformas' },
  { titulo: '⚖️ Plataforma completa de Derecho', categoria: 'Plataformas' },
  { titulo: '📊 Plataforma completa de Administración de Empresas', categoria: 'Plataformas' },
  { titulo: '📒 Plataforma completa de Contabilidad y Auditoría', categoria: 'Plataformas' },
  { titulo: '🧠 Plataforma completa de Psicología', categoria: 'Plataformas' },
  { titulo: '📄 Ensayos en formato APA con fuentes confiables', categoria: 'Ensayos' },
  { titulo: '✍️ Resúmenes académicos claros y estructurados', categoria: 'Ensayos' },
  { titulo: '📝 Asistencia en quices y exámenes online', categoria: 'Exámenes' },
  { titulo: '📌 Tareas o deberes personalizados explicados paso a paso', categoria: 'Ensayos' },
  { titulo: '📊 Presentaciones PowerPoint profesionales', categoria: 'Diseño' },
  { titulo: '🧾 Asesorías por Zoom en tiempo real', categoria: 'Asesorías' },
]

export default function ServiciosPage() {
  const [visibleCount, setVisibleCount] = useState(8)
  const visibleServicios = allServicios.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8)
  }

  const handleWhatsAppClick = () => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(
      'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20contratar%20un%20servicio%20acad%C3%A9mico',
      '_blank'
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      {/* Hero / Intro */}
      <motion.section
        className="text-center mb-10 lg:mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 justify-center mb-3">
          <Sparkles className="text-purple-500" size={24} />
          <span className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Servicios académicos StudyDocu
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Servicios académicos profesionales para estudiantes universitarios
        </h1>

        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Te acompañamos en todo tu ciclo académico: ensayos, exámenes, plataformas universitarias,
          resúmenes, normas APA y asesorías personalizadas. Diseñado especialmente para estudiantes
          de la UTPL y universidades de Ecuador.
        </p>
      </motion.section>

      {/* Grid de servicios */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleServicios.map((servicio, index) => (
          <motion.div
            key={servicio.titulo}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
          >
            <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
              <CardContent className="p-4 text-left">
                <span className="text-[11px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded px-2 py-1 mb-2 inline-block">
                  {servicio.categoria}
                </span>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                  {servicio.titulo}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {visibleCount < allServicios.length && (
        <div className="text-center mt-10">
          <Button
            onClick={loadMore}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl shadow-sm transition"
          >
            Ver más servicios
          </Button>
        </div>
      )}

      {/* Sección SEO: por qué elegir StudyDocu */}
      <section className="mt-14 max-w-4xl mx-auto text-center lg:text-left">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          ¿Por qué contratar los servicios académicos de StudyDocu?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
          En StudyDocu trabajamos con estudiantes de la UTPL y de diversas universidades del Ecuador,
          brindando apoyo académico responsable y orientado al aprendizaje. Nuestros servicios están
          pensados para que entiendas mejor tus materias y optimices tu tiempo de estudio.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ Ensayos académicos en formato APA con fuentes confiables.</li>
          <li>✅ Acompañamiento en exámenes bimestrales, quices y complexivos.</li>
          <li>✅ Manejo experto de plataformas universitarias (incluida UTPL).</li>
          <li>✅ Mapas conceptuales y presentaciones profesionales para tus clases.</li>
          <li>✅ Explicaciones paso a paso para tareas y proyectos.</li>
          <li>✅ Asesorías en vivo por Zoom o videollamada.</li>
        </ul>
      </section>

      {/* CTA WhatsApp */}
      <div className="mt-14 text-center">
        <Button
          onClick={handleWhatsAppClick}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-10 py-4 rounded-2xl shadow-xl transition duration-300"
        >
          📲 Solicitar servicio por WhatsApp
        </Button>
        <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Respuesta rápida. Cuéntanos qué necesitas y te ofrecemos la mejor opción académica.
        </p>
      </div>

      {/* ❌ Quitamos FloatingButtonsGroup aquí para evitar duplicado.
          Si ya lo tienes en el layout o en otra parte global, no hace falta repetirlo. */}
    </main>
  )
}
