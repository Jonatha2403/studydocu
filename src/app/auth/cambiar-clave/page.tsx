'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { KeyRound, Loader2, Lock } from 'lucide-react'

export default function CambiarClavePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        const code = searchParams?.get('code')
        const type = searchParams?.get('type')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        const session = data.session
        if (!session) {
          toast.error('El enlace expiro o no es valido. Solicita uno nuevo.')
          router.replace('/auth/reset-password?error=token')
          return
        }

        const isRecovery = type === 'recovery' || Boolean(session.user?.recovery_sent_at)
        if (!isRecovery) {
          toast.error('Este enlace no corresponde a recuperacion de contrasena.')
          router.replace('/')
          return
        }

        if (!mounted) return
        setChecking(false)
      } catch (e: any) {
        console.error('[CAMBIAR_CLAVE] error:', e)
        toast.error(e?.message || 'No se pudo validar el enlace de recuperacion.')
        router.replace('/auth/reset-password?error=token')
      }
    }

    void run()

    return () => {
      mounted = false
    }
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Las contrasenas no coinciden.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Contrasena actualizada con exito.')

    await supabase.auth.signOut()
    window.location.replace('/iniciar-sesion?reset=ok')
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Validando enlace...
        </div>
      </div>
    )
  }

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
            Cambia tu contrasena
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base">
            Ingresa una nueva contrasena segura para tu cuenta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Nueva contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 pl-10 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Confirmar contrasena"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 pl-10 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar nueva contrasena'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
