'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'

const WORDS = ['tu panel', 'tus documentos', 'tus favoritos', 'tu progreso']
const QUOTES = [
  'Tu progreso se construye en cada sesión de estudio.',
  'Un paso a la vez, pero todos los días.',
  'Organiza hoy, avanza mañana.',
]

function TypingText({
  words = WORDS,
  typeSpeed = 70,
  deleteSpeed = 45,
  pause = 1000,
}: {
  words?: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
}) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex] ?? ''

    if (!isDeleting && text.length < current.length) {
      const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
      return () => clearTimeout(t)
    }

    if (!isDeleting && text.length === current.length) {
      const p = setTimeout(() => setIsDeleting(true), pause)
      return () => clearTimeout(p)
    }

    if (isDeleting && text.length > 0) {
      const d = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed)
      return () => clearTimeout(d)
    }

    if (isDeleting && text.length === 0) {
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    }
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pause])

  return (
    <span className="text-cyan-600 font-semibold">
      {text}
      <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-500/70 animate-pulse" />
    </span>
  )
}

export default function LoginPage() {
  const [qIdx, setQIdx] = useState(0)
  const quote = useMemo(() => QUOTES[qIdx % QUOTES.length], [qIdx])

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % QUOTES.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#F6F5FF] via-[#F1EDFF] to-[#EAF4FF]">
      {/* Fondo suave tipo landing */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_25%_15%,rgba(124,92,255,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_80%_25%,rgba(56,189,248,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_55%_90%,rgba(92,124,250,0.12),transparent_65%)]" />
        <div className="absolute inset-0 opacity-60 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),transparent_25%,transparent_70%,rgba(255,255,255,0.45))]" />
      </div>

      {/* Espacio para tu header fijo (ajusta si tu header tiene otra altura) */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[92px] pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-140px)]">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Únete a más de <b className="text-slate-900">1 millón</b> de estudiantes
            </div>

            <div className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Study<span className="text-cyan-600">Docu</span>
            </div>

            <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Todas las herramientas para <br />
              <span className="bg-gradient-to-r from-[#7C5CFF] via-[#5C7CFA] to-[#38BDF8] bg-clip-text text-transparent">
                el éxito académico
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Organiza tus documentos, estudia con IA y encuentra recursos por universidad, carrera
              y materia. Todo en un solo lugar.
            </p>

            <div className="mt-8 text-lg text-slate-700 flex justify-center lg:justify-start gap-2 flex-wrap">
              <span>Herramientas de IA para estudiantes:</span>
              <TypingText />
            </div>

            <p className="mt-16 text-sm italic text-slate-500">“{quote}”</p>
          </motion.section>

          {/* RIGHT */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl bg-white/80 border border-black/5 shadow-[0_18px_55px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                {/* blobs suaves */}
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#7C5CFF]/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/14 blur-3xl" />

                <div className="relative p-8 sm:p-10">
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold text-slate-900">Iniciar sesión</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Accede a tu cuenta para continuar estudiando
                    </p>
                  </div>

                  <div className="mt-8">
                    <LoginForm />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
