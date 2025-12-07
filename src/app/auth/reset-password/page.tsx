// src/app/auth/reset-password/page.tsx
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import PasswordResetForm from '@/components/auth/PasswordResetForm'

type Step = 'request' | 'update' | 'error'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<Step>('request')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // 1) Revisar si viene un code de Supabase (link del correo)
  useEffect(() => {
    const code = searchParams?.get('code') ?? null
    const type = searchParams?.get('type') ?? null
    const error = searchParams?.get('error') ?? null


    // Si viene error en la URL (no_session_after_exchange, etc.)
    if (error) {
      setStep('error')
      if (error === 'no_session_after_exchange') {
        setErrorMsg('Token inválido o expirado. Solicita un nuevo correo de recuperación.')
      } else {
        setErrorMsg('Ocurrió un problema al validar el enlace. Solicita un nuevo correo.')
      }
      return
    }

    // Si no hay code ni type=recovery, es la vista normal para pedir el correo
    if (!code || type !== 'recovery') {
      setStep('request')
      return
    }

    // 2) Intercambiar el code por una sesión de recuperación
    const exchange = async () => {
      try {
        setLoading(true)
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('Error exchangeCodeForSession:', error)
          setStep('error')
          setErrorMsg('Token inválido o expirado. Solicita un nuevo correo de recuperación.')
          return
        }

        // Sesión de recuperación creada correctamente → permitir cambiar la contraseña
        setStep('update')
      } finally {
        setLoading(false)
      }
    }

    exchange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // 3) Actualizar la contraseña una vez que ya hay sesión de recuperación
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!password || password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('Error updateUser:', error)
        setErrorMsg('No se pudo actualizar la contraseña. Inténtalo nuevamente.')
        return
      }

      setSuccessMsg('¡Contraseña actualizada correctamente! Ahora puedes iniciar sesión.')
      // Opcional: limpiar campos y redirigir tras unos segundos
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        router.push('/iniciar-sesion')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  // UI según el paso
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted">
      {/* ENCABEZADO GENERAL */}
      <div className="text-center mb-8 max-w-md">
        <div className="text-5xl mb-3">🔒</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Restablecer contraseña
        </h1>

        {step === 'request' && (
          <p className="text-muted-foreground text-base">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        )}

        {step === 'update' && (
          <p className="text-muted-foreground text-base">
            Ingresa tu nueva contraseña para tu cuenta de StudyDocu.
          </p>
        )}

        {step === 'error' && (
          <p className="text-muted-foreground text-base">
            {errorMsg ??
              'Hubo un problema con el enlace de recuperación. Puedes solicitar uno nuevo.'}
          </p>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full max-w-md bg-background shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Paso 1: solicitar correo de recuperación */}
        {step === 'request' && <PasswordResetForm />}

        {/* Paso 2: actualizar contraseña después del link */}
        {step === 'update' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium">Nueva contraseña</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-medium">Confirmar contraseña</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-sm text-emerald-600">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar nueva contraseña
            </button>
          </form>
        )}

        {/* Paso 3: error → mostramos mensaje y el form para volver a pedir correo */}
        {step === 'error' && (
          <div className="space-y-4">
            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}
            <div className="h-px bg-border my-4" />
            <p className="text-sm text-center text-muted-foreground mb-2">
              ¿Quieres intentarlo de nuevo? Solicita un nuevo enlace:
            </p>
            <PasswordResetForm />
          </div>
        )}

        {loading && step !== 'request' && (
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Procesando solicitud…
          </p>
        )}
      </div>
    </section>
  )
}
