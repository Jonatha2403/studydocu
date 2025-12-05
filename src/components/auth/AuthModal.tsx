'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import PasswordResetModal from './PasswordResetModal'
import Lottie from 'lottie-react'
import loginAnim from '@/assets/animations/login-lock.json'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { sumarPuntos, registrarLogro, checkMissions } from '@/lib/gamification'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const router = useRouter()

  const logAudit = async (action: string, details = {}) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details, page: '/ingresar' }),
      })
    } catch (err) {
      console.warn('No se pudo guardar log de auditoría', err)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('❌ Credenciales incorrectas o usuario no existe')
      await logAudit('Login fallido', { email })
    } else if (data.user) {
      toast.success('✅ Inicio de sesión exitoso')
      await logAudit('Login exitoso', { email })

      await sumarPuntos(data.user.id, 5, 'Login exitoso')
      await registrarLogro(data.user.id, 'primer_login')
      await checkMissions(data.user.id)

      onClose()
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }

    setLoading(false)
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/verificado`,
      },
    })

    if (error) toast.error('Error al iniciar sesión con ' + provider)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        <Lottie animationData={loginAnim} className="h-24 mb-4 mx-auto" loop={false} />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🔐</span> Iniciar Sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-4 border-t border-gray-300 dark:border-gray-700 text-center relative">
          <span className="absolute top-[-0.7rem] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">O continúa con</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
            Google
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Image src="/facebook-icon.svg" alt="Facebook" width={18} height={18} />
            Facebook
          </button>
        </div>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <a href="/registrarse" className="text-purple-600 hover:underline font-medium">
            Regístrate aquí
          </a>
        </div>
         <div className="mt-4">
           <button
             onClick={() => router.push('/')}
             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
           >
            🡨 Volver al inicio
           </button>
        </div>


      </motion.div>

      {showResetModal && (
        <PasswordResetModal onClose={() => setShowResetModal(false)} />
      )}
    </div>
  )
}
