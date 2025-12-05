'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import successAnimation from '@/assets/animations/verify-success.json'
import welcomeAnimation from '@/assets/animations/welcome-lottie.json'
import errorAnimation from '@/assets/animations/error-warning.json'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function VerificadoOAuthPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false)

  useEffect(() => {
    if (status !== 'loading') return

    const verificarUsuario = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      const user = authData?.user

      if (authError || !user) {
        toast.error('No se pudo obtener el usuario')
        setStatus('error')
        return
      }

      // Buscar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Caso 1: No existe perfil (error: PGRST116)
      if (profileError?.code === 'PGRST116') {
        const result = await supabase.from('profiles').insert([{
          id: user.id,
          email: user.email,
          username: user.email?.split('@')[0],
          points: 50,
          onboarding_complete: false,
          created_at: new Date().toISOString()
        }])

        if (result.error) {
          console.error('❌ Error al crear perfil:', result.error)
          toast.error('Error al crear tu perfil.')
          setStatus('error')
          return
        }

        toast.success('🎉 ¡Cuenta creada exitosamente!')
        localStorage.setItem('welcome_shown', 'true')
        setMostrarBienvenida(true)
        setStatus('success')
        await sleep(3000)
        router.push('/onboarding')
        return
      }

      // Caso 2: Ya existe perfil pero no completó el onboarding
      if (profile && profile.onboarding_complete === false) {
        toast('Continúa con tu onboarding ✨')
        setStatus('success')
        await sleep(2000)
        router.push('/onboarding')
        return
      }

      // Caso 3: Perfil completo
      toast.success('Bienvenido de vuelta 👋')
      setStatus('success')
      await sleep(2000)
      router.push('/dashboard')
    }

    verificarUsuario()
  }, [status, router])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-[#f9f9fb] to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
      >
        {status === 'loading' && (
          <p className="text-gray-500 dark:text-gray-400 text-lg">Verificando cuenta...</p>
        )}

        {status === 'success' && mostrarBienvenida && (
          <>
            <Lottie animationData={successAnimation} className="h-44 mx-auto mb-2" loop={false} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              ¡Cuenta verificada!
            </h2>
            <Lottie animationData={welcomeAnimation} className="h-40 mx-auto" loop={false} />
            <p className="text-lg font-medium text-primary mt-2">¡Bienvenido a StudyDocu! 🚀</p>
          </>
        )}

        {status === 'error' && (
          <>
            <Lottie animationData={errorAnimation} className="h-44 mx-auto mb-2" loop={false} />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error al verificar</h2>
            <p className="text-gray-600 dark:text-gray-300">Intenta iniciar sesión nuevamente.</p>
          </>
        )}
      </motion.div>
    </main>
  )
}
