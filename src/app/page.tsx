'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Script from 'next/script'

import HeroAI from '@/components/HeroAI'
import Footer from '@/components/Footer'
import AnimatedServices from '@/components/AnimatedServices'
import AnimatedTestimonials from '@/components/AnimatedTestimonials'
import AnimatedAsesores from '@/components/AnimatedAsesores'
import { useUserContext } from '@/context/UserContext'
import confettiAnimation from '@/assets/lotties/confetti.json'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
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
} from 'lucide-react'

const featureItems = [
  { name: 'Tareas', icon: CheckCircle, description: 'Organiza y gestiona tus pendientes.' },
  { name: 'Documentos', icon: FileText, description: 'Centraliza tus apuntes y trabajos.' },
  { name: 'Chat', icon: MessageSquare, description: 'Colabora en tiempo real con tu equipo.' },
  { name: 'IA Asistente', icon: Brain, description: 'Potencia tu estudio con respuestas inteligentes.' },
  { name: 'Calendario', icon: CalendarDays, description: 'Visualiza entregas, exámenes y plazos clave.' },
  { name: 'Metas', icon: Goal, description: 'Define objetivos y mide tu avance.' },
  { name: 'Suscripciones', icon: CreditCard, description: 'Accede a funciones premium sin complicaciones.' },
  { name: 'Dashboards', icon: LayoutDashboard, description: 'Monitorea tu progreso académico visualmente.' },
  {
    name: 'Asesores verificados',
    icon: UserCheck,
    description: 'Recibe apoyo de profesionales validados.',
  },
  { name: 'Referidos', icon: Gift, description: 'Invita amigos y gana recompensas exclusivas.' },
  { name: 'Blog educativo', icon: BookOpenCheck, description: 'Tips, guías y buenas prácticas de estudio.' },
  {
    name: 'Modo universidad segura',
    icon: ShieldCheck,
    description: 'Configurado según las políticas de tu institución.',
  },
]

const extraItems = [
  { name: 'Resumen automático', icon: Brain, description: 'IA que resume tus documentos al subirlos.' },
  { name: 'Vista previa inteligente', icon: Eye, description: 'Explora el contenido sin abrir cada archivo.' },
  { name: 'Moderación automática', icon: ShieldCheck, description: 'IA que ayuda a revisar el contenido.' },
  {
    name: 'Sistema de recompensas',
    icon: Gift,
    description: 'Gana puntos y beneficios por participar en la comunidad.',
  },
]

// ✅ Config PRO para Schema (edita aquí si cambian redes o datos)
const BRAND = {
  name: 'StudyDocu',
  url: 'https://www.studydocu.ec/',
  logo: 'https://www.studydocu.ec/logo.png', // /public/logo.png
  ogImage: 'https://www.studydocu.ec/og-image.jpg', // /public/og-image.jpg
  description:
    'StudyDocu es una plataforma académica con IA para subir, organizar y resumir documentos universitarios, conectar con asesores verificados y mejorar el rendimiento de estudio en Ecuador.',
  foundingDate: '2024',
  phone: '+593958757302',
  sameAs: [
    'https://www.facebook.com/StudyDocu',
    'https://www.instagram.com/studydocu1',
    // 'https://www.linkedin.com/company/studydocu',
    // 'https://www.youtube.com/@studydocu',
  ],
}

export default function HomePage() {
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

      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }
  }, [])

  const handleStart = () => {
    router.push(user ? '/dashboard' : '/registrarse')
  }

  // ✅ Schema Markup PRO (Organization + WebSite + WebPage)
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BRAND.url}#organization`,
        name: BRAND.name,
        url: BRAND.url,
        logo: {
          '@type': 'ImageObject',
          url: BRAND.logo,
          width: 512,
          height: 512,
        },
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
  }

  return (
    <>
      {/* 🔍 Schema Markup PRO para Google */}
      <Script
        id="studydocu-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <main className="relative z-10 w-full min-h-screen flex flex-col items-center text-text bg-transparent">
        {/* Confetti de bienvenida */}
        {showConfetti && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <Lottie animationData={confettiAnimation} loop={false} autoplay className="w-full h-full" />
          </div>
        )}

        {/* Onda decorativa inferior */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[100px]">
            <path d="M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z" fill="#ffffff" opacity="0.1">
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z;
                M0,0 C600,0 600,100 1200,0 L1200,0 L0,0 Z;
                M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z
              "
              />
            </path>
          </svg>
        </div>

        {/* HERO principal */}
        <HeroAI />

        {/* Sección: Qué es StudyDocu + servicios animados */}
        <section className="relative w-full max-w-6xl mx-auto -mt-6 md:-mt-10 px-4 pb-8">
          <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 shadow-xl backdrop-blur-xl px-5 sm:px-8 py-8 sm:py-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-200 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Plataforma académica todo en uno
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Bienvenido a <span className="text-indigo-500">StudyDocu</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Centraliza tus apuntes, organiza tus materias, apóyate en IA y conéctate con asesores académicos
                verificados. Todo en un solo lugar, pensado para estudiantes de Ecuador.
              </p>
            </div>

            <AnimatedServices />
          </div>
        </section>

        {/* Testimonios */}
        <section className="relative w-full max-w-6xl mx-auto pt-6 md:pt-10 pb-4 px-4">
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
              aprobar sus materias con más tranquilidad.
            </p>
            <AnimatedTestimonials />
          </motion.div>
        </section>

        {/* Asesores destacados */}
        <section className="w-full max-w-6xl mx-auto pt-6 md:pt-10 pb-6 px-4">
          <AnimatedAsesores />
        </section>

        {/* Funcionalidades principales */}
        <motion.section
          id="funcionalidades"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto py-10 px-4"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200 mb-3">
              Herramientas para tu día a día
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Funcionalidades que organizan tu vida académica
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              StudyDocu combina productividad, organización e inteligencia artificial para ayudarte a cumplir tus
              objetivos de estudio sin perder el control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7 text-left">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-center text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA principal */}
        <section className="w-full max-w-4xl mx-auto text-center px-6 py-10 md:py-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            ¿Listo para comenzar?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
            Crea tu cuenta en minutos, sube tus primeros apuntes y descubre cómo StudyDocu puede transformar tu
            manera de estudiar.
          </p>
          <Button
            onClick={handleStart}
            className="px-10 py-4 text-base sm:text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            🚀 Empezar gratis
          </Button>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sin tarjetas. Solo necesitas tu correo universitario o personal.
          </p>
        </section>

        {/* Más herramientas */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto px-4 md:px-6 mt-2 pb-20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/40 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700 dark:text-fuchsia-200 mb-3">
              Potenciado por IA
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Más herramientas útiles para tu estudio
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            No solo subes documentos. StudyDocu analiza, resume y te da una vista más clara de tu carga académica con
            funciones avanzadas pensadas para estudiantes exigentes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {extraItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/40 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-200" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/herramientas">
              <Button className="text-sm sm:text-base bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-800 text-gray-800 dark:text-white font-medium px-8 py-3 rounded-full shadow-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all">
                Ver todas las herramientas →
              </Button>
            </Link>
          </div>
        </motion.section>

        <Footer />
      </main>
    </>
  )
}
