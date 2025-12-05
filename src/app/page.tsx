'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import HeroAI from '@/components/HeroAI'
import Footer from '@/components/Footer'
import AnimatedServices from '@/components/AnimatedServices'
import AnimatedTestimonials from '@/components/AnimatedTestimonials'
import AnimatedAsesores from '@/components/AnimatedAsesores'
import { useUserContext } from '@/context/UserContext'
import confettiAnimation from '@/assets/lotties/confetti.json'
import { Button } from '@/components/ui/button'
import {
  CheckCircle, LayoutDashboard, MessageSquare, Brain,
  CalendarDays, Goal, FileText, CreditCard, ShieldCheck,
  Eye, Gift, UserCheck, BookOpenCheck
} from 'lucide-react'

const featureItems = [
  { name: 'Tareas', icon: CheckCircle, description: 'Organiza y gestiona tus pendientes.' },
  { name: 'Documentos', icon: FileText, description: 'Crea y colabora en documentos.' },
  { name: 'Chat', icon: MessageSquare, description: 'Colabora en tiempo real.' },
  { name: 'IA Asistente', icon: Brain, description: 'Potencia tu productividad con IA.' },
  { name: 'Calendario', icon: CalendarDays, description: 'Visualiza tus plazos y eventos.' },
  { name: 'Metas', icon: Goal, description: 'Define y sigue tus objetivos.' },
  { name: 'Suscripciones', icon: CreditCard, description: 'Accede a funciones premium.' },
  { name: 'Dashboards', icon: LayoutDashboard, description: 'Visualiza tus datos clave.' },
  { name: 'Asesores verificados', icon: UserCheck, description: 'Encuentra ayuda profesional validada.' },
  { name: 'Referidos', icon: Gift, description: 'Invita amigos y gana recompensas.' },
  { name: 'Blog educativo', icon: BookOpenCheck, description: 'Consejos de estudio y más.' },
  { name: 'Modo universidad segura', icon: ShieldCheck, description: 'Privacidad según tu institución.' }
]

const extraItems = [
  { name: 'Resumen automático', icon: Brain, description: 'IA que resume tus documentos al subirlos.' },
  { name: 'Vista previa inteligente', icon: Eye, description: 'Explora documentos sin abrirlos.' },
  { name: 'Moderación automática', icon: ShieldCheck, description: 'IA revisa contenido por ti.' },
  { name: 'Sistema de recompensas', icon: Gift, description: 'Gana puntos y premios por participar.' }
]

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

  return (
    <main className="relative z-10 w-full min-h-screen flex flex-col justify-start items-center text-text bg-transparent">
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Lottie animationData={confettiAnimation} loop={false} autoplay className="w-full h-full" />
        </div>
      )}

      {/* Onda decorativa inferior */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[100px]">
          <path d="M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z" fill="#ffffff" opacity="0.1">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z;
                      M0,0 C600,0 600,100 1200,0 L1200,0 L0,0 Z;
                      M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z" />
          </path>
        </svg>
      </div>

      <HeroAI />

      <section className="text-center mt-10 px-4 bg-transparent dark:bg-transparent">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Bienvenido a StudyDocu</h1>
        <AnimatedServices />
      </section>

      <section className="max-w-screen-xl mx-auto pt-10 pb-10 px-6 text-center bg-transparent dark:bg-transparent">
        <h2 className="text-4xl font-bold mb-10">Lo que dicen nuestros usuarios</h2>
        <AnimatedTestimonials />
      </section>

      <AnimatedAsesores />

      <motion.section
        id="funcionalidades"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl mx-auto py-12 px-6 md:px-12 bg-transparent dark:bg-transparent"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 text-left">
          {featureItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out text-center"
            >
              <item.icon className="w-14 h-14 mx-auto mb-4 text-primary group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-2 text-foreground">{item.name}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="text-center px-6 py-10 md:py-14">
        <h2 className="text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p className="text-lg text-muted-foreground mb-6">Únete gratis y explora todas las funciones de StudyDocu.</p>
        <Button
          onClick={handleStart}
          className="px-10 py-4 text-lg sm:text-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow hover:scale-105 transition-all"
        >
          🚀 Empezar gratis
        </Button>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 mt-10 pb-20"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Más herramientas útiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {extraItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 text-center shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-out"
            >
              <item.icon className="w-14 h-14 mx-auto mb-4 text-primary group-hover:rotate-3 group-hover:scale-110 transition-all duration-300" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-foreground mb-2">{item.name}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <Link href="/herramientas">
            <Button className="text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30 text-gray-700 dark:text-white font-medium px-8 py-4 rounded-full shadow hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all">
              Ver todas las herramientas →
            </Button>
          </Link>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}
