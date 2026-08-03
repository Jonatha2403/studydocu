'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  Laptop,
  MessageCircle,
  MonitorPlay,
  Palette,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react'

type Category = 'Todos' | 'Exámenes' | 'Tesis' | 'Escritura' | 'Plataformas' | 'Diseño'

type SpecialistRoute = {
  title: string
  description: string
  href: string
  category: Exclude<Category, 'Todos'>
  icon: LucideIcon
  accent: string
  featured?: boolean
}

type SupportService = {
  slug: string
  title: string
  description: string
  category: Exclude<Category, 'Todos' | 'Tesis'>
  icon: LucideIcon
}

const WHATSAPP_NUMBER = '593958757302'

const whatsappUrl = (service?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    service
      ? `Hola StudyDocu, deseo información sobre el servicio: ${service}.`
      : 'Hola StudyDocu, necesito orientación para elegir un servicio académico.'
  )}`

const categories: Category[] = ['Todos', 'Exámenes', 'Tesis', 'Escritura', 'Plataformas', 'Diseño']

const specialistRoutes: SpecialistRoute[] = [
  {
    title: 'Examen de admisión universitaria',
    description: 'Diagnóstico, preparación por áreas y simulacros para tu prueba de ingreso.',
    href: '/examen-admision-universidad',
    category: 'Exámenes',
    icon: GraduationCap,
    accent: 'from-blue-600 to-cyan-500',
    featured: true,
  },
  {
    title: 'Exámenes bimestrales',
    description: 'Repaso organizado, ejercicios guiados y preparación para evaluaciones.',
    href: '/examenes-bimestrales',
    category: 'Exámenes',
    icon: CheckCircle2,
    accent: 'from-indigo-600 to-blue-500',
  },
  {
    title: 'Examen complexivo',
    description: 'Preparación estratégica por áreas, simulacros y orientación académica.',
    href: '/examen-complexivo',
    category: 'Exámenes',
    icon: BrainCircuit,
    accent: 'from-violet-600 to-indigo-500',
  },
  {
    title: 'Exámenes de validación',
    description: 'Ruta de preparación adaptada a tu evaluación y necesidades de refuerzo.',
    href: '/examenes-validacion',
    category: 'Exámenes',
    icon: Target,
    accent: 'from-fuchsia-600 to-violet-500',
  },
  {
    title: 'Tesis de pregrado',
    description: 'Orientación desde el planteamiento hasta la revisión del documento final.',
    href: '/tesis-pregrado',
    category: 'Tesis',
    icon: FileText,
    accent: 'from-emerald-600 to-teal-500',
    featured: true,
  },
  {
    title: 'Tesis de maestría',
    description: 'Acompañamiento metodológico y académico para proyectos de posgrado.',
    href: '/tesis-maestria',
    category: 'Tesis',
    icon: BadgeCheck,
    accent: 'from-teal-600 to-cyan-500',
  },
  {
    title: 'Tesis doctoral',
    description: 'Orientación rigurosa en metodología, análisis y comunicación científica.',
    href: '/tesis-doctorado',
    category: 'Tesis',
    icon: BookOpen,
    accent: 'from-slate-700 to-slate-950',
  },
  {
    title: 'Tesis UTPL',
    description: 'Acompañamiento enfocado en procesos, estructura y requerimientos UTPL.',
    href: '/tesis-utpl',
    category: 'Tesis',
    icon: GraduationCap,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Ayuda en tesis Ecuador',
    description: 'Guía para organizar, corregir y avanzar tu proyecto de investigación.',
    href: '/ayuda-en-tesis-ecuador',
    category: 'Tesis',
    icon: FileCheck2,
    accent: 'from-green-600 to-emerald-500',
  },
  {
    title: 'Tareas UTPL',
    description: 'Orientación y recursos para organizar actividades académicas de la UTPL.',
    href: '/tareas-utpl',
    category: 'Plataformas',
    icon: Laptop,
    accent: 'from-blue-700 to-indigo-600',
  },
]

const supportServices: SupportService[] = [
  {
    slug: 'ensayos-academicos',
    title: 'Ensayos académicos',
    description: 'Estructura, argumentación, citas y referencias con orientación académica.',
    category: 'Escritura',
    icon: FileText,
  },
  {
    slug: 'resumenes-academicos',
    title: 'Resúmenes académicos',
    description: 'Síntesis claras de textos, libros, clases o documentos extensos.',
    category: 'Escritura',
    icon: BookOpen,
  },
  {
    slug: 'normas-apa',
    title: 'Revisión de normas APA',
    description: 'Corrección de formato, citas y referencias bibliográficas.',
    category: 'Escritura',
    icon: FileCheck2,
  },
  {
    slug: 'orientacion-tareas-universitarias',
    title: 'Orientación para tareas',
    description: 'Explicación paso a paso para comprender y resolver actividades.',
    category: 'Escritura',
    icon: CheckCircle2,
  },
  {
    slug: 'programacion-python-universidad',
    title: 'Programación Python',
    description: 'Apoyo en lógica, ejercicios y fundamentos de programación.',
    category: 'Plataformas',
    icon: Laptop,
  },
  {
    slug: 'plataformas-universitarias',
    title: 'Plataformas universitarias',
    description: 'Orientación para actividades virtuales y organización de entregas.',
    category: 'Plataformas',
    icon: MonitorPlay,
  },
  {
    slug: 'asesorias-academicas-online',
    title: 'Asesorías por videollamada',
    description: 'Sesiones privadas para resolver dudas académicas específicas.',
    category: 'Plataformas',
    icon: MessageCircle,
  },
  {
    slug: 'mapas-conceptuales',
    title: 'Mapas conceptuales',
    description: 'Información organizada visualmente para estudiar o exponer.',
    category: 'Diseño',
    icon: Palette,
  },
  {
    slug: 'presentaciones-universitarias',
    title: 'Presentaciones profesionales',
    description: 'Diapositivas claras, ordenadas y listas para una exposición.',
    category: 'Diseño',
    icon: Presentation,
  },
]

const matches = (title: string, description: string, search: string) => {
  const term = search.trim().toLocaleLowerCase('es')
  return !term || `${title} ${description}`.toLocaleLowerCase('es').includes(term)
}

export default function ServiciosClient() {
  const [category, setCategory] = useState<Category>('Todos')
  const [search, setSearch] = useState('')
  const reduceMotion = useReducedMotion()

  const filteredRoutes = useMemo(
    () =>
      specialistRoutes.filter(
        (service) =>
          (category === 'Todos' || service.category === category) &&
          matches(service.title, service.description, search)
      ),
    [category, search]
  )

  const filteredSupport = useMemo(
    () =>
      supportServices.filter(
        (service) =>
          (category === 'Todos' || service.category === category) &&
          matches(service.title, service.description, search)
      ),
    [category, search]
  )

  const resultCount = filteredRoutes.length + filteredSupport.length
  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 } }

  const resetFilters = () => {
    setCategory('Todos')
    setSearch('')
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#09090b] dark:text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,.2),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(139,92,246,.16),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav
            aria-label="Migas de pan"
            className="flex items-center gap-2 text-sm text-[#6e6e73] dark:text-zinc-400"
          >
            <Link href="/" className="hover:text-[#1d1d1f] dark:hover:text-white">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-[#1d1d1f] dark:text-white">Servicios</span>
          </nav>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid gap-10 lg:grid-cols-[1fr_.68fr] lg:items-end"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[.07] bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[.07]">
                <Sparkles className="h-4 w-4 text-blue-600" /> Acompañamiento académico
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Encuentra la ayuda adecuada.{' '}
                <span className="text-[#6e6e73] dark:text-zinc-400">Sin perder tiempo.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] dark:text-zinc-300">
                Explora todas las rutas de preparación y servicios de StudyDocu. Filtra por área o
                busca exactamente lo que necesitas.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-black/[.07] bg-white/75 p-6 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/[.06]">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold">¿No sabes cuál elegir?</p>
                  <p className="mt-1 text-sm leading-6 text-[#6e6e73] dark:text-zinc-400">
                    Cuéntanos tu objetivo y te indicaremos la opción adecuada.
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 font-semibold text-white transition hover:bg-[#0077ed]"
              >
                <MessageCircle className="h-5 w-5" /> Recibir orientación
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-y border-black/[.06] bg-[#f5f5f7]/85 px-5 py-4 backdrop-blur-2xl dark:border-white/[.08] dark:bg-[#09090b]/85 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#86868b]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar examen, tesis, APA, presentación..."
              className="h-12 w-full rounded-2xl border border-black/[.07] bg-white pl-12 pr-11 text-sm outline-none transition placeholder:text-[#86868b] focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[.07]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-black/[.06] dark:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <Filter className="h-4 w-4 shrink-0 text-[#86868b]" />
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${category === item ? 'bg-[#1d1d1f] text-white shadow-sm dark:bg-white dark:text-black' : 'border border-black/[.07] bg-white/70 text-[#424245] hover:bg-white dark:border-white/10 dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/10'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">Páginas especializadas</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Preparación y orientación en profundidad
              </h2>
              <p className="mt-3 max-w-2xl text-[#6e6e73] dark:text-zinc-400">
                Cada ruta tiene información completa sobre el proceso, lo que incluye y cómo
                solicitar ayuda.
              </p>
            </div>
            <span className="text-sm text-[#6e6e73] dark:text-zinc-400">
              {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {filteredRoutes.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRoutes.map(
                (
                  {
                    title,
                    description,
                    href,
                    category: serviceCategory,
                    icon: Icon,
                    accent,
                    featured,
                  },
                  index
                ) => (
                  <motion.article
                    key={href}
                    {...reveal}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.035 }}
                  >
                    <Link
                      href={href}
                      className="group flex h-full min-h-[315px] flex-col overflow-hidden rounded-[1.75rem] border border-black/[.06] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/[.08] dark:bg-white/[.055]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        {featured && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-[#86868b]">
                        {serviceCategory}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h3>
                      <p className="mt-3 leading-7 text-[#6e6e73] dark:text-zinc-400">
                        {description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-7 font-semibold text-blue-600">
                        Ver página{' '}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.article>
                )
              )}
            </div>
          )}

          {filteredSupport.length > 0 && (
            <div className="mt-20">
              <p className="text-sm font-semibold text-violet-600">Catálogo de apoyo</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Servicios para necesidades específicas
              </h2>
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSupport.map(
                  ({ slug, title, description, category: serviceCategory, icon: Icon }, index) => (
                    <motion.article
                      key={title}
                      {...reveal}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      className="flex flex-col rounded-2xl border border-black/[.06] bg-white p-6 dark:border-white/[.08] dark:bg-white/[.055]"
                    >
                      <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
                            {serviceCategory}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                        </div>
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-6 text-[#6e6e73] dark:text-zinc-400">
                        {description}
                      </p>
                      <Link
                        href={`/servicios/${slug}`}
                        className="mt-5 inline-flex items-center justify-between rounded-xl bg-[#f5f5f7] px-4 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 dark:bg-white/[.06] dark:hover:bg-blue-400/10 dark:hover:text-blue-300"
                      >
                        Ver información <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.article>
                  )
                )}
              </div>
            </div>
          )}

          {resultCount === 0 && (
            <div className="mt-10 rounded-[1.75rem] border border-dashed border-black/15 bg-white/60 px-6 py-16 text-center dark:border-white/15 dark:bg-white/[.04]">
              <Search className="mx-auto h-9 w-9 text-[#86868b]" />
              <h2 className="mt-4 text-2xl font-semibold">No encontramos ese servicio</h2>
              <p className="mt-2 text-[#6e6e73] dark:text-zinc-400">
                Prueba con otra palabra o vuelve a mostrar todas las opciones.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-5 py-20 dark:bg-[#0d0d0f] sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.75fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Proceso claro</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Cuéntanos tu meta. Organizamos el siguiente paso.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#6e6e73] dark:text-zinc-400">
              La orientación inicial permite entender tu universidad, fecha, materia y alcance antes
              de recomendarte una opción.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'Describe lo que necesitas',
              'Recibe una orientación inicial',
              'Elige una ruta de trabajo clara',
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl bg-[#f5f5f7] p-4 dark:bg-white/[.06]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 overflow-hidden rounded-[2rem] bg-[#1d1d1f] px-7 py-12 text-center text-white shadow-xl sm:px-12 lg:flex-row lg:text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Check className="h-4 w-4" /> Orientación sin compromiso
            </div>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              ¿Aún no encuentras exactamente lo que buscas?
            </h2>
            <p className="mt-3 text-zinc-300">
              Escríbenos y revisaremos tu caso de forma personalizada.
            </p>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-zinc-100 sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" /> Hablar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}
