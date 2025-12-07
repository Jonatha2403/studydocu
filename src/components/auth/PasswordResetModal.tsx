'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import Lottie from 'lottie-react'
import emailAnim from '@/assets/animations/email-send.json'

interface Props {
  onClose: () => void
}

export default function PasswordResetModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendReset = async () => {
    if (!email) {
      toast.error('Ingresa tu correo electrónico')
      return
    }
    setLoading(true)

    try {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '')

      // 🚀 Ruta correcta: ir DIRECTO a /auth/reset-password
      const redirectTo = `${origin}/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo,
        }
      )

      if (error) {
        toast.error(error.message || '❌ No se pudo enviar el correo de recuperación')
      } else {
        toast.success('📩 Revisa tu correo para restablecer tu contraseña')
        onClose()

        // Auditoría no bloqueante
        fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Recuperación de contraseña solicitada',
            details: { email },
            page: '/auth/reset-password',
          }),
        }).catch(() => {})
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 relative"
      >
        <Lottie animationData={emailAnim} className="h-24 mx-auto mb-2" loop={false} />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Mail className="text-purple-500" size={22} />
            Recuperar contraseña
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white text-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendReset}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
