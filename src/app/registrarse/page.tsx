// src/app/registrarse/page.tsx
'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  // ✅ Palabras que “corren”
  const words = useMemo(() => ['exámenes', 'resúmenes', 'mapas conceptuales', 'y mucho más…'], [])

  // ✅ Frases originales que rotan (no copiadas)
  const quotes = useMemo(
    () => [
      'Un buen hábito hoy vale más que mil planes mañana.',
      'Estudia con intención: lo simple, repetido, se vuelve poder.',
      'Tu avance no se mide en horas, se mide en constancia.',
    ],
    []
  )

  const [idx, setIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), 1700)
    return () => clearInterval(t)
  }, [words.length])

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % quotes.length), 4200)
    return () => clearInterval(t)
  }, [quotes.length])

  return (
    <main className="relative min-h-screen w-full bg-[#070B18] overflow-hidden">
      {/* Fondo gradients (mismo “mood” StudyDocu) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_18%_35%,rgba(59,130,246,0.38),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_82%_22%,rgba(34,211,238,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(850px_520px_at_50%_92%,rgba(34,211,238,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10 lg:py-16">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            {/* chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              Únete a más de <b className="text-white">1 millón</b> de estudiantes
            </div>

            <div className="mt-6">
              {/* LOGO texto con acento StudyDocu */}
              <div className="text-white/90 text-3xl sm:text-4xl font-semibold tracking-tight">
                Study<span className="text-cyan-400">Docu</span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Todas las herramientas para <br />
                <span className="text-cyan-300">el éxito académico</span>
              </h1>

              <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-xl">
                Organiza tus documentos, estudia con IA y encuentra recursos por universidad,
                carrera y materia. Todo en un solo lugar.
              </p>

              {/* ✅ Línea que corre */}
              <div className="mt-8 text-white/80 text-lg flex items-center gap-2 flex-wrap">
                <span>Herramientas de IA para estudiantes:</span>

                <span className="relative inline-flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[idx]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="text-cyan-300 font-semibold"
                    >
                      {words[idx]}
                    </motion.span>
                  </AnimatePresence>

                  {/* cursor */}
                  <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-300/80 animate-pulse" />
                </span>
              </div>

              {/* ✅ Quote rotando (original) */}
              <div className="mt-16 text-white/55 text-sm max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quotes[qIdx]}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                  >
                    “{quotes[qIdx]}”
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* RIGHT */}
          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.65)]">
                <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/12 blur-3xl" />

                <div className="relative p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">Crear Cuenta</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Comienza tu viaje hacia el éxito académico
                    </p>
                  </div>

                  <div className="mt-6">
                    <RegisterForm />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-cyan-300">
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
