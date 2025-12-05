'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConfirmarCuentaPage() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const email = searchParams?.get('email')
  const router = useRouter()

  const [estado, setEstado] = useState<'loading' | 'success' | 'error'>('loading')
  const [reenviado, setReenviado] = useState<string | null>(null)
  const [reenviando, setReenviando] = useState(false)

  useEffect(() => {
    const confirmarCuenta = async () => {
      if (!token || !email) {
        setEstado('error')
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token,
        type: 'signup',
        email,
      })

      if (error) {
        console.error('❌ Error al confirmar cuenta:', error.message)
        setEstado('error')
      } else {
        setEstado('success')

        // Log opcional
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Cuenta confirmada desde /confirmar',
            details: { email },
            page: '/confirmar',
          }),
        })

        setTimeout(() => router.push('/verificado'), 3000)
      }
    }

    confirmarCuenta()
  }, [token, email, router])

  const reenviarConfirmacion = async () => {
    if (!email) return
    setReenviando(true)
    setReenviado(null)

    const res = await fetch('/api/auth/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'temporal123' }) // puedes personalizar esto si manejas contraseña
    })

    const data = await res.json()
    if (res.ok) {
      setReenviado('📨 Correo reenviado. Revisa tu bandeja de entrada.')
    } else {
      setReenviado(`❌ ${data.error || 'No se pudo reenviar el correo.'}`)
    }

    setReenviando(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md w-full"
      >
        {estado === 'loading' && (
          <>
            <Loader2 className="animate-spin w-10 h-10 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Verificando tu cuenta...</p>
          </>
        )}

        {estado === 'success' && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-green-600">✅ Cuenta verificada</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Serás redirigido al panel en unos segundos...
            </p>
          </>
        )}

        {estado === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-600">Error al verificar</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              El enlace no es válido o ha expirado.
            </p>

            <button
              onClick={reenviarConfirmacion}
              disabled={reenviando}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium transition hover:opacity-90 active:scale-95"
            >
              {reenviando ? 'Enviando...' : '📨 Reenviar correo de confirmación'}
            </button>
            {reenviado && <p className="text-sm text-gray-500 mt-2">{reenviado}</p>}
          </>
        )}
      </motion.div>
    </main>
  )
}
