'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  Target,
  Upload,
  WandSparkles,
} from 'lucide-react'

import { useUserContext } from '@/context/UserContext'

const BRAND = {
  url: 'https://www.studydocu.ec/',
  logo: 'https://www.studydocu.ec/logo.png',
  description:
    'StudyDocu es una plataforma académica con IA para organizar, comprender y compartir documentos universitarios en Ecuador.',
}

const demoTabs = [
  { id: 'documento', label: 'Documento', icon: FileText },
  { id: 'resumen', label: 'Resumen IA', icon: WandSparkles },
  { id: 'preguntas', label: 'Preguntas', icon: BrainCircuit },
  { id: 'plan', label: 'Plan', icon: CalendarDays },
] as const

type DemoTab = (typeof demoTabs)[number]['id']

const demoContent: Record<
  DemoTab,
  { eyebrow: string; title: string; items: string[]; action: string }
> = {
  documento: {
    eyebrow: 'Macroeconomía · Unidad 6.pdf',
    title: 'Tu material entra organizado desde el inicio.',
    items: [
      'Universidad y carrera identificadas',
      'Materia: Macroeconomía',
      'Documento listo para analizar con IA',
    ],
    action: 'Analizar documento',
  },
  resumen: {
    eyebrow: 'Macroeconomía · Unidad 6',
    title: 'Lo esencial de tu documento, en segundos.',
    items: [
      'El IPC mide la variación del costo de una canasta representativa.',
      'La inflación compara el nivel general de precios entre periodos.',
      'El deflactor del PIB refleja precios de la producción nacional.',
    ],
    action: 'Generar preguntas de práctica',
  },
  preguntas: {
    eyebrow: 'Práctica generada con IA',
    title: 'Comprueba lo que entendiste antes del examen.',
    items: [
      '¿Qué diferencia existe entre IPC e inflación?',
      '¿Cómo se interpreta el deflactor del PIB?',
      'Explica dos posibles sesgos de medición',
    ],
    action: 'Responder práctica',
  },
  plan: {
    eyebrow: 'Esta semana',
    title: 'Avanza con prioridades claras.',
    items: [
      'Lunes · Repasar Unidad 6',
      'Miércoles · Resolver preguntas de práctica',
      'Viernes · Preparar evaluación',
    ],
    action: 'Ver calendario',
  },
}

const personas = [
  {
    id: 'estudiante',
    label: 'Soy estudiante',
    icon: BookOpen,
    eyebrow: 'Organiza, comprende y estudia mejor',
    title: 'Convierte tus apuntes en una ruta clara.',
    description:
      'Sube documentos, obtén resúmenes con IA y organiza cada materia desde un solo lugar.',
    cta: 'Empezar gratis',
    href: '/registrarse',
    demo: 'resumen' as DemoTab,
  },
  {
    id: 'aspirante',
    label: 'Preparo un examen',
    icon: Target,
    eyebrow: 'Preparación académica con dirección',
    title: 'Llega a tu examen con práctica y seguridad.',
    description:
      'Refuerza áreas clave, practica con preguntas y conoce nuestros planes de preparación.',
    cta: 'Preparar mi examen',
    href: '/examen-admision-universidad',
    demo: 'preguntas' as DemoTab,
  },
  {
    id: 'tesista',
    label: 'Desarrollo mi tesis',
    icon: GraduationCap,
    eyebrow: 'Acompañamiento para tu investigación',
    title: 'Transforma una idea en un proyecto bien estructurado.',
    description:
      'Organiza fuentes, metodología y próximos pasos con orientación académica personalizada.',
    cta: 'Explorar ayuda en tesis',
    href: '/tesis-pregrado',
    demo: 'plan' as DemoTab,
  },
] as const

type PersonaId = (typeof personas)[number]['id']

const benefits = [
  {
    icon: Upload,
    title: 'Sube tus documentos',
    text: 'Centraliza apuntes, guías y trabajos en una biblioteca fácil de consultar.',
  },
  {
    icon: BrainCircuit,
    title: 'Comprende con IA',
    text: 'Obtén resúmenes y apoyo para transformar lectura extensa en estudio útil.',
  },
  {
    icon: Target,
    title: 'Estudia con dirección',
    text: 'Organiza materias, fechas y próximos pasos sin perder el foco.',
  },
]

const services = [
  {
    icon: GraduationCap,
    label: 'Nuevo servicio',
    title: 'Examen de admisión universitaria',
    text: 'Diagnóstico, preparación por áreas y simulacros para tu prueba de ingreso.',
    href: '/examen-admision-universidad',
    color: 'from-blue-600 to-cyan-500',
  },
  {
    icon: BookOpen,
    label: 'Acompañamiento',
    title: 'Servicios académicos',
    text: 'Asesorías, preparación para exámenes y apoyo académico según tu necesidad.',
    href: '/servicios',
    color: 'from-violet-600 to-fuchsia-500',
  },
  {
    icon: Search,
    label: 'Biblioteca',
    title: 'Explora documentos',
    text: 'Encuentra materiales organizados por universidad, carrera y asignatura.',
    href: '/explorar',
    color: 'from-slate-700 to-slate-950',
  },
]

export default function HomeClient() {
  const [activeDemo, setActiveDemo] = useState<DemoTab>('resumen')
  const [activePersona, setActivePersona] = useState<PersonaId>('estudiante')
  const { user } = useUserContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const code = searchParams?.get('code')
    if (!code) return
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (!params.get('next')) params.set('next', '/dashboard')
    window.location.replace(`/auth/callback?${params.toString()}`)
  }, [searchParams])

  const schemaGraph = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BRAND.url}#organization`,
          name: 'StudyDocu',
          url: BRAND.url,
          logo: BRAND.logo,
          description: BRAND.description,
        },
        {
          '@type': 'WebSite',
          '@id': `${BRAND.url}#website`,
          url: BRAND.url,
          name: 'StudyDocu',
          publisher: { '@id': `${BRAND.url}#organization` },
          inLanguage: 'es-EC',
        },
      ],
    }),
    []
  )

  const start = () => router.push(user ? '/dashboard' : '/registrarse')
  const currentDemo = demoContent[activeDemo]
  const currentPersona = personas.find((persona) => persona.id === activePersona) ?? personas[0]
  const selectPersona = (persona: (typeof personas)[number]) => {
    setActivePersona(persona.id)
    setActiveDemo(persona.demo)
  }
  const startPersonaJourney = () => {
    if (activePersona === 'estudiante' && user) {
      router.push('/dashboard')
      return
    }
    router.push(currentPersona.href)
  }
  const advanceDemo = () => {
    const currentIndex = demoTabs.findIndex((tab) => tab.id === activeDemo)
    const nextTab = demoTabs[(currentIndex + 1) % demoTabs.length]
    setActiveDemo(nextTab.id)
  }
  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }

  return (
    <>
      <Script
        id="studydocu-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <main className="overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#070709] dark:text-white">
        <section className="relative px-5 pb-14 pt-28 sm:px-8 lg:pb-16 lg:pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(59,130,246,.22),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(139,92,246,.18),transparent_28%),radial-gradient(circle_at_60%_82%,rgba(34,211,238,.10),transparent_28%)] dark:opacity-70" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="max-w-2xl text-center lg:text-left"
            >
              <div
                role="tablist"
                aria-label="Elige tu objetivo académico"
                className="mx-auto flex max-w-max gap-1 rounded-2xl border border-black/[.07] bg-white/65 p-1.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[.07] lg:mx-0"
              >
                {personas.map((persona) => {
                  const Icon = persona.icon
                  const active = activePersona === persona.id
                  return (
                    <button
                      key={persona.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => selectPersona(persona)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${active ? 'bg-white text-blue-700 shadow-sm dark:bg-white dark:text-black' : 'text-[#6e6e73] hover:text-[#1d1d1f] dark:text-zinc-400 dark:hover:text-white'}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{persona.label}</span>
                      <span className="sm:hidden">{persona.label.split(' ').at(-1)}</span>
                    </button>
                  )
                })}
              </div>
              <motion.div
                key={activePersona}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-300">
                  {currentPersona.eyebrow}
                </p>
                <h1 className="mt-3 text-5xl font-semibold leading-[.96] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
                  {currentPersona.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-[#6e6e73] dark:text-zinc-300 sm:text-xl">
                  {currentPersona.description}
                </p>
              </motion.div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
                <button
                  onClick={startPersonaJourney}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-[#0077ed]"
                >
                  {currentPersona.cta}{' '}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                <Link
                  href={activePersona === 'estudiante' ? '/explorar' : '/servicios'}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/65 px-7 font-semibold text-[#1d1d1f] backdrop-blur-xl transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  {activePersona === 'estudiante' ? 'Explorar documentos' : 'Ver servicios'}
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-[#6e6e73] dark:text-zinc-400 lg:justify-start">
                {['Sin tarjeta', 'Registro rápido', 'Control de tus documentos'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="relative min-w-0"
            >
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-blue-400/20 via-violet-400/20 to-cyan-400/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-black/[.08] bg-white/85 p-2 shadow-[0_32px_90px_-35px_rgba(30,64,175,.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#151518]/90 sm:p-3">
                <div className="flex items-center justify-between px-4 py-3 sm:px-5">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="hidden items-center gap-2 text-xs font-medium text-[#6e6e73] sm:flex">
                    <LockKeyhole className="h-3.5 w-3.5" /> Espacio de estudio privado
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    En línea
                  </span>
                </div>
                <div className="rounded-[1.5rem] border border-black/[.06] bg-[#f5f5f7] p-4 dark:border-white/[.07] dark:bg-[#0d0d0f] sm:p-5">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#86868b]">
                      Transformación en vivo
                    </p>
                    <span className="text-xs text-[#86868b]">
                      {demoTabs.findIndex((tab) => tab.id === activeDemo) + 1} / {demoTabs.length}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {demoTabs.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveDemo(id)}
                        className={`flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${activeDemo === id ? 'bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-300' : 'text-[#6e6e73] hover:bg-white/60 dark:text-zinc-400 dark:hover:bg-white/5'}`}
                      >
                        <Icon className="h-5 w-5" /> {label}
                      </button>
                    ))}
                  </div>
                  <motion.div
                    key={activeDemo}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 min-h-[330px] rounded-2xl bg-white p-5 shadow-sm dark:bg-[#19191c] sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">
                          {currentDemo.eyebrow}
                        </p>
                        <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                          {currentDemo.title}
                        </h2>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                        Vista interactiva
                      </span>
                    </div>
                    <div className="mt-7 space-y-3">
                      {currentDemo.items.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-xl border border-black/[.06] bg-[#fafafa] p-4 dark:border-white/[.07] dark:bg-white/[.035]"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <p className="pt-0.5 text-sm leading-6 text-[#424245] dark:text-zinc-300">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={advanceDemo}
                        className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
                      >
                        {currentDemo.action} <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 dark:bg-[#0d0d0f] sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              {...reveal}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-sm font-semibold text-blue-600">
                Diseñado alrededor de tu forma de estudiar
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Menos ruido. Más comprensión.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#6e6e73] dark:text-zinc-400">
                StudyDocu reúne las herramientas esenciales en un flujo sencillo, desde el primer
                archivo hasta el día de tu evaluación.
              </p>
            </motion.div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }, index) => (
                <motion.article
                  key={title}
                  {...reveal}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group rounded-[1.75rem] bg-[#f5f5f7] p-7 transition hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.055] sm:p-8"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-7 text-[#6e6e73] dark:text-zinc-400">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-violet-600">Más formas de avanzar</p>
                <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                  La ayuda correcta, cuando la necesitas.
                </h2>
              </div>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
              >
                Ver todos los servicios <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {services.map(({ icon: Icon, label, title, text, href, color }, index) => (
                <motion.div
                  key={title}
                  {...reveal}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href={href}
                    className="group flex h-full min-h-[300px] flex-col overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.06] sm:p-8"
                  >
                    <div
                      className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="mt-8 text-sm font-semibold text-blue-600 dark:text-blue-300">
                      {label}
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h3>
                    <p className="mt-4 leading-7 text-[#6e6e73] dark:text-zinc-400">{text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-blue-600">
                      Conocer más{' '}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1d1d1f] px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                <ShieldCheck className="h-5 w-5" /> Privacidad y control
              </div>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Tus documentos son parte de tu historia académica. Trátalos así.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                Organiza tu contenido desde una cuenta personal y decide qué subir, consultar o
                compartir.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Acceso desde tu cuenta',
                'Organización privada por materias',
                'Control sobre tus archivos',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[.07] p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 text-center dark:bg-[#0d0d0f] sm:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold text-blue-600">Empieza hoy</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Tu próxima sesión de estudio puede sentirse diferente.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6e6e73] dark:text-zinc-400">
              Crea tu cuenta, encuentra documentos de tu carrera y descubre una forma más clara de
              avanzar.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={start}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 font-semibold text-white hover:bg-[#0077ed]"
              >
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20conocer%20m%C3%A1s%20sobre%20la%20plataforma."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 px-7 font-semibold dark:border-white/15"
              >
                <MessageCircle className="h-4 w-4" /> Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
