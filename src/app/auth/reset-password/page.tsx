// src/app/auth/reset-password/page.tsx
'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import PasswordResetForm from '@/components/auth/PasswordResetForm'

type Step = 'request' | 'update' | 'error'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<Step>('request')
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true) // 👈 para el check inicial
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // ✅ Cliente Supabase (lazy + cacheado internamente)
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  // 1) Revisar si hay error en la URL o si existe sesión de recuperación
  useEffect(() => {
    const run = async () => {
      setErrorMsg(null)
      setSuccessMsg(null)
      setBooting(true)

      const urlError = searchParams?.get('error') ?? null

      // Si el callback nos mandó con error
      if (urlError) {
        setStep('error')
        setErrorMsg(
          urlError === 'token'
            ? 'El enlace de recuperación es inválido o ha expirado. Solicita un nuevo correo.'
            : 'Ocurrió un problema al validar el enlace. Solicita un nuevo correo.'
        )
        setBooting(false)
        return
      }

      try {
        // Si venimos del enlace de Supabase, normalmente ya habrá sesión de recovery
        const { data, error: userError } = await supabase.auth.getUser()

        if (!userError && data?.user) {
          setStep('update')
        } else {
          setStep('request')
        }
      } catch (e: any) {
        // Si faltan env vars o falla el cliente, mostramos error controlado
        console.error('[reset-password] boot error:', e)
        setStep('error')
        setErrorMsg(
          'No se pudo inicializar la recuperación. Revisa la configuración del sitio (Supabase).'
        )
      } finally {
        setBooting(false)
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // 2) Actualizar la contraseña
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    const pass = password.trim()
    const pass2 = confirmPassword.trim()

    if (pass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (pass !== pass2) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password: pass })

      if (error) {
        console.error('[reset-password] updateUser error:', error)
        setErrorMsg('No se pudo actualizar la contraseña. Inténtalo nuevamente.')
        return
      }

      setSuccessMsg('¡Contraseña actualizada! Redirigiendo a iniciar sesión…')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/iniciar-sesion')
      }, 1600)
    } catch (err) {
      console.error('[reset-password] fatal:', err)
      setErrorMsg('Error interno. Inténtalo nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted">
      {/* ENCABEZADO */}
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

      {/* CONTENIDO */}
      <div className="w-full max-w-md bg-background shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Loader inicial */}
        {booting && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm text-muted-foreground">Verificando enlace…</p>
          </div>
        )}

        {!booting && (
          <>
            {/* Paso 1: solicitar correo */}
            {step === 'request' && <PasswordResetForm />}

            {/* Paso 2: actualizar contraseña */}
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
                    disabled={loading}
                    autoComplete="new-password"
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
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                {successMsg && <p className="text-sm text-emerald-600">{successMsg}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar nueva contraseña
                </button>
              </form>
            )}

            {/* Paso 3: error + reintento */}
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
          </>
        )}
      </div>
    </section>
  )
}
