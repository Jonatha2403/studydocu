'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { toast } from 'sonner'
import { motion, useReducedMotion } from 'framer-motion'
import Lottie from 'lottie-react'

import HeroAI from '@/components/HeroAI'
import Footer from '@/components/Footer'
import { useUserContext } from '@/context/UserContext'
import confettiAnimation from '@/assets/lotties/confetti.json'
import { Button } from '@/components/ui/button'

import {
  CheckCircle2,
  LayoutDashboard,
  MessageSquare,
  Brain,
  CalendarDays,
  Goal,
  FileText,
  CreditCard,
  ShieldCheck,
  Eye,
  Gift,
  UserCheck,
  BookOpenCheck,
  Sparkles,
  ArrowRight,
  Wand2,
  Lock,
  MessageCircle,
} from 'lucide-react'

/* -----------------------------
   Dynamic (solo desktop)
------------------------------ */
const AnimatedServices = dynamic(() => import('@/components/AnimatedServices'), { ssr: false })
const AnimatedTestimonials = dynamic(() => import('@/components/AnimatedTestimonials'), {
  ssr: false,
})
const AnimatedAsesores = dynamic(() => import('@/components/AnimatedAsesores'), { ssr: false })

/* -----------------------------
   Datos
------------------------------ */
const featureItems = [
  { name: 'Tareas', icon: CheckCircle2, description: 'Organiza y gestiona tus pendientes.' },
  { name: 'Documentos', icon: FileText, description: 'Centraliza tus apuntes y trabajos.' },
  { name: 'Chat', icon: MessageSquare, description: 'Colabora en tiempo real con tu equipo.' },
  {
    name: 'IA Asistente',
    icon: Brain,
    description: 'Potencia tu estudio con respuestas inteligentes.',
  },
  {
    name: 'Calendario',
    icon: CalendarDays,
    description: 'Visualiza entregas, exámenes y plazos clave.',
  },
  { name: 'Metas', icon: Goal, description: 'Define objetivos y mide tu avance.' },
  {
    name: 'Suscripciones',
    icon: CreditCard,
    description: 'Accede a funciones premium sin complicaciones.',
  },
  {
    name: 'Dashboards',
    icon: LayoutDashboard,
    description: 'Monitorea tu progreso académico visualmente.',
  },
  {
    name: 'Asesores verificados',
    icon: UserCheck,
    description: 'Recibe apoyo de profesionales validados.',
  },
  { name: 'Referidos', icon: Gift, description: 'Invita amigos y gana recompensas exclusivas.' },
  {
    name: 'Blog educativo',
    icon: BookOpenCheck,
    description: 'Tips, guías y buenas prácticas de estudio.',
  },
  {
    name: 'Modo universidad segura',
    icon: ShieldCheck,
    description: 'Configurado según políticas institucionales.',
  },
]

const extraItems = [
  {
    name: 'Resumen automático',
    icon: Wand2,
    description: 'IA que resume tus documentos al subirlos.',
  },
  {
    name: 'Vista previa inteligente',
    icon: Eye,
    description: 'Explora el contenido sin abrir cada archivo.',
  },
  {
    name: 'Moderación automática',
    icon: ShieldCheck,
    description: 'IA que ayuda a revisar el contenido.',
  },
  {
    name: 'Sistema de recompensas',
    icon: Gift,
    description: 'Gana puntos y beneficios por participar.',
  },
]

// ✅ Schema config
const BRAND = {
  name: 'StudyDocu',
  url: 'https://www.studydocu.ec/',
  logo: 'https://www.studydocu.ec/logo.png',
  ogImage: 'https://www.studydocu.ec/og-image.jpg',
  description:
    'StudyDocu es una plataforma académica con IA para subir, organizar y resumir documentos universitarios, conectar con asesores verificados y mejorar el rendimiento de estudio en Ecuador.',
  foundingDate: '2024',
  phone: '+593958757302',
  sameAs: ['https://www.facebook.com/StudyDocu', 'https://www.instagram.com/studydocu1'],
}

/* -----------------------------
   Helpers UI (Enterprise Clean)
------------------------------ */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>{children}</section>
  )
}

function Badge({
  icon,
  label,
  tone = 'navy',
}: {
  icon: React.ReactNode
  label: string
  tone?: 'navy' | 'cyan' | 'emerald' | 'amber'
}) {
  const tones: Record<string, string> = {
    navy: 'bg-slate-100 text-slate-800 border border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200',
  }

  return (
    <div
      className={[
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'text-[11px] font-semibold uppercase tracking-[0.16em]',
        tones[tone],
      ].join(' ')}
    >
      {icon}
      {label}
    </div>
  )
}

function ProCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-3xl bg-white border border-slate-200/70 shadow-[0_10px_30px_-22px_rgba(2,6,23,0.25)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function MiniCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-2xl bg-white border border-slate-200/70 shadow-[0_8px_24px_-18px_rgba(2,6,23,0.22)]',
        'transition-transform md:hover:-translate-y-[1px] md:hover:shadow-[0_14px_30px_-18px_rgba(2,6,23,0.28)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * ✅ CountUp liviano: en móvil no anima
 */
function CountUp({
  to,
  suffix = '',
  durationMs = 1100,
  enabled = true,
}: {
  to: number
  suffix?: string
  durationMs?: number
  enabled?: boolean
}) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const from = 0

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, durationMs, enabled])

  return (
    <span className="tabular-nums">
      {val.toLocaleString('es-EC')}
      {suffix}
    </span>
  )
}

/* -----------------------------
   Component
------------------------------ */
export default function HomeClient() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [hideFloatingCTA, setHideFloatingCTA] = useState(false)

  const footerSentinelRef = useRef<HTMLDivElement | null>(null)

  const { user } = useUserContext()
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setShowFloatingCTA(y > 250)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = footerSentinelRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        setHideFloatingCTA(entries[0]?.isIntersecting ?? false)
      },
      { threshold: 0.01, rootMargin: isMobile ? '180px 0px 0px 0px' : '220px 0px 0px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [isMobile])

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', isDark)

    if (!localStorage.getItem('visited')) {
      toast.success('🎉 ¡Logro desbloqueado! Primer ingreso a StudyDocu')
      if (!isMobile && !reduceMotion) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4200)
      }
      localStorage.setItem('visited', 'true')
    }
  }, [isMobile, reduceMotion])

  const handleStart = () => router.push(user ? '/dashboard' : '/registrarse')

  const handleWhatsApp = () => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(
      'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20y%20sus%20servicios.',
      '_blank'
    )
  }

  const schemaGraph = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BRAND.url}#organization`,
          name: BRAND.name,
          url: BRAND.url,
          logo: { '@type': 'ImageObject', url: BRAND.logo, width: 512, height: 512 },
          image: BRAND.ogImage,
          description: BRAND.description,
          foundingDate: BRAND.foundingDate,
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              availableLanguage: ['es'],
              telephone: BRAND.phone,
            },
          ],
          sameAs: BRAND.sameAs,
        },
        {
          '@type': 'WebSite',
          '@id': `${BRAND.url}#website`,
          url: BRAND.url,
          name: BRAND.name,
          publisher: { '@id': `${BRAND.url}#organization` },
          inLanguage: 'es-EC',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BRAND.url}explorar?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${BRAND.url}#homepage`,
          url: BRAND.url,
          name: 'StudyDocu | Plataforma académica con IA',
          isPartOf: { '@id': `${BRAND.url}#website` },
          about: { '@id': `${BRAND.url}#organization` },
          inLanguage: 'es-EC',
        },
      ],
    }),
    []
  )

  const motionEnabled = !reduceMotion && !isMobile
  const fadeFrom = motionEnabled ? { opacity: 0, y: 14 } : undefined
  const fadeTo = motionEnabled ? { opacity: 1, y: 0 } : undefined
  const countEnabled = !isMobile && !reduceMotion

  return (
    <>
      <Script
        id="studydocu-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <main className="relative w-full min-h-screen flex flex-col items-center bg-background text-slate-900">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(800px_420px_at_18%_12%,rgba(37,99,235,0.10),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(780px_420px_at_85%_18%,rgba(6,182,212,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)/0.70),hsl(var(--background)))]" />
        </div>

        {showConfetti && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <Lottie
              animationData={confettiAnimation}
              loop={false}
              autoplay
              className="w-full h-full"
            />
          </div>
        )}

        <HeroAI />

        {/* ✅ Qué es */}
        <Section className="py-12 sm:py-14">
          <ProCard>
            <div className="px-6 sm:px-10 py-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Plataforma académica con IA"
                  tone="navy"
                />
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Ecuador · UTPL y más
                </span>
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Estudia con orden. Avanza con claridad.
              </h2>

              <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                <strong>StudyDocu</strong> te ayuda a organizar tus documentos universitarios,
                obtener resúmenes con IA y preparar tus entregas con un flujo simple y profesional.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/que-es-studydocu"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Conoce StudyDocu <ArrowRight className="ml-2 w-4 h-4" />
                </Link>

                <Link
                  href="/registrarse"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
                >
                  Crear cuenta gratis
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold text-slate-900">Organización real</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Universidad · carrera · materia · documentos.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold text-slate-900">IA útil</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Resúmenes y puntos clave en minutos.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold text-slate-900">Confianza</p>
                  <p className="mt-1 text-sm text-slate-700">Soporte y asesores verificados.</p>
                </div>
              </div>
            </div>
          </ProCard>
        </Section>

        {/* ✅ Fundador */}
        <Section className="pb-12">
          <ProCard>
            <div className="px-6 sm:px-10 py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-semibold">Transparencia</h3>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Fundador · Confianza
                </span>
              </div>

              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
                StudyDocu fue creado por <strong>Jonathan Octavio Rosado Lopez</strong>, con el
                objetivo de construir una plataforma académica moderna, confiable y centrada en el
                aprendizaje real del estudiante.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/sobre-mi"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Conocer al fundador <ArrowRight className="ml-2 w-4 h-4" />
                </Link>

                <Link
                  href="/sobre-mi#studydocu"
                  className="inline-flex items-center px-5 py-2.5 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
                >
                  Ver misión
                </Link>
              </div>
            </div>
          </ProCard>
        </Section>

        {/* ✅ Producto / Demo */}
        <Section className="pb-12">
          <motion.div
            initial={fadeFrom}
            whileInView={fadeTo}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <ProCard>
              <div className="px-6 sm:px-10 py-10">
                <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] items-start">
                  <div className="text-center lg:text-left">
                    <Badge
                      icon={<Sparkles className="w-4 h-4" />}
                      label="Todo en un solo lugar"
                      tone="cyan"
                    />

                    <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                      Tu estudio, con una interfaz clara y profesional.
                      <span className="block text-slate-700 font-semibold">
                        Más orden. Menos estrés.
                      </span>
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-slate-700 max-w-2xl">
                      Sube documentos, organiza tus materias y obtén resúmenes con IA. Diseñado para
                      estudiantes de Ecuador (UTPL y más).
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                      <Button
                        onClick={handleStart}
                        className="px-7 py-5 rounded-2xl text-sm sm:text-base bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-all"
                      >
                        Empezar gratis <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>

                      <Button
                        onClick={handleWhatsApp}
                        variant="outline"
                        className="px-7 py-5 rounded-2xl text-sm sm:text-base border-slate-200 bg-white hover:bg-slate-50"
                      >
                        Hablar por WhatsApp
                      </Button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start text-xs sm:text-sm text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" /> Seguro y privado
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-700" /> IA + organización
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-600" /> Asesores verificados
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_28px_-22px_rgba(2,6,23,0.25)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-xs text-slate-600">Vista previa · Resumen IA</span>
                    </div>

                    <div className="p-5 grid gap-4 bg-slate-50/40">
                      <div className="rounded-2xl bg-white border border-slate-200 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <FileText className="w-4 h-4 text-blue-700" />
                          Macroeconomía · Unidad 6.pdf
                        </div>
                        <p className="mt-2 text-xs text-slate-600">
                          IA detectó: IPC, inflación, deflactor del PIB, tasa de inflación, sesgos
                          de medición.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">
                            Resumen automático (preview)
                          </span>
                          <span className="text-[11px] text-slate-500">~ 12s</span>
                        </div>

                        <ul className="mt-3 space-y-2 text-xs text-slate-800">
                          <li className="flex gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-600" />
                            El IPC mide el costo de una canasta de bienes/servicios en el tiempo.
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-600" />
                            Inflación = variación porcentual del IPC; deflactor ajusta precios del
                            PIB.
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-600" />
                            Sesgos: sustitución, nuevos bienes, calidad y canasta fija.
                          </li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                          <p className="text-[11px] text-slate-500">Tareas hoy</p>
                          <p className="text-lg font-bold text-slate-900">3</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                          <p className="text-[11px] text-slate-500">Exámenes</p>
                          <p className="text-lg font-bold text-slate-900">1</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                          <p className="text-[11px] text-slate-500">Progreso</p>
                          <p className="text-lg font-bold text-slate-900">72%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!isMobile && (
                  <div className="mt-10">
                    <AnimatedServices />
                  </div>
                )}
              </div>
            </ProCard>
          </motion.div>
        </Section>

        {/* ✅ Antes vs Después */}
        <Section className="pb-12">
          <motion.div
            initial={fadeFrom}
            whileInView={fadeTo}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <ProCard>
              <div className="px-6 sm:px-10 py-10">
                <div className="text-center mb-8">
                  <Badge
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Impacto inmediato"
                    tone="emerald"
                  />
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    Antes vs Después de StudyDocu
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-3xl mx-auto">
                    Menos caos, más claridad. No solo guardas archivos: los conviertes en estudio
                    accionable.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <MiniCard className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Antes
                      </span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                        Caos
                      </span>
                    </div>

                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        PDFs dispersos en WhatsApp/Drive y no encuentras nada.
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Te demoras horas leyendo y no sabes qué es lo importante.
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Exámenes encima y todo se vuelve estrés.
                      </li>
                    </ul>
                  </MiniCard>

                  <MiniCard className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Después
                      </span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800">
                        Control + IA
                      </span>
                    </div>

                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        Todo organizado por universidad/carrera/materia.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        Resúmenes automáticos + vista previa inteligente.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        Planificación con tareas, metas y calendario.
                      </li>
                    </ul>
                  </MiniCard>
                </div>
              </div>
            </ProCard>
          </motion.div>
        </Section>

        {/* ✅ Métricas */}
        <Section className="pb-10">
          <div className="grid gap-4 md:grid-cols-4">
            <MiniCard className="p-5 text-center">
              <p className="text-xs text-slate-500">Documentos organizados</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                <CountUp to={12800} suffix="+" enabled={countEnabled} />
              </p>
            </MiniCard>

            <MiniCard className="p-5 text-center">
              <p className="text-xs text-slate-500">Resúmenes generados</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                <CountUp to={40200} suffix="+" enabled={countEnabled} />
              </p>
            </MiniCard>

            <MiniCard className="p-5 text-center">
              <p className="text-xs text-slate-500">Tiempo ahorrado</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                <CountUp to={3200} suffix="h+" enabled={countEnabled} />
              </p>
            </MiniCard>

            <MiniCard className="p-5 text-center">
              <p className="text-xs text-slate-500">Satisfacción</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                <CountUp to={98} suffix="%" enabled={countEnabled} />
              </p>
            </MiniCard>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-500">
            *Ajusta estos valores a datos reales cuando tengas métricas internas.
          </p>
        </Section>

        {!isMobile && (
          <>
            <Section className="pb-12">
              <motion.div
                initial={fadeFrom}
                whileInView={fadeTo}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <ProCard>
                  <div className="px-6 sm:px-10 py-10">
                    <div className="text-center">
                      <Badge
                        icon={<Sparkles className="w-4 h-4" />}
                        label="Confianza real"
                        tone="navy"
                      />
                      <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                        Lo que dicen nuestros usuarios
                      </h2>
                      <p className="mt-2 text-sm sm:text-base text-slate-700 mb-8 max-w-2xl mx-auto">
                        Estudiantes de distintas carreras ya usan StudyDocu para estudiar mejor,
                        organizar sus trabajos y avanzar con más tranquilidad.
                      </p>
                    </div>

                    <AnimatedTestimonials />
                  </div>
                </ProCard>
              </motion.div>
            </Section>

            <Section className="pb-10">
              <AnimatedAsesores />
            </Section>
          </>
        )}

        {/* ✅ Funcionalidades */}
        <Section className="py-10">
          <motion.div
            id="funcionalidades"
            initial={fadeFrom}
            whileInView={fadeTo}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="text-center mb-8">
              <Badge
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Herramientas para tu día"
                tone="cyan"
              />
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Funcionalidades que organizan tu vida académica
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-3xl mx-auto">
                Productividad + IA + comunidad. Todo con una interfaz moderna y profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {(isMobile ? featureItems.slice(0, 8) : featureItems).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={motionEnabled ? { opacity: 0, y: 10 } : undefined}
                  whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
                  viewport={{ once: true }}
                  transition={{ delay: motionEnabled ? i * 0.02 : 0 }}
                >
                  <MiniCard className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-slate-900" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                      {item.description}
                    </p>
                  </MiniCard>
                </motion.div>
              ))}
            </div>

            {isMobile && (
              <div className="mt-6 flex justify-center">
                <Link href="/servicios">
                  <Button
                    variant="outline"
                    className="rounded-full border-slate-200 bg-white hover:bg-slate-50"
                  >
                    Ver todas las funcionalidades <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </Section>

        {/* ✅ CTA principal */}
        <Section className="py-12">
          <ProCard>
            <div className="px-6 sm:px-10 py-10 text-center">
              <Badge icon={<Sparkles className="w-4 h-4" />} label="Empieza hoy" tone="emerald" />

              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                ¿Listo para comenzar?
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-2xl mx-auto">
                Crea tu cuenta en minutos, sube tus primeros apuntes y descubre cómo StudyDocu puede
                transformar tu manera de estudiar.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleStart}
                  className="px-10 py-5 text-base sm:text-lg bg-slate-900 text-white rounded-2xl shadow-sm hover:bg-slate-800 transition-all"
                >
                  Empezar gratis <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  onClick={() => router.push('/explorar')}
                  variant="outline"
                  className="px-10 py-5 text-base sm:text-lg rounded-2xl border-slate-200 bg-white hover:bg-slate-50"
                >
                  Explorar documentos
                </Button>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-500">
                Sin tarjetas. Solo necesitas tu correo universitario o personal.
              </p>
            </div>
          </ProCard>
        </Section>

        {/* ✅ Más herramientas */}
        <Section className="pb-16">
          <motion.div
            initial={fadeFrom}
            whileInView={fadeTo}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <ProCard>
              <div className="px-6 sm:px-10 py-10">
                <div className="text-center mb-8">
                  <Badge
                    icon={<Brain className="w-4 h-4" />}
                    label="Potenciado por IA"
                    tone="cyan"
                  />
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    Más herramientas útiles para tu estudio
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-3xl mx-auto">
                    No solo subes documentos. StudyDocu analiza, resume y te da una vista más clara
                    de tu carga académica.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {extraItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={motionEnabled ? { opacity: 0, y: 10 } : undefined}
                      whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
                      viewport={{ once: true }}
                      transition={{ delay: motionEnabled ? i * 0.03 : 0 }}
                    >
                      <MiniCard className="p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <item.icon className="w-6 h-6 text-slate-900" strokeWidth={1.5} />
                          </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                          {item.description}
                        </p>
                      </MiniCard>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <Link href="/herramientas">
                    <Button
                      variant="outline"
                      className="text-sm sm:text-base border-slate-200 bg-white hover:bg-slate-50 font-medium px-8 py-3 rounded-full"
                    >
                      Ver todas las herramientas <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ProCard>
          </motion.div>
        </Section>

        <div ref={footerSentinelRef} className="w-full h-1" />
        <div className="h-24 sm:h-28" />

        <Footer />

        {showFloatingCTA && !hideFloatingCTA && (
          <div className="fixed bottom-4 left-0 right-0 z-30 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
              <div
                className={[
                  'pointer-events-auto flex items-center gap-2 rounded-full',
                  'border border-slate-200 bg-white',
                  'shadow-[0_16px_40px_-28px_rgba(2,6,23,0.35)]',
                  'px-2 py-2',
                ].join(' ')}
              >
                <Button
                  onClick={handleStart}
                  className="rounded-full px-4 py-2 h-auto bg-slate-900 text-white hover:bg-slate-800"
                >
                  Empezar <ArrowRight className="ml-1 w-4 h-4" />
                </Button>

                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className={[
                    'rounded-full h-auto border-slate-200 bg-white hover:bg-slate-50',
                    isMobile ? 'px-3 py-2' : 'px-4 py-2',
                  ].join(' ')}
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  {isMobile ? (
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 text-emerald-600 mr-2" />
                      WhatsApp
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
