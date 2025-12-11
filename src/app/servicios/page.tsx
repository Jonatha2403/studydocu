'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Clock,
  BookOpen,
  Filter,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type Categoria =
  | 'Todos'
  | 'Ensayos'
  | 'Exámenes'
  | 'Plataformas'
  | 'Diseño'
  | 'Normas'
  | 'Asesorías'

type Servicio = {
  titulo: string
  categoria: Exclude<Categoria, 'Todos'>
  descripcion: string
  destacado?: boolean
}

const allServicios: Servicio[] = [
  {
    titulo: '📄 Ensayos académicos personalizados',
    categoria: 'Ensayos',
    descripcion: 'Redacción original, con citas y referencias en formato académico.',
    destacado: true,
  },
  {
    titulo: '🧠 Exámenes bimestrales y de recuperación',
    categoria: 'Exámenes',
    descripcion: 'Acompañamiento en evaluaciones parciales y de recuperación.',
    destacado: true,
  },
  {
    titulo: '🧪 Exámenes complexivos y de validación',
    categoria: 'Exámenes',
    descripcion: 'Preparación intensiva para exámenes finales o de titulación.',
  },
  {
    titulo: '💻 Programación Python – UTPL',
    categoria: 'Plataformas',
    descripcion: 'Resolución y guía en tareas de programación y lógica.',
  },
  {
    titulo: '📚 Revisión de normas APA',
    categoria: 'Normas',
    descripcion: 'Corrección de citas, referencias y formato según normas APA.',
  },
  {
    titulo: '🧩 Mapas conceptuales estructurados',
    categoria: 'Diseño',
    descripcion: 'Diseño visual claro para resúmenes y exposiciones.',
  },
  {
    titulo: '🎓 Aprobamos plataformas universitarias de todas las carreras',
    categoria: 'Plataformas',
    descripcion: 'Soporte en el uso de plataformas académicas y actividades virtuales.',
  },
  {
    titulo: '⚖️ Plataforma completa de Derecho',
    categoria: 'Plataformas',
    descripcion: 'Casos prácticos, foros, tareas y evaluaciones de Derecho.',
  },
  {
    titulo: '📊 Plataforma completa de Administración de Empresas',
    categoria: 'Plataformas',
    descripcion: 'Apoyo en proyectos, casos, Excel y actividades de administración.',
  },
  {
    titulo: '📒 Plataforma completa de Contabilidad y Auditoría',
    categoria: 'Plataformas',
    descripcion: 'Estados financieros, NIIF, análisis de casos y más.',
  },
  {
    titulo: '🧠 Plataforma completa de Psicología',
    categoria: 'Plataformas',
    descripcion: 'Actividades, casos y proyectos de varias ramas de Psicología.',
  },
  {
    titulo: '📄 Ensayos en formato APA con fuentes confiables',
    categoria: 'Ensayos',
    descripcion: 'Ensayos listos para entregar, basados en bibliografía verificada.',
  },
  {
    titulo: '✍️ Resúmenes académicos claros y estructurados',
    categoria: 'Ensayos',
    descripcion: 'Síntesis de textos, libros o clases en lenguaje claro.',
  },
  {
    titulo: '📝 Asistencia en quices y exámenes online',
    categoria: 'Exámenes',
    descripcion: 'Soporte en evaluaciones en línea con enfoque práctico.',
  },
  {
    titulo: '📌 Tareas o deberes personalizados explicados paso a paso',
    categoria: 'Ensayos',
    descripcion: 'Te explicamos la resolución para que también aprendas.',
  },
  {
    titulo: '📊 Presentaciones PowerPoint profesionales',
    categoria: 'Diseño',
    descripcion: 'Diapositivas visuales, limpias y listas para exponer.',
  },
  {
    titulo: '🧾 Asesorías por Zoom en tiempo real',
    categoria: 'Asesorías',
    descripcion: 'Sesiones privadas para resolver dudas específicas.',
    destacado: true,
  },
]

const categorias: Categoria[] = [
  'Todos',
  'Ensayos',
  'Exámenes',
  'Plataformas',
  'Diseño',
  'Normas',
  'Asesorías',
]

export const metadata = {
  title: "Servicios Académicos UTPL – Ensayos, Exámenes y Asesorías | StudyDocu",
  description:
    "Servicios académicos profesionales: ensayos en formato APA, exámenes, plataformas UTPL, resúmenes, asesorías y más. Atención para estudiantes de Ecuador.",
  keywords: [
    "servicios académicos",
    "UTPL",
    "ensayos APA",
    "exámenes UTPL",
    "plataformas universitarias",
    "tareas universitarias",
    "asesorías académicas",
  ],
  alternates: {
    canonical: "https://studydocu.ec/servicios",
  }
}
export default function ServiciosPage() {
  const [visibleCount, setVisibleCount] = useState(8)
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria>('Todos')

  const serviciosFiltrados = useMemo(() => {
    const base =
      filtroCategoria === 'Todos'
        ? allServicios
        : allServicios.filter((s) => s.categoria === filtroCategoria)
    return base.slice(0, visibleCount)
  }, [visibleCount, filtroCategoria])

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8)
  }

  const handleWhatsAppClick = () => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(
      'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20contratar%20un%20servicio%20acad%C3%A9mico',
      '_blank',
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16">
      {/* Hero / Intro */}
      <motion.section
        className="grid gap-8 lg:grid-cols-[1.7fr,1.1fr] items-center mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Columna izquierda: texto */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 justify-center lg:justify-start mb-3">
            <Sparkles className="text-purple-500" size={24} />
            <span className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Servicios académicos StudyDocu
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Servicios académicos profesionales
            <span className="block text-purple-600 dark:text-purple-300">
              para estudiantes universitarios
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Te acompañamos en todo tu ciclo académico: ensayos, exámenes, plataformas universitarias,
            resúmenes, normas APA y asesorías personalizadas. Diseñado especialmente para estudiantes
            de la UTPL y universidades de Ecuador.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="text-green-500" size={18} />
              <span>Calidad académica verificada</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <Clock className="text-blue-500" size={18} />
              <span>Respuestas rápidas</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <GraduationCap className="text-amber-500" size={18} />
              <span>Enfoque en aprobación y aprendizaje</span>
            </div>
          </div>
        </div>

        {/* Columna derecha: card de resumen */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <CardContent className="relative p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">
                  Pack de servicios
                </p>
                <h2 className="text-lg font-semibold">Acompañamiento académico completo</h2>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                Ensayos, resúmenes y presentaciones listos para entregar.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                Apoyo en exámenes, quices y plataformas universitarias.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                Asesorías personalizadas para tareas y proyectos complejos.
              </li>
            </ul>

            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="mt-2 bg-white text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              📲 Hablar con un asesor
            </Button>

            <p className="text-[11px] text-white/70">
              Cuéntanos tu caso y te sugerimos el servicio adecuado para tu materia o plataforma.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Filtro por categoría */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-purple-500" />
          <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Filtrar por tipo de servicio
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => {
            const isActive = filtroCategoria === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setFiltroCategoria(cat)
                  setVisibleCount(8)
                }}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {serviciosFiltrados.map((servicio, index) => (
          <motion.div
            key={servicio.titulo}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <Card
              className={`rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md ${
                servicio.destacado ? 'ring-2 ring-purple-400/60 dark:ring-purple-500/70' : ''
              }`}
            >
              <CardContent className="p-4 text-left flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded px-2 py-1 inline-block">
                    {servicio.categoria}
                  </span>
                  {servicio.destacado && (
                    <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 px-2 py-1 rounded-full">
                      Más solicitado
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                  {servicio.titulo}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {servicio.descripcion}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Botón "ver más" */}
      {visibleCount < (
        filtroCategoria === 'Todos'
          ? allServicios
          : allServicios.filter((s) => s.categoria === filtroCategoria)
      ).length && (
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text:white mb-3">
          ¿Por qué contratar los servicios académicos de StudyDocu?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
          En StudyDocu trabajamos con estudiantes de la UTPL y de diversas universidades del
          Ecuador, brindando apoyo académico responsable y orientado al aprendizaje. Nuestros
          servicios están pensados para que entiendas mejor tus materias y optimices tu tiempo de
          estudio.
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

      {/* CTA WhatsApp final */}
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
    </main>
  )
}
