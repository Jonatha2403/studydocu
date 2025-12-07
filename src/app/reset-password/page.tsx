// src/app/reset-password/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, User } from 'lucide-react'
import Lottie from 'lottie-react'
import { supabase } from '@/lib/supabase' // ajusta si usas otra ruta

import unlockAnim from '@/assets/animations/unlock.json'
import successAnim from '@/assets/animations/success.json'

export default function ResetPasswordPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const errorParam = sp?.get('error')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [checking, setChecking] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Mensajes de error desde el callback
  useEffect(() => {
    if (!errorParam) return
    const messages: Record<string, string> = {
      no_code: 'Falta el código del enlace. Solicita uno nuevo.',
      no_session_after_exchange: 'No pudimos crear la sesión. Solicita un nuevo enlace.',
      missing_code: 'Falta el código del enlace. Solicita uno nuevo.',
      exchange_failed: 'Falló el intercambio del código. Intenta otra vez.',
    }
    toast.error(
      messages[errorParam] ??
        'Hubo un problema con el enlace de recuperación.'
    )
  }, [errorParam])

  // Esperar a que Supabase tenga la sesión activa
  useEffect(() => {
    let mounted = true

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      if (data.session) {
        setUserEmail(data.session.user.email ?? '')
        setSessionLoaded(true)
        setChecking(false)
        return
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) return
          if (session) {
            setUserEmail(session.user.email ?? '')
            setSessionLoaded(true)
            setChecking(false)
          }
        }
      )

      const t = setTimeout(() => {
        if (!mounted) return
        if (!sessionLoaded) {
          toast.error('Token inválido o expirado. Solicita uno nuevo.')
          setChecking(false)
        }
      }, 3000)

      return () => {
        clearTimeout(t)
        listener.subscription.unsubscribe()
      }
    })()

    return () => {
      mounted = false
    }
  }, [sessionLoaded])

  const strength = useMemo(() => {
    const pwd = password
    if (pwd.length < 8) return 'Débil'
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)
    if (hasUpper && hasNumber) return 'Segura'
    return 'Aceptable'
  }, [password])

  const handlePasswordUpdate = async () => {
    if (!sessionLoaded) {
      toast.error('No hay una sesión de recuperación activa.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('❌ Las contraseñas no coinciden')
      return
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      toast.error('❌ Mínimo 8 caracteres, 1 mayúscula y 1 número.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        toast.error(
          error.message || '❌ No se pudo actualizar la contraseña'
        )
        return
      }

      // (Opcional) log de auditoría
      ;(async () => {
        try {
          await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'Cambio de contraseña (recovery link)',
              details: { email: userEmail },
              page: '/reset-password',
            }),
          })
        } catch {}
      })()

      // 🔥 CERRAR SESIÓN DESPUÉS DEL CAMBIO
      await supabase.auth.signOut()

      setShowSuccess(true)
      toast.success('¡Contraseña actualizada!')

      // Redirigir al login (ajusta la ruta si usas /ingresar)
      setTimeout(() => router.push('/login'), 1800)
    } finally {
      setLoading(false)
    }
  }

  const disabled = loading || !sessionLoaded

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        {showSuccess ? (
          <div className="text-center flex flex-col items-center gap-4">
            <Lottie animationData={successAnim} className="h-28" loop={false} />
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
              Contraseña actualizada
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 mb-6">
              <Lottie animationData={unlockAnim} className="h-28" loop={false} />
              <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                Restablecer contraseña
              </h1>

              {sessionLoaded && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User size={16} />
                  {userEmail}
                </div>
              )}
            </div>

            {!sessionLoaded ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                {checking
                  ? 'Verificando token de seguridad...'
                  : 'Token inválido o expirado.'}
              </div>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="text-sm mb-4 text-right text-gray-500 dark:text-gray-400">
                  Fortaleza:{' '}
                  <span className="font-semibold">{strength}</span>
                </div>

                <button
                  onClick={handlePasswordUpdate}
                  disabled={disabled}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 className="animate-spin h-4 w-4" />}
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
