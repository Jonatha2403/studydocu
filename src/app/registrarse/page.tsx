// src/app/registrarse/page.tsx
'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  // ✅ Palabras que “corren”
  const words = useMemo(() => ['exámenes', 'resúmenes', 'mapas conceptuales', 'y mucho más…'], [])

  // ✅ Frases originales que rotan
  const quotes = useMemo(
    () => [
      'Un buen hábito hoy vale más que mil planes mañana.',
      'Aprender se vuelve fácil cuando todo está organizado.',
      'Pequeños avances diarios construyen grandes resultados.',
    ],
    []
  )

  const [idx, setIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), 1600)
    return () => clearInterval(t)
  }, [words.length])

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % quotes.length), 4200)
    return () => clearInterval(t)
  }, [quotes.length])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F6F5FF] dark:bg-[#070B18]">
      {/* Fondo tipo StudyDocu (claro, suave, pro) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light mode */}
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1200px_700px_at_20%_15%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(900px_650px_at_50%_85%,rgba(59,130,246,0.12),transparent_60%)]" />

        {/* Dark mode */}
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_15%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.16),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_88%,rgba(59,130,246,0.10),transparent_60%)]" />

        {/* Sutil “shine” */}
        <div className="absolute inset-0 opacity-70 dark:opacity-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_30%,transparent_70%,rgba(255,255,255,0.35))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_25%,transparent_70%,rgba(255,255,255,0.02))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10 lg:py-16">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 lg:order-1"
          >
            {/* chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              Únete a más de <b className="text-gray-900 dark:text-white">1 millón</b> de
              estudiantes
            </div>

            <div className="mt-6">
              {/* Marca */}
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white/90">
                Study<span className="text-cyan-500 dark:text-cyan-300">Docu</span>
              </div>

              {/* Título estilo homepage */}
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

              {/* ✅ Línea que corre */}
              <div className="mt-8 text-gray-700 text-lg flex items-center gap-2 flex-wrap dark:text-white/80">
                <span>Herramientas de IA para estudiantes:</span>

                <span className="relative inline-flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[idx]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="font-semibold text-cyan-600 dark:text-cyan-300"
                    >
                      {words[idx]}
                    </motion.span>
                  </AnimatePresence>

                  {/* cursor */}
                  <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-500/80 dark:bg-cyan-300/80 animate-pulse" />
                </span>
              </div>

              {/* ✅ Quote rotando */}
              <div className="mt-14 text-gray-500 text-sm max-w-xl dark:text-white/50">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quotes[qIdx]}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    “{quotes[qIdx]}”
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* RIGHT (Card pro) */}
          <motion.section
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-black/5 bg-white/65 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(17,24,39,0.35)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_80px_-30px_rgba(0,0,0,0.60)]">
                {/* glow */}
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-400/12" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10" />

                <div className="relative p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                      Crear Cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                      Comienza tu viaje hacia el éxito académico
                    </p>
                  </div>

                  <div className="mt-6">
                    <RegisterForm />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-indigo-600 dark:text-cyan-300">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/iniciar-sesion" className="font-semibold hover:underline">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
