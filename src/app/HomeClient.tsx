'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { toast } from 'sonner'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import HeroAI from '@/components/HeroAI'
import Footer from '@/components/Footer'
import AnimatedServices from '@/components/AnimatedServices'
import AnimatedTestimonials from '@/components/AnimatedTestimonials'
import AnimatedAsesores from '@/components/AnimatedAsesores'
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
} from 'lucide-react'

/* -----------------------------
   Datos
------------------------------ */
const featureItems = [
  { name: 'Tareas', icon: CheckCircle2, description: 'Organiza y gestiona tus pendientes.' },
  { name: 'Documentos', icon: FileText, description: 'Centraliza tus apuntes y trabajos.' },
  { name: 'Chat', icon: MessageSquare, description: 'Colabora en tiempo real con tu equipo.' },
  { name: 'IA Asistente', icon: Brain, description: 'Potencia tu estudio con respuestas inteligentes.' },
  { name: 'Calendario', icon: CalendarDays, description: 'Visualiza entregas, exámenes y plazos clave.' },
  { name: 'Metas', icon: Goal, description: 'Define objetivos y mide tu avance.' },
  { name: 'Suscripciones', icon: CreditCard, description: 'Accede a funciones premium sin complicaciones.' },
  { name: 'Dashboards', icon: LayoutDashboard, description: 'Monitorea tu progreso académico visualmente.' },
  { name: 'Asesores verificados', icon: UserCheck, description: 'Recibe apoyo de profesionales validados.' },
  { name: 'Referidos', icon: Gift, description: 'Invita amigos y gana recompensas exclusivas.' },
  { name: 'Blog educativo', icon: BookOpenCheck, description: 'Tips, guías y buenas prácticas de estudio.' },
  { name: 'Modo universidad segura', icon: ShieldCheck, description: 'Configurado según políticas institucionales.' },
]

const extraItems = [
  { name: 'Resumen automático', icon: Wand2, description: 'IA que resume tus documentos al subirlos.' },
  { name: 'Vista previa inteligente', icon: Eye, description: 'Explora el contenido sin abrir cada archivo.' },
  { name: 'Moderación automática', icon: ShieldCheck, description: 'IA que ayuda a revisar el contenido.' },
  { name: 'Sistema de recompensas', icon: Gift, description: 'Gana puntos y beneficios por participar.' },
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
   Helpers UI
------------------------------ */
function Badge({
  icon,
  label,
  tone = 'indigo',
}: {
  icon: React.ReactNode
  label: string
  tone?: 'indigo' | 'fuchsia' | 'emerald' | 'amber'
}) {
  const tones: Record<string, string> = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200',
    fuchsia: 'bg-fuchsia-50 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-200',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {icon}
      {label}
    </div>
  )
}

function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 220, damping: 30 })
  const sy = useSpring(my, { stiffness: 220, damping: 30 })

  const bg = useTransform([sx, sy], ([x, y]) => {
    return `radial-gradient(240px circle at ${x}px ${y}px, rgba(99,102,241,0.22), rgba(168,85,247,0.10), transparent 60%)`
  })

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mx.set(e.clientX - rect.left)
        my.set(e.clientY - rect.top)
      }}
      className={`relative overflow-hidden rounded-2xl border border-white/40 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-xl transition-all ${className}`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function CountUp({
  to,
  suffix = '',
  durationMs = 1200,
}: {
  to: number
  suffix?: string
  durationMs?: number
}) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = 0

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      const next = Math.round(from + (to - from) * eased)
      setVal(next)
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, durationMs])

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
  const { user } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', isDark)

    if (!localStorage.getItem('visited')) {
      toast.success('🎉 ¡Logro desbloqueado! Primer ingreso a StudyDocu')
      setShowConfetti(true)
      localStorage.setItem('visited', 'true')
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [])

  const handleStart = () => {
    router.push(user ? '/dashboard' : '/registrarse')
  }

  const handleWhatsApp = () => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(
      'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20y%20sus%20servicios.',
      '_blank',
    )
  }

  // ✅ Schema Markup PRO
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
    [],
  )

  return (
    <>
      <Script
        id="studydocu-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <main className="relative z-10 w-full min-h-screen flex flex-col items-center text-text bg-transparent">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <Lottie animationData={confettiAnimation} loop={false} autoplay className="w-full h-full" />
          </div>
        )}

            {/* HERO existente */}
<HeroAI />

{/* ¿Qué es StudyDocu? */}
<section className="relative w-full max-w-5xl mx-auto px-4 py-16">
  <div className="rounded-3xl bg-white/70 dark:bg-gray-900/70 md:backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl px-6 sm:px-10 py-10">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
      ¿Qué es StudyDocu?
    </h2>

    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
      <strong>StudyDocu</strong> es una plataforma académica con inteligencia artificial,
      creada en Ecuador, que ayuda a estudiantes universitarios a organizar sus apuntes,
      comprender mejor sus materias y estudiar de forma más eficiente.
    </p>

    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
      A diferencia de otras plataformas, StudyDocu combina organización académica,
      herramientas inteligentes y acompañamiento educativo, enfocándose en el aprendizaje
      real y responsable.
    </p>

    <div className="flex flex-wrap gap-4">
      <a
        href="/que-es-studydocu"
        className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Conoce más sobre StudyDocu →
      </a>

      <a
        href="/registrarse"
        className="inline-flex items-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Crear cuenta gratis
      </a>
    </div>
  </div>
</section>

{/* Conocer sobre el fundador (versión PRO, sin duplicados) */}
<section className="relative w-full max-w-5xl mx-auto px-4 pb-16">
  <div className="rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500/35 via-purple-500/30 to-fuchsia-500/35">
    <div className="rounded-3xl bg-white/80 dark:bg-gray-900/50 md:backdrop-blur-xl border border-gray-200/60 dark:border-white/10 px-6 sm:px-8 py-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Conocer sobre el fundador
        </h3>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-300/20">
          Transparencia · Confianza
        </span>
      </div>

      <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        StudyDocu fue creado por <strong>Jonathan Octavio Rosado Lopez</strong>, empresario y emprendedor digital,
        con el objetivo de construir una plataforma académica confiable, moderna y centrada en el aprendizaje real
        de los estudiantes universitarios en Ecuador.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="/sobre-mi"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Conocer al fundador →
        </a>

        <a
          href="/sobre-mi#studydocu"
          className="inline-flex items-center px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Ver misión de StudyDocu
        </a>
      </div>
    </div>
  </div>
</section>




        {/* --- NUEVO: Sección Demo / Producto en vivo --- */}
        <section className="relative w-full max-w-6xl mx-auto -mt-8 md:-mt-12 px-4 pb-10">
          <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 shadow-xl backdrop-blur-xl px-5 sm:px-8 py-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-start">
              <div className="text-center lg:text-left">
                <Badge
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Plataforma académica todo en uno"
                  tone="indigo"
                />

                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Tu estudio, ordenado y potenciado con IA
                  <span className="block text-indigo-600 dark:text-indigo-300">en segundos, no en horas.</span>
                </h2>

                <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
                  Sube documentos, organiza tus materias y obtén resúmenes, ideas y apoyo de asesores verificados.
                  Diseñado para estudiantes de Ecuador (UTPL y más).
                </p>

                <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Button
                    onClick={handleStart}
                    className="px-7 py-5 rounded-2xl text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    🚀 Empezar gratis <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="px-7 py-5 rounded-2xl text-sm sm:text-base bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800"
                  >
                    Hablar por WhatsApp
                  </Button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-500" /> Seguro y privado
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" /> IA + organización
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" /> Asesores verificados
                  </span>
                </div>
              </div>

              {/* Demo mock */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden border border-white/40 dark:border-gray-800 bg-white/60 dark:bg-gray-950/50 backdrop-blur-md shadow-lg"
              >
                <div className="p-4 border-b border-white/40 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Vista previa · Resumen IA</span>
                </div>

                <div className="p-5 grid gap-4">
                  <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Macroeconomía · Unidad 6.pdf
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                      IA detectó: IPC, inflación, deflactor del PIB, tasa de inflación, sesgos de medición.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-fuchsia-500/10 border border-white/40 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                        Resumen automático (preview)
                      </span>
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">~ 12s</span>
                    </div>

                    <ul className="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-200">
                      <li className="flex gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        El IPC mide el costo de una canasta de bienes/servicios en el tiempo.
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Inflación = variación porcentual del IPC; deflactor ajusta precios del PIB.
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Sesgos: sustitución, nuevos bienes, calidad y canasta fija.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3 text-center">
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">Tareas hoy</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">3</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3 text-center">
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">Exámenes</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">1</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3 text-center">
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">Progreso</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">72%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8">
              <AnimatedServices />
            </div>
          </div>
        </section>

        {/* --- NUEVO: Antes vs Después --- */}
        <section className="w-full max-w-6xl mx-auto px-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950 shadow-xl px-5 sm:px-8 py-10"
          >
            <div className="text-center mb-8">
              <Badge icon={<Sparkles className="w-4 h-4" />} label="Impacto inmediato" tone="fuchsia" />
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Antes vs Después de StudyDocu
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Menos caos, más claridad. No solo guardas archivos: los conviertes en estudio accionable.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SpotlightCard className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Antes
                  </span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200">
                    Caos
                  </span>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500" />
                    PDFs dispersos en WhatsApp/Drive y no encuentras nada.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500" />
                    Te demoras horas leyendo y no sabes qué es lo importante.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500" />
                    Exámenes encima y todo se vuelve estrés.
                  </li>
                </ul>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Después
                  </span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/60 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-200">
                    Control + IA
                  </span>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Todo organizado por universidad/carrera/materia.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Resúmenes automáticos + vista previa inteligente.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Planificación con tareas, metas y calendario.
                  </li>
                </ul>
              </SpotlightCard>
            </div>
          </motion.div>
        </section>

        {/* --- NUEVO: Métricas / confianza --- */}
        <section className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2">
          <div className="grid gap-4 md:grid-cols-4">
            <SpotlightCard className="p-5 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">Documentos organizados</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp to={12800} suffix="+" />
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">Resúmenes generados</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp to={40200} suffix="+" />
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">Tiempo ahorrado</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp to={3200} suffix="h+" />
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">Satisfacción</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp to={98} suffix="%" />
              </p>
            </SpotlightCard>
          </div>
          <p className="mt-3 text-center text-[11px] text-gray-500 dark:text-gray-400">
            *Puedes ajustar estos valores a datos reales cuando tengas métricas internas.
          </p>
        </section>

        {/* Testimonios */}
        <section className="relative w-full max-w-6xl mx-auto pt-8 pb-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 border border-white/50 dark:border-white/10 shadow-xl px-5 sm:px-8 py-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Estudiantes de distintas carreras ya usan StudyDocu para estudiar mejor, organizar sus trabajos y
              aprobar con más tranquilidad.
            </p>
            <AnimatedTestimonials />
          </motion.div>
        </section>

        {/* Asesores */}
        <section className="w-full max-w-6xl mx-auto pt-6 pb-6 px-4">
          <AnimatedAsesores />
        </section>

        {/* Funcionalidades principales con Spotlight Cards */}
        <motion.section
          id="funcionalidades"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto py-10 px-4"
        >
          <div className="text-center mb-8">
            <Badge icon={<LayoutDashboard className="w-4 h-4" />} label="Herramientas para tu día" tone="indigo" />
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Funcionalidades que organizan tu vida académica
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Productividad + IA + comunidad. Todo con una interfaz moderna y profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.035 }}
              >
                <SpotlightCard className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA principal */}
        <section className="w-full max-w-4xl mx-auto text-center px-6 py-10 md:py-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            ¿Listo para comenzar?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Crea tu cuenta en minutos, sube tus primeros apuntes y descubre cómo StudyDocu puede transformar tu manera
            de estudiar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleStart}
              className="px-10 py-5 text-base sm:text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              🚀 Empezar gratis
            </Button>

            <Button
              onClick={() => router.push('/explorar')}
              variant="outline"
              className="px-10 py-5 text-base sm:text-lg rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800"
            >
              Explorar documentos
            </Button>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sin tarjetas. Solo necesitas tu correo universitario o personal.
          </p>
        </section>

        {/* Más herramientas */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto px-4 md:px-6 mt-2 pb-16"
        >
          <div className="text-center mb-8">
            <Badge icon={<Brain className="w-4 h-4" />} label="Potenciado por IA" tone="fuchsia" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Más herramientas útiles para tu estudio
          </h2>

          <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            No solo subes documentos. StudyDocu analiza, resume y te da una vista más clara de tu carga académica.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {extraItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <SpotlightCard className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/40 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-200" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/herramientas">
              <Button className="text-sm sm:text-base bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800 text-gray-800 dark:text-white font-medium px-8 py-3 rounded-full shadow-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all">
                Ver todas las herramientas <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.section>

        <Footer />

        {/* CTA flotante */}
        <div className="fixed bottom-4 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-6xl mx-auto px-4 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/40 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-xl px-3 py-2">
              <Button onClick={handleStart} className="rounded-full px-4 py-2 h-auto">
                Empezar <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
              <Button onClick={handleWhatsApp} variant="outline" className="rounded-full px-4 py-2 h-auto">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
