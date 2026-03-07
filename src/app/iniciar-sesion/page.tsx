'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import LoginForm from '@/components/auth/LoginForm'
import { useUserContext } from '@/context/UserContext'
import { supabase } from '@/lib/supabase/client'

const WORDS = ['tu panel', 'tus documentos', 'tus favoritos', 'tu progreso']
const QUOTES = [
  'Tu progreso se construye en cada sesion de estudio.',
  'Un paso a la vez, pero todos los dias.',
  'Organiza hoy, avanza manana.',
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
    <span className="font-semibold text-cyan-600">
      {text}
      <span className="ml-1 inline-block h-5 w-2 animate-pulse align-middle bg-cyan-500/70" />
    </span>
  )
}

const hasAnyInterests = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.some((v) => String(v ?? '').trim().length > 0)
  }
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw || raw === '[]' || raw === '{}' || raw === 'null') return false
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.some((v) => String(v ?? '').trim().length > 0)
      }
      return false
    } catch {
      return raw.split(',').some((v) => v.trim().length > 0)
    }
  }
  return false
}

export default function LoginPage() {
  const [qIdx, setQIdx] = useState(0)
  const quote = useMemo(() => QUOTES[qIdx % QUOTES.length], [qIdx])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, perfil, loading } = useUserContext()

  const resetDone = searchParams?.get('reset') === 'ok'

  useEffect(() => {
    if (!resetDone) return
    void supabase.auth.signOut()
  }, [resetDone])

  useEffect(() => {
    if (loading || !user || resetDone) return

    const hasIntereses = hasAnyInterests((perfil as any)?.intereses)
    const onboardingOk =
      (perfil as any)?.onboarding_complete === true &&
      hasIntereses &&
      Number((perfil as any)?.points ?? 0) >= 50

    router.replace(onboardingOk ? '/dashboard' : '/onboarding')
  }, [loading, user, perfil, router, resetDone])

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % QUOTES.length), 4200)
    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">Cargando StudyDocu...</p>
        </div>
      </main>
    )
  }

  if (!loading && user && !resetDone) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </main>
    )
  }

  const HEADER_H = 88

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#F6F5FF] via-[#F1EDFF] to-[#EAF4FF]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_25%_15%,rgba(124,92,255,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_80%_25%,rgba(56,189,248,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_55%_90%,rgba(92,124,250,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),transparent_25%,transparent_70%,rgba(255,255,255,0.45))] opacity-60" />
      </div>

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: HEADER_H,
          paddingBottom: 24,
          minHeight: `calc(100vh - ${HEADER_H}px)`,
        }}
      >
        <div className="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 text-center lg:order-1 lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Unete a mas de <b className="text-slate-900">1 millon</b> de estudiantes
            </div>

            <div className="mt-8 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Study<span className="text-cyan-600">Docu</span>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Todas las herramientas para <br />
              <span className="bg-gradient-to-r from-[#7C5CFF] via-[#5C7CFA] to-[#38BDF8] bg-clip-text text-transparent">
                el exito academico
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Organiza tus documentos, estudia con IA y encuentra recursos por universidad, carrera
              y materia. Todo en un solo lugar.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2 text-lg text-slate-700 lg:justify-start">
              <span>Herramientas de IA para estudiantes:</span>
              <TypingText />
            </div>

            <p className="mt-12 text-sm italic text-slate-500">&quot;{quote}&quot;</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-black/5 bg-white/80 shadow-[0_18px_55px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7C5CFF]/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/14 blur-3xl" />

                <div className="relative p-8 sm:p-10">
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold text-slate-900">Iniciar sesion</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Accede a tu cuenta para continuar estudiando
                    </p>
                    {resetDone && (
                      <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        Contrasena actualizada. Inicia sesion con tu nueva clave.
                      </p>
                    )}
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
