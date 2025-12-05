// ✅ Archivo corregido: src/app/onboarding/page.tsx
'use client'

import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import Lottie from 'lottie-react'
import { CheckCircle, MailCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import Particles from '@/components/ParticlesBackground'
import rocketSuccess from '@/assets/animations/success.json'

const STEPS = ['Registro', 'Verificar email', 'Intereses', '¡Listo!'] as const
const INTEREST_TAGS = ['Matemáticas', 'Programación', 'Idiomas', 'Finanzas', 'Psicología', 'Ingeniería'] as const

const MOTIVATIONAL: Record<number, string> = {
  1: 'Un paso más para comenzar tu viaje de aprendizaje 🚀',
  2: '¡Selecciona tus intereses favoritos! 📚',
  3: 'Guardando tus preferencias para personalizar tu experiencia',
  4: '¡Estás dentro! Disfruta de todo lo que StudyDocu tiene para ti'
}

function StepIndicator({ current }: { current: number }) {
  const progress = (current - 1) / (STEPS.length - 1) * 100
  return (
    <div className="mb-8 select-none">
      <div className="flex items-center justify-center w-full">
        {STEPS.map((label, idx) => {
          const active = current === idx + 1
          return (
            <Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors
                    ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-300/70 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {idx + 1}
                </div>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 hidden sm:inline-block">
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />}
            </Fragment>
          )
        })}
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-purple-600"
          style={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}

function TagChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors shadow-sm border focus:outline-none
        ${selected ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-transparent'}`}
    >
      {label}
    </motion.button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, perfil, refrescarUsuario } = useUserContext()

  const [step, setStep] = useState(1)
  const [intereses, setIntereses] = useState<string[]>([])
  const [emailVerified, setEmailVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (perfil?.onboarding_complete) router.replace('/dashboard')
  }, [perfil, router])

  useEffect(() => {
    const storedStep = sessionStorage.getItem('onboarding_step')
    if (storedStep) setStep(Number(storedStep))
  }, [])

  useEffect(() => {
    sessionStorage.setItem('onboarding_step', String(step))
  }, [step])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) router.replace('/registrarse')
      else setChecking(false)
    }
    checkUser()
  }, [])

  useEffect(() => {
    if (user?.confirmed_at && step === 1) {
      setEmailVerified(true)
      setStep(2)
    }
  }, [user, step])

  const toggleTag = (tag: string) => {
    setIntereses(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const resendVerification = async () => {
    if (!user?.email) return
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email })
    error ? toast.error('Error al reenviar correo') : toast.success('Correo reenviado ✅')
  }

  const checkVerification = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) return toast.error('Error comprobando verificación')
    if (data.user?.confirmed_at) {
      setEmailVerified(true)
      setStep(2)
    } else toast.error('Aún no has verificado tu correo')
  }

  const finalizarSeleccion = () => {
    if (intereses.length === 0) return toast.error('Selecciona al menos un interés')
    setStep(3)
  }

  const completarOnboarding = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      await refrescarUsuario()

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true, intereses, points: 50 })
        .eq('id', user.id)

      if (updateError) throw updateError

      await supabase.from('user_tags').delete().eq('user_id', user.id)
      await supabase.from('user_tags').insert(intereses.map(tag => ({ user_id: user.id, tag })))

      supabase.from('audit_logs').insert({ user_id: user.id, action: 'onboarding_complete', description: 'El usuario completó el onboarding y seleccionó intereses.', metadata: { intereses } })
      supabase.from('user_achievements').insert({ user_id: user.id, achievement_key: 'bienvenida', unlocked: true })
      supabase.from('ai_context').insert({ user_id: user.id, context: intereses.join(', ') })

      toast.success('Preferencias guardadas ✅')
      setStep(4)
      sessionStorage.removeItem('onboarding_step')
    } catch (err) {
      console.error('❌ Error en onboarding:', err)
      toast.error('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 relative overflow-hidden">
      <Particles className="absolute inset-0 -z-10" />
      <div className="w-full max-w-lg sm:max-w-xl px-4">
        <div className="sm:hidden fixed top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="rounded-full bg-purple-600 text-white px-4 py-1 text-xs shadow-lg">
            Paso {step} de {STEPS.length}
          </span>
        </div>
        <StepIndicator current={step} />
        <AnimatePresence mode="wait">
          {step === 1 && !emailVerified && (
            <motion.section key="verify" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl text-center">
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{MOTIVATIONAL[1]}</p>
              <MailCheck className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Verifica tu correo</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Hemos enviado un enlace a <strong>{user?.email}</strong>.</p>
              <div className="flex flex-col gap-3">
                <button onClick={resendVerification} className="rounded-xl bg-indigo-500 px-6 py-2 text-white hover:opacity-90">Reenviar correo</button>
                <button onClick={checkVerification} className="rounded-xl bg-purple-600 px-6 py-2 text-white hover:opacity-90">Ya verifiqué 🚀</button>
              </div>
            </motion.section>
          )}

          {step === 2 && emailVerified && (
            <motion.section key="interests" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl text-center">
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{MOTIVATIONAL[2]}</p>
              <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">¿Qué temas te interesan más?</h2>
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {INTEREST_TAGS.map(tag => (
                  <TagChip key={tag} label={tag} selected={intereses.includes(tag)} onToggle={() => toggleTag(tag)} />
                ))}
              </div>
              <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
                🔒 Tus intereses se guardan solo para personalizar tu experiencia.
              </p>
              <button disabled={intereses.length === 0} onClick={finalizarSeleccion} className="rounded-xl bg-indigo-600 px-6 py-2 text-white hover:opacity-90 disabled:opacity-40">
                Finalizar selección
              </button>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section key="saving" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl text-center">
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{MOTIVATIONAL[3]}</p>
              {loading ? (
                <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-indigo-600" />
              ) : (
                <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-500" />
              )}
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">¡Todo listo!</h2>
              <p className="mb-6 text-gray-500 dark:text-gray-400">Guardando tus preferencias...</p>
              <button onClick={completarOnboarding} disabled={loading} className="rounded-xl bg-purple-600 px-6 py-2 text-white hover:opacity-90 disabled:opacity-50">
                {loading ? 'Guardando...' : 'Empezar ahora 🚀'}
              </button>
            </motion.section>
          )}

          {step === 4 && (
            <motion.section key="success" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl text-center">
              <Confetti recycle={false} numberOfPieces={300} className="pointer-events-none" />
              <Lottie animationData={rocketSuccess} loop={false} className="mx-auto h-56 w-56" />
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{MOTIVATIONAL[4]}</p>
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">¡Bienvenido a StudyDocu!</h2>
              <p className="text-gray-500 dark:text-gray-400">🎖 Ganaste tu primera medalla por registrarte. Redirigiéndote a tu dashboard...</p>
              <div className="mt-6">
                <button onClick={() => router.push('/dashboard')} className="rounded-xl bg-indigo-600 px-6 py-2 text-white hover:opacity-90">
                  Ir al dashboard
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
