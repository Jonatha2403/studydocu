'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle, KeyRound } from 'lucide-react'
import PasswordResetForm from '@/components/auth/PasswordResetForm'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const hasError = Boolean(searchParams?.get('error'))

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 px-4 py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_18%_14%,rgba(99,102,241,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_82%_20%,rgba(6,182,212,0.14),transparent_62%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-indigo-200 bg-white/90 shadow-sm">
            <KeyRound className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Restablecer contrasena
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base">
            Ingresa tu correo y te enviaremos un enlace seguro para cambiar tu contrasena.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
          {hasError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p>El enlace no es valido o expiro. Solicita uno nuevo.</p>
            </div>
          )}

          <PasswordResetForm />

          <p className="mt-4 text-center text-xs text-slate-500">
            Si no recibes el correo, revisa spam o vuelve a intentarlo en 1 minuto.
          </p>
        </div>
      </div>
    </section>
  )
}
