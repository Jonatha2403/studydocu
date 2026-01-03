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
    <span className="text-cyan-300 font-semibold">
      {text}
      <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-300/80 animate-pulse" />
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
    <main className="min-h-screen w-full bg-[#071024]">
      {/* Layout 2 paneles como screenshot */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL (azul) */}
        <div className="relative overflow-hidden">
          {/* degradado azul como screenshot */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#122B66] via-[#153777] to-[#0F2F73]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_35%_25%,rgba(56,189,248,0.20),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_450px_at_70%_55%,rgba(99,102,241,0.18),transparent_62%)]" />
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_25%,transparent_70%,rgba(0,0,0,0.25))]" />

          <div className="relative h-full px-8 py-14 lg:px-16 lg:py-16 flex items-center">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Únete a más de <b>1 millón</b> de estudiantes
              </div>

              <div className="mt-10 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                Study<span className="text-cyan-300">Docu</span>
              </div>

              <h1 className="mt-10 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Todas las herramientas para <br />
                <span className="text-cyan-300">el éxito académico</span>
              </h1>

              <p className="mt-8 text-lg text-white/80 leading-relaxed">
                Herramientas de IA para estudiantes: <TypingText />
              </p>

              <p className="mt-20 text-sm italic text-white/60">“{quote}”</p>
            </motion.section>
          </div>
        </div>

        {/* RIGHT PANEL (oscuro + card centrada) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1226] via-[#071024] to-[#050A18]">
          {/* divider vertical como screenshot */}
          <div className="hidden lg:block absolute left-0 top-0 h-full w-px bg-white/10" />

          <div className="h-full flex items-center justify-center px-6 py-16">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-lg"
            >
              <div className="relative rounded-3xl bg-white/5 border border-white/10 shadow-[0_18px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative p-8 sm:p-10">
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold text-white">Iniciar sesión</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Accede a tu cuenta para continuar estudiando
                    </p>
                  </div>

                  <div className="mt-8">
                    <LoginForm />
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  )
}
