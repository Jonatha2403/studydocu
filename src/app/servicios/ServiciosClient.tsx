// src/app/servicios/ServiciosClient.tsx
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
  ArrowRight,
  FileText,
  BadgeCheck,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
  icon: LucideIcon
}

const WHATSAPP_NUMBER = '593958757302'

const buildWhatsAppUrl = (servicio?: string) => {
  const base = 'Hola StudyDocu, deseo contratar un servicio académico'
  const extra = servicio ? `: ${servicio}` : ''
  const text = encodeURIComponent(`${base}${extra}`)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

const categorias: Categoria[] = [
  'Todos',
  'Ensayos',
  'Exámenes',
  'Plataformas',
  'Diseño',
  'Normas',
  'Asesorías',
]

const iconByCategoria: Record<Exclude<Categoria, 'Todos'>, LucideIcon> = {
  Ensayos: FileText,
  Exámenes: CheckCircle2,
  Plataformas: BookOpen,
  Diseño: Sparkles,
  Normas: BadgeCheck,
  Asesorías: GraduationCap,
}

const allServicios: Servicio[] = [
  {
    titulo: '📄 Ensayos académicos personalizados',
    categoria: 'Ensayos',
    descripcion: 'Redacción original, con citas y referencias en formato académico.',
    destacado: true,
    icon: iconByCategoria.Ensayos,
  },
  {
    titulo: '📄 Ensayos en formato APA con fuentes confiables',
    categoria: 'Ensayos',
    descripcion: 'Ensayos listos para entregar, basados en bibliografía verificada.',
    icon: iconByCategoria.Ensayos,
  },
  {
    titulo: '✍️ Resúmenes académicos claros y estructurados',
    categoria: 'Ensayos',
    descripcion: 'Síntesis de textos, libros o clases en lenguaje claro.',
    icon: iconByCategoria.Ensayos,
  },
  {
    titulo: '📌 Tareas o deberes personalizados explicados paso a paso',
    categoria: 'Ensayos',
    descripcion: 'Te explicamos la resolución para que también aprendas.',
    icon: iconByCategoria.Ensayos,
  },
  {
    titulo: '🧠 Exámenes bimestrales y de recuperación',
    categoria: 'Exámenes',
    descripcion: 'Acompañamiento en evaluaciones parciales y de recuperación.',
    destacado: true,
    icon: iconByCategoria.Exámenes,
  },
  {
    titulo: '🧪 Exámenes complexivos y de validación',
    categoria: 'Exámenes',
    descripcion: 'Preparación intensiva para exámenes finales o de titulación.',
    icon: iconByCategoria.Exámenes,
  },
  {
    titulo: '📝 Asistencia en quices y exámenes online',
    categoria: 'Exámenes',
    descripcion: 'Soporte en evaluaciones en línea con enfoque práctico.',
    icon: iconByCategoria.Exámenes,
  },
  {
    titulo: '💻 Programación Python – UTPL',
    categoria: 'Plataformas',
    descripcion: 'Resolución y guía en tareas de programación y lógica.',
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '🎓 Aprobamos plataformas universitarias de todas las carreras',
    categoria: 'Plataformas',
    descripcion: 'Soporte en el uso de plataformas académicas y actividades virtuales.',
    destacado: true,
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '⚖️ Plataforma completa de Derecho',
    categoria: 'Plataformas',
    descripcion: 'Casos prácticos, foros, tareas y evaluaciones de Derecho.',
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '📊 Plataforma completa de Administración de Empresas',
    categoria: 'Plataformas',
    descripcion: 'Apoyo en proyectos, casos, Excel y actividades de administración.',
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '📒 Plataforma completa de Contabilidad y Auditoría',
    categoria: 'Plataformas',
    descripcion: 'Estados financieros, NIIF, análisis de casos y más.',
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '🧠 Plataforma completa de Psicología',
    categoria: 'Plataformas',
    descripcion: 'Actividades, casos y proyectos de varias ramas de Psicología.',
    icon: iconByCategoria.Plataformas,
  },
  {
    titulo: '🧩 Mapas conceptuales estructurados',
    categoria: 'Diseño',
    descripcion: 'Diseño visual claro para resúmenes y exposiciones.',
    icon: iconByCategoria.Diseño,
  },
  {
    titulo: '📊 Presentaciones PowerPoint profesionales',
    categoria: 'Diseño',
    descripcion: 'Diapositivas visuales, limpias y listas para exponer.',
    icon: iconByCategoria.Diseño,
  },
  {
    titulo: '📚 Revisión de normas APA',
    categoria: 'Normas',
    descripcion: 'Corrección de citas, referencias y formato según normas APA.',
    icon: iconByCategoria.Normas,
  },
  {
    titulo: '🧾 Asesorías por Zoom en tiempo real',
    categoria: 'Asesorías',
    descripcion: 'Sesiones privadas para resolver dudas específicas.',
    destacado: true,
    icon: iconByCategoria.Asesorías,
  },
]

const otrosServicios = [
  {
    titulo: 'TESIS PREGRADO',
    descripcion:
      'Estructura, planteamiento del problema, marco teórico, metodología, análisis y formato.',
    icon: GraduationCap,
  },
  {
    titulo: 'TESIS POSGRADO',
    descripcion:
      'Asesoría avanzada, redacción académica, matrices, análisis y normas de publicación.',
    icon: BadgeCheck,
  },
  {
    titulo: 'TESIS DOCTORADO',
    descripcion:
      'Acompañamiento riguroso: estado del arte, diseño metodológico, análisis y publicación.',
    icon: FileText,
  },
] as const

function Badge({
  children,
  variant = 'premium',
}: {
  children: string
  variant?: 'premium' | 'destacado'
}) {
  // Colores más pro (no chillones), y consistentes en dark mode.
  const cls =
    variant === 'destacado'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/20'
      : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20'

  return (
    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  )
}

function ServiceCard({
  title,
  subtitle,
  description,
  Icon,
  destacado,
  onClick,
  buttonText = 'Solicitar asesoría',
}: {
  title: string
  subtitle: string
  description: string
  Icon: LucideIcon
  destacado?: boolean
  onClick: () => void
  buttonText?: string
}) {
  return (
    <Card
      className={[
        'group relative rounded-2xl border bg-white/80 dark:bg-gray-900/70 backdrop-blur',
        'border-gray-200/80 dark:border-gray-700/70',
        'shadow-[0_8px_28px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_55px_-30px_rgba(0,0,0,0.45)]',
        'transition-all',
        destacado
          ? 'ring-1 ring-purple-400/40 dark:ring-purple-500/40'
          : 'hover:border-gray-300/80 dark:hover:border-gray-600/70',
      ].join(' ')}
    >
      {/* top accent */}
      <div
        className={[
          'absolute inset-x-0 top-0 h-[2px] rounded-t-2xl',
          destacado
            ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400'
            : 'bg-gradient-to-r from-transparent via-gray-200/70 to-transparent dark:via-gray-700/60',
        ].join(' ')}
      />

      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={[
                'h-10 w-10 rounded-xl flex items-center justify-center',
                'bg-purple-600/10 dark:bg-purple-400/10',
                'ring-1 ring-purple-600/10 dark:ring-purple-400/10',
                'transition-transform duration-300 group-hover:scale-[1.03]',
              ].join(' ')}
            >
              <Icon className="text-purple-700 dark:text-purple-200" size={20} />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-purple-700/90 dark:text-purple-200/90">
                {subtitle}
              </p>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Premium en TODOS */}
            <Badge variant="premium">Premium</Badge>
            {destacado ? <Badge variant="destacado">Más solicitado</Badge> : null}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>

        <div className="pt-1">
          <Button
            className={[
              'w-full rounded-xl text-white',
              'bg-gradient-to-r from-purple-600 to-indigo-600',
              'hover:from-purple-700 hover:to-indigo-700',
              'shadow-[0_14px_35px_-22px_rgba(99,102,241,0.65)]',
            ].join(' ')}
            onClick={onClick}
          >
            {buttonText} <ArrowRight size={16} className="ml-2" />
          </Button>

          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            Respuesta rápida por WhatsApp • Enfoque en aprobación y aprendizaje
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ServiciosClient() {
  const [visibleCount, setVisibleCount] = useState(8)
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria>('Todos')

  const totalFiltrado = useMemo(() => {
    return filtroCategoria === 'Todos'
      ? allServicios.length
      : allServicios.filter((s) => s.categoria === filtroCategoria).length
  }, [filtroCategoria])

  const serviciosFiltrados = useMemo(() => {
    const base =
      filtroCategoria === 'Todos'
        ? allServicios
        : allServicios.filter((s) => s.categoria === filtroCategoria)
    return base.slice(0, visibleCount)
  }, [visibleCount, filtroCategoria])

  const loadMore = () => setVisibleCount((prev) => prev + 8)

  const handleWhatsAppClick = (servicio?: string) => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(buildWhatsAppUrl(servicio), '_blank')
  }

  return (
    <main className="max-w-7xl mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16">
      {/* Hero */}
      <motion.section
        className="grid gap-8 lg:grid-cols-[1.7fr,1.1fr] items-center mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 justify-center lg:justify-start mb-3">
            <Sparkles className="text-purple-600" size={22} />
            <span className="text-purple-700 dark:text-purple-200 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Servicios académicos StudyDocu
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Servicios académicos profesionales
            <span className="block text-purple-700 dark:text-purple-200">
              para estudiantes universitarios
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            Te acompañamos en todo tu ciclo académico: ensayos, exámenes, plataformas
            universitarias, resúmenes, normas APA y asesorías personalizadas. Enfoque fuerte para
            UTPL y universidades de Ecuador.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-300" size={18} />
              <span>Calidad académica verificada</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              <Clock className="text-indigo-600 dark:text-indigo-300" size={18} />
              <span>Respuestas rápidas</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              <GraduationCap className="text-amber-600 dark:text-amber-300" size={18} />
              <span>Enfoque en aprobación y aprendizaje</span>
            </div>
          </div>
        </div>

        <Card className="border border-gray-200/60 dark:border-gray-700/60 shadow-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 text-white relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <CardContent className="relative p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/80">
                  Acompañamiento completo
                </p>
                <h2 className="text-lg font-semibold">Todo en un solo lugar</h2>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-200" />
                Ensayos, resúmenes y presentaciones listos para entregar.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-200" />
                Apoyo en exámenes, quices y plataformas universitarias.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-200" />
                Asesorías personalizadas para tareas y proyectos complejos.
              </li>
            </ul>

            <Button
              onClick={() => handleWhatsAppClick()}
              size="lg"
              className="mt-2 bg-white text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              📲 Hablar con un asesor
            </Button>

            <p className="text-[11px] text-white/80">
              Cuéntanos tu caso y te sugerimos el servicio adecuado para tu materia o plataforma.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* OTROS SERVICIOS (Tesis) */}
      <motion.section
        className="mb-10 lg:mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Nuevo
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              OTROS SERVICIOS
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Acompañamiento de alto nivel para trabajos de titulación y proyectos de investigación.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-gray-200 dark:border-gray-700"
            onClick={() => handleWhatsAppClick('Tesis (Pregrado / Posgrado / Doctorado)')}
          >
            Cotizar tesis <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otrosServicios.map((item) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28 }}
            >
              <ServiceCard
                title={item.titulo}
                subtitle="Investigación"
                description={item.descripcion}
                Icon={item.icon}
                destacado
                onClick={() => handleWhatsAppClick(item.titulo)}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Filtro */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-purple-600" />
          <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
            Filtrar por tipo de servicio
          </span>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            Mostrando {Math.min(visibleCount, totalFiltrado)} de {totalFiltrado}
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
                className={[
                  'px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-sm'
                    : 'bg-white/70 dark:bg-gray-900/60 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-gray-700/70 hover:bg-gray-100 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid servicios */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {serviciosFiltrados.map((servicio, index) => (
          <motion.div
            key={`${servicio.titulo}-${index}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, delay: index * 0.03 }}
          >
            <ServiceCard
              title={servicio.titulo}
              subtitle={servicio.categoria}
              description={servicio.descripcion}
              Icon={servicio.icon}
              destacado={servicio.destacado}
              onClick={() => handleWhatsAppClick(servicio.titulo)}
            />
          </motion.div>
        ))}
      </section>

      {/* Ver más */}
      {visibleCount < totalFiltrado && (
        <div className="text-center mt-10">
          <Button
            onClick={loadMore}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl shadow-sm transition"
          >
            Ver más servicios
          </Button>
        </div>
      )}

      {/* SEO */}
      <section className="mt-14 max-w-4xl mx-auto text-center lg:text-left">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          ¿Por qué contratar los servicios académicos de StudyDocu?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
          En StudyDocu apoyamos a estudiantes de la UTPL y diversas universidades del Ecuador con un
          enfoque responsable y orientado al aprendizaje. Nuestros servicios optimizan tu tiempo y
          mejoran tu rendimiento académico.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700 dark:text-gray-200">
          <li>✅ Ensayos académicos en formato APA con fuentes confiables.</li>
          <li>✅ Acompañamiento en exámenes bimestrales, quices y complexivos.</li>
          <li>✅ Manejo experto de plataformas universitarias (incluida UTPL).</li>
          <li>✅ Mapas conceptuales y presentaciones profesionales para tus clases.</li>
          <li>✅ Explicaciones paso a paso para tareas y proyectos.</li>
          <li>✅ Asesorías en vivo por Zoom o videollamada.</li>
        </ul>
      </section>

      {/* CTA final */}
      <div className="mt-14 text-center">
        <Button
          onClick={() => handleWhatsAppClick()}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-lg px-10 py-4 rounded-2xl shadow-xl transition duration-300"
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
