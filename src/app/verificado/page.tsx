'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import successAnimation from '@/assets/animations/verify-success.json'
import errorAnimation from '@/assets/animations/error-warning.json'
import welcomeAnimation from '@/assets/animations/welcome-lottie.json'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ResendButton from '@/components/ResendButton'
import { usePostAuthRedirect } from '@/hooks/usePostAuthRedirect'
import { supabase } from '@/lib/supabase'

export default function VerificadoPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [email, setEmail] = useState('')
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false)

  useEffect(() => {
    const procesarVerificacion = async () => {
      const rawParams = window.location.search || window.location.hash.replace('#', '?')
      const params = new URLSearchParams(rawParams)

      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const emailFromUrl = params.get('email')

      if (emailFromUrl) setEmail(emailFromUrl)

      if (!access_token || !refresh_token) {
        toast.error('❌ Enlace inválido o incompleto')
        setStatus('error')
        return
      }

      // Guardar tokens
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // Restaurar sesión directamente para evitar error en el contexto
      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      if (error) {
        toast.error('❌ Error al restaurar la sesión')
        setStatus('error')
        return
      }

      // Limpiar flag de bienvenida
      sessionStorage.removeItem('welcome_shown')
    }

    procesarVerificacion()
  }, [])

  usePostAuthRedirect({
    redirectIfNew: '/onboarding',
    redirectIfExisting: '/dashboard',
    showWelcome: true,
    requireTokens: true,
    onStatusChange: setStatus,
    onShowWelcome: () => {
      const alreadyShown = sessionStorage.getItem('welcome_shown')
      if (!alreadyShown) {
        setMostrarBienvenida(true)
        sessionStorage.setItem('welcome_shown', 'true')
      }
    },
  })

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-[#f9f9fb] to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.p key="loading" className="text-gray-500 dark:text-gray-400 text-lg">
              Verificando...
            </motion.p>
          )}

          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Lottie animationData={successAnimation} className="h-48 mx-auto mb-4" loop={false} />
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                ¡Cuenta verificada con éxito!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Redirigiéndote...</p>

              {mostrarBienvenida && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <Lottie animationData={welcomeAnimation} className="h-40 mx-auto" loop={false} />
                  <p className="text-lg font-medium text-primary mt-2">
                    ¡Bienvenido a StudyDocu! 🚀
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Lottie animationData={errorAnimation} className="h-48 mx-auto mb-4" loop={false} />
              <h1 className="text-2xl font-semibold text-red-600 mb-2">Verificación fallida</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                El enlace no es válido o ha expirado.
              </p>
              {email && (
                <div className="mb-4">
                  <ResendButton email={email} />
                </div>
              )}
              <Button variant="outline" onClick={() => router.push('/registrarse')}>
                Volver al registro
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
