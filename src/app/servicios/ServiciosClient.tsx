// src/app/servicios/ServiciosClient.tsx
'use client'

import Link from 'next/link'
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

  /** ✅ NUEVO: si existe, el botón navega a esta página */
  href?: string
  /** ✅ NUEVO: texto del botón cuando tiene href */
  buttonText?: string

  /** ✅ NUEVO: link secundario (ej: Validación aparte) */
  secondaryHref?: string
  secondaryText?: string
}

/* ---------------- WhatsApp ---------------- */
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

  /* =======================
     ✅ EXÁMENES (ENLAZADOS)
     ======================= */

  {
    titulo: '🧠 Exámenes bimestrales y de recuperación',
    categoria: 'Exámenes',
    descripcion: 'Acompañamiento en parciales, bimestrales, quices y recuperaciones.',
    destacado: true,
    icon: iconByCategoria.Exámenes,
    href: '/examenes-bimestrales',
    buttonText: 'Ver detalles',
  },
  {
    titulo: '🧪 Exámenes complexivos y de validación',
    categoria: 'Exámenes',
    descripcion: 'Preparación intensiva con repaso por áreas, simulacros y guía paso a paso.',
    icon: iconByCategoria.Exámenes,
    href: '/examen-complexivo',
    buttonText: 'Ver complexivo',
    secondaryHref: '/examenes-validacion',
    secondaryText: 'Ver validación',
  },
  {
    titulo: '📝 Asistencia en quices y exámenes online',
    categoria: 'Exámenes',
    descripcion: 'Soporte en evaluaciones online con enfoque práctico y claridad.',
    icon: iconByCategoria.Exámenes,
    href: '/examenes-bimestrales',
    buttonText: 'Ver detalles',
  },

  /* =======================
     OTROS SERVICIOS
     ======================= */

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

/**
 * 🔥 OTROS SERVICIOS (TESIS)
 * ✅ enlaza a /tesis-pregrado (página pilar)
 */
const otrosServicios = [
  {
    titulo: 'TESIS PREGRADO',
    descripcion:
      'Estructura, planteamiento del problema, marco teórico, metodología, análisis y formato.',
    icon: GraduationCap,
    href: '/tesis-pregrado#pregrado',
  },
  {
    titulo: 'TESIS POSGRADO',
    descripcion:
      'Asesoría avanzada, redacción académica, matrices, análisis y normas de publicación.',
    icon: BadgeCheck,
    href: '/tesis-pregrado#maestria',
  },
  {
    titulo: 'TESIS DOCTORADO',
    descripcion:
      'Acompañamiento riguroso: estado del arte, diseño metodológico, análisis y publicación.',
    icon: FileText,
    href: '/tesis-pregrado#doctorado',
  },
] as const

function Badge({
  children,
  variant = 'premium',
}: {
  children: string
  variant?: 'premium' | 'destacado'
}) {
  const cls =
    variant === 'destacado'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/20'
      : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:border-indigo-500/20'

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
  href,
  buttonText = 'Solicitar asesoría',
  secondaryHref,
  secondaryText,
}: {
  title: string
  subtitle: string
  description: string
  Icon: LucideIcon
  destacado?: boolean
  href?: string
  buttonText?: string
  secondaryHref?: string
  secondaryText?: string
}) {
  const waUrl = buildWhatsAppUrl(title)

  return (
    <Card
      className={[
        'group relative rounded-2xl border bg-white/85 dark:bg-slate-900/65 backdrop-blur',
        'border-slate-200/80 dark:border-slate-700/70',
        'shadow-[0_10px_28px_-20px_rgba(2,6,23,0.35)] hover:shadow-[0_18px_55px_-32px_rgba(2,6,23,0.55)]',
        'transition-all',
        destacado
          ? 'ring-1 ring-indigo-400/35 dark:ring-indigo-500/35'
          : 'hover:border-slate-300/80 dark:hover:border-slate-600/70',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-x-0 top-0 h-[2px] rounded-t-2xl',
          destacado
            ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400'
            : 'bg-gradient-to-r from-transparent via-slate-200/70 to-transparent dark:via-slate-700/60',
        ].join(' ')}
      />

      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={[
                'h-10 w-10 rounded-xl flex items-center justify-center',
                'bg-indigo-600/10 dark:bg-indigo-400/10',
                'ring-1 ring-indigo-600/10 dark:ring-indigo-400/10',
                'transition-transform duration-300 group-hover:scale-[1.03]',
              ].join(' ')}
            >
              <Icon className="text-indigo-700 dark:text-indigo-200" size={20} />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-indigo-700/90 dark:text-indigo-200/90">
                {subtitle}
              </p>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="premium">Premium</Badge>
            {destacado ? <Badge variant="destacado">Más solicitado</Badge> : null}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>

        <div className="pt-1">
          <Button
            asChild
            className={[
              'w-full rounded-xl text-white',
              'bg-gradient-to-r from-indigo-600 to-violet-600',
              'hover:from-indigo-700 hover:to-violet-700',
              'shadow-[0_14px_35px_-22px_rgba(99,102,241,0.65)]',
            ].join(' ')}
          >
            {href ? (
              <Link href={href}>
                {buttonText} <ArrowRight size={16} className="ml-2" />
              </Link>
            ) : (
              <Link href={waUrl} target="_blank" rel="noopener noreferrer">
                {buttonText} <ArrowRight size={16} className="ml-2" />
              </Link>
            )}
          </Button>

          {/* ✅ link secundario opcional */}
          {secondaryHref && secondaryText ? (
            <div className="mt-2 text-center">
              <Link
                href={secondaryHref}
                className="text-[12px] font-medium text-indigo-700 hover:text-indigo-800 dark:text-indigo-200 dark:hover:text-indigo-100 underline underline-offset-4"
              >
                {secondaryText}
              </Link>
            </div>
          ) : null}

          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Respuesta rápida por WhatsApp • Enfoque en aprobación y aprendizaje
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ServiciosClient() {
  const [visibleCount, setVisibleCount] = useState(9)
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

  const waGeneral = buildWhatsAppUrl()
  const waTesis = buildWhatsAppUrl('Tesis (Pregrado / Posgrado / Doctorado)')

  const goWhatsApp = (url: string) => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:pt-28 lg:pt-32 lg:pb-16">
      {/* Hero */}
      <motion.section
        className="mb-12 grid items-center gap-8 lg:mb-16 lg:grid-cols-[1.7fr,1.1fr]"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 justify-center lg:justify-start mb-3">
            <Sparkles className="text-indigo-600" size={22} />
            <span className="text-indigo-700 dark:text-indigo-200 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Servicios académicos StudyDocu
            </span>
          </div>

          <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            Servicios académicos profesionales
            <span className="block text-indigo-700 dark:text-indigo-200">
              para estudiantes universitarios
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base lg:mx-0">
            Te acompañamos en todo tu ciclo académico: ensayos, exámenes, plataformas
            universitarias, resúmenes, normas APA y asesorías personalizadas. Enfoque fuerte para
            UTPL y universidades de Ecuador.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-300" size={18} />
              <span>Calidad académica verificada</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <Clock className="text-indigo-600 dark:text-indigo-300" size={18} />
              <span>Respuestas rápidas</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <GraduationCap className="text-amber-600 dark:text-amber-300" size={18} />
              <span>Enfoque en aprobación y aprendizaje</span>
            </div>
          </div>
        </div>

        <Card className="border border-slate-200/60 dark:border-slate-700/60 shadow-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 text-white relative overflow-hidden rounded-2xl">
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
              asChild
              size="lg"
              className="mt-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              <Link
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.success('Redirigiendo a WhatsApp...')}
              >
                📲 Hablar con un asesor
              </Link>
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
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Nuevo
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              OTROS SERVICIOS
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Acompañamiento de alto nivel para trabajos de titulación y proyectos de investigación.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-700"
            onClick={() => goWhatsApp(waTesis)}
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
                href={item.href}
                buttonText="Ver detalles"
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Filtro */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-indigo-600" />
          <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Filtrar por tipo de servicio
          </span>
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
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
                  setVisibleCount(9)
                }}
                className={[
                  'px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm'
                    : 'bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid servicios */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              href={servicio.href}
              buttonText={
                servicio.buttonText ?? (servicio.href ? 'Ver detalles' : 'Solicitar asesoría')
              }
              secondaryHref={servicio.secondaryHref}
              secondaryText={servicio.secondaryText}
            />
          </motion.div>
        ))}
      </section>

      {/* Ver más */}
      {visibleCount < totalFiltrado && (
        <div className="text-center mt-10">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-6 py-3 rounded-xl shadow-sm transition"
          >
            Ver más servicios
          </Button>
        </div>
      )}

      {/* SEO */}
      <section className="mt-14 max-w-4xl mx-auto text-center lg:text-left">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          ¿Por qué contratar los servicios académicos de StudyDocu?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          En StudyDocu apoyamos a estudiantes de la UTPL y diversas universidades del Ecuador con un
          enfoque responsable y orientado al aprendizaje. Nuestros servicios optimizan tu tiempo y
          mejoran tu rendimiento académico.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 dark:text-slate-200">
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
          asChild
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-lg px-10 py-4 rounded-2xl shadow-xl transition duration-300"
        >
          <Link
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success('Redirigiendo a WhatsApp...')}
          >
            📲 Solicitar servicio por WhatsApp
          </Link>
        </Button>
        <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Respuesta rápida. Cuéntanos qué necesitas y te ofrecemos la mejor opción académica.
        </p>
      </div>
    </main>
  )
}
