// src/components/auth/PasswordResetForm.tsx
'use client'

import { useMemo, useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

// Función helper para obtener la URL base del sitio
function getSiteUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback para build / ambientes donde no hay window
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'
}

export default function PasswordResetForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  )

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      toast.error('Ingresa un correo válido')
      return
    }
    if (loading) return

    setLoading(true)

    try {
      const origin = getSiteUrl()
      const redirectTo = `${origin}/auth/callback?type=recovery&next=/auth/reset-password`

      const value = email.trim().toLowerCase()

      const { error } = await supabase.auth.resetPasswordForEmail(value, {
        redirectTo,
      })

      if (error) {
        if (/spam|rate|too many/i.test(error.message)) {
          toast.error(
            'Has solicitado demasiados enlaces. Intenta nuevamente en unos minutos.'
          )
        } else if (/not found/i.test(error.message)) {
          toast.error('No encontramos ese correo. Verifica y vuelve a intentar.')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Te enviamos un enlace para restablecer tu contraseña.')
      setEmail('')
    } catch (err) {
      console.error('[RESET_PASSWORD]', err)
      toast.error('Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin inline-block" />
        ) : (
          'Enviar enlace'
        )}
      </button>
    </form>
  )
}
