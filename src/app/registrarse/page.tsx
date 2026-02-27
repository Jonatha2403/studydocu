// src/app/registrarse/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import RegisterForm from '@/components/auth/RegisterForm'

const WORDS = ['exámenes', 'resúmenes', 'mapas conceptuales', 'y mucho más...']
const QUOTES = [
  'Aprender es más fácil cuando todo está en su lugar.',
  'Pequeños avances diarios crean grandes resultados.',
  'Estudia mejor hoy, avanza más rápido mañana.',
]

function TypingText({
  words = WORDS,
  speed = 70,
  pause = 1200,
}: {
  words?: string[]
  speed?: number
  pause?: number
}) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const current = words[wordIndex] ?? ''
    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setText((prev) => prev + current[charIndex])
        setCharIndex((c) => c + 1)
      }, speed)
      return () => clearTimeout(t)
    }

    const p = setTimeout(() => {
      setText('')
      setCharIndex(0)
      setWordIndex((i) => (i + 1) % words.length)
    }, pause)

    return () => clearTimeout(p)
  }, [charIndex, wordIndex, words, speed, pause])

  return (
    <span className="text-cyan-700 dark:text-cyan-200 font-semibold">
      {text}
      <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-500/80 dark:bg-cyan-300/80 animate-pulse" />
    </span>
  )
}

export default function RegisterPage() {
  const [qIdx, setQIdx] = useState(0)
  const quote = useMemo(() => QUOTES[qIdx % QUOTES.length], [qIdx])

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % QUOTES.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F6F5FF] dark:bg-[#070B18]">
      {/* Fondo pro */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1200px_700px_at_20%_18%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(900px_650px_at_50%_85%,rgba(59,130,246,0.10),transparent_60%)]" />

        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_18%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.16),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_88%,rgba(59,130,246,0.08),transparent_60%)]" />

        <div className="absolute inset-0 opacity-70 dark:opacity-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_30%,transparent_70%,rgba(255,255,255,0.35))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_25%,transparent_70%,rgba(255,255,255,0.02))]" />
      </div>

      {/* Espacio para header fijo + safe area */}
      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[92px] pb-[120px] md:pt-[110px] md:pb-[90px]"
        style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}
      >
        <div className="min-h-[calc(100vh-92px)] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              Únete a más de <b className="text-gray-900 dark:text-white">1 millón</b> de
              estudiantes
            </div>

            <div className="mt-6">
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white/90">
                Study<span className="text-cyan-500 dark:text-cyan-300">Docu</span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Todas las herramientas para <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  el éxito académico
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl dark:text-white/70">
                Organiza tus documentos, estudia con IA y encuentra recursos por universidad,
                carrera y materia. Todo en un solo lugar.
              </p>

              <div className="mt-8 text-gray-700 text-lg flex items-center gap-2 flex-wrap dark:text-white/80">
                <span>Herramientas de IA para estudiantes:</span>
                <TypingText />
              </div>

              <p className="mt-14 text-gray-500 text-sm max-w-xl italic dark:text-white/50">
                “{quote}”
              </p>
            </div>
          </motion.section>

          {/* RIGHT */}
          <motion.section
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-black/5 bg-white/75 backdrop-blur-xl shadow-[0_20px_70px_-28px_rgba(17,24,39,0.35)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_90px_-35px_rgba(0,0,0,0.62)]">
                {/* Glow */}
                <div className="absolute -top-14 -right-14 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-400/12" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10" />

                {/* ✅ IMPORTANTE: NO ponemos título/subtítulo aquí para evitar duplicados.
                    RegisterForm ya lo renderiza. */}
                <div className="relative p-6 sm:p-8">
                  <RegisterForm />
                </div>
              </div>

              {/* ✅ También quitamos el link externo: si RegisterForm ya tiene “Inicia sesión”, aquí NO va */}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
