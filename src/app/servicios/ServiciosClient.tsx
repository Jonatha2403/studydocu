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
      <section className="relative overflow-hidden bg-[#06142f] px-5 pb-14 pt-28 text-white sm:px-8 lg:pb-16 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(37,99,235,.45),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(139,92,246,.30),transparent_30%),radial-gradient(circle_at_68%_88%,rgba(6,182,212,.20),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-14">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-200 lg:justify-start">
              <Sparkles className="h-4 w-4 text-amber-300" /> Soluciones académicas para estudiantes
              en Ecuador
            </p>
            <h1 className="mt-5 text-center text-5xl font-semibold leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-left lg:text-7xl">
              Servicios académicos para{' '}
              <span className="bg-gradient-to-r from-blue-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                avanzar con seguridad.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-blue-100/80 lg:mx-0 lg:text-left">
              Preparación para exámenes de admisión, asesoría de tesis, ensayos académicos, normas
              APA y orientación universitaria en un solo lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#catalogo-servicios"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-[#06142f] shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Explorar servicios <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                <MessageCircle className="h-5 w-5" /> Recibir orientación
              </a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-blue-100/85 lg:justify-start">
              {['19 servicios disponibles', 'Atención personalizada', 'Enfoque responsable'].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative mx-auto h-[390px] w-full max-w-[540px] sm:h-[430px]"
            aria-label="Áreas de servicios académicos de StudyDocu"
          >
            <div className="absolute inset-[12%] rounded-full border border-white/10" />
            <div className="absolute inset-[24%] rounded-full border border-dashed border-blue-300/20" />
            <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-white/15 bg-white/10 text-center shadow-2xl backdrop-blur-2xl sm:h-44 sm:w-44">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-lg">
                  <GraduationCap className="h-7 w-7" />
                </span>
                <p className="mt-3 text-sm font-semibold text-blue-100">Tu objetivo</p>
                <p className="text-xl font-bold">Nuestra ruta</p>
              </div>
            </div>

            {[
              {
                label: 'Exámenes',
                text: 'Preparación',
                icon: Target,
                className: 'left-0 top-8',
                delay: 0,
              },
              {
                label: 'Tesis',
                text: 'Metodología',
                icon: FileText,
                className: 'right-0 top-16',
                delay: 0.3,
              },
              {
                label: 'Escritura',
                text: 'APA y ensayos',
                icon: BookOpen,
                className: 'bottom-8 left-2',
                delay: 0.6,
              },
              {
                label: 'Asesorías',
                text: 'Orientación',
                icon: MessageCircle,
                className: 'bottom-4 right-0',
                delay: 0.9,
              },
            ].map(({ label, text, icon: Icon, className, delay }) => (
              <motion.div
                key={label}
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute ${className} flex w-[145px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl backdrop-blur-xl sm:w-[165px]`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-blue-200/70">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="catalogo-servicios"
        className="sticky top-16 z-30 scroll-mt-24 border-y border-black/[.06] bg-[#f5f5f7]/90 px-5 py-4 backdrop-blur-2xl dark:border-white/[.08] dark:bg-[#09090b]/90 sm:px-8"
      >
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
