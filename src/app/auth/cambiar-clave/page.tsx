// src/app/auth/cambiar-clave/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

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
        // 1) Si viene code (PKCE), intercambiamos sesión aquí mismo
        const code = searchParams?.get('code')
        const type = searchParams?.get('type') // puede venir o no

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        // 2) Confirmar sesión
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        const session = data.session

        // Si NO hay sesión, link inválido/expirado
        if (!session) {
          toast.error('Tu enlace expiró o no es válido. Solicita uno nuevo.')
          router.replace('/auth/send-reset')
          return
        }

        // 3) Validación estricta: solo permitir si es un flujo de RECOVERY
        // - Si viene `type=recovery` -> OK
        // - Si no viene type, aceptamos solo si el usuario tiene `recovery_sent_at`
        const isRecovery = type === 'recovery' || Boolean(session.user?.recovery_sent_at)

        if (!isRecovery) {
          // Estabas logueado normal y entraste aquí: NO permitir
          toast.error('Este enlace no corresponde a recuperación de contraseña.')
          router.replace('/')
          return
        }

        if (!mounted) return
        setChecking(false)
      } catch (e: any) {
        console.error('[CAMBIAR_CLAVE] error:', e)
        toast.error(e?.message || 'No se pudo validar el enlace de recuperación.')
        router.replace('/auth/send-reset')
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
      toast.error('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Contraseña actualizada con éxito 🎉')

    // Recomendado: cerrar sesión para re-login
    await supabase.auth.signOut()
    router.replace('/iniciar-sesion')
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Validando enlace...</span>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted">
      <div className="text-center mb-8 max-w-md">
        <div className="text-5xl mb-3">🔑</div>
        <h1 className="text-3xl font-bold mb-2">Cambia tu contraseña</h1>
        <p className="text-muted-foreground text-base">Ingresa tu nueva contraseña segura.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900/90 backdrop-blur p-8 rounded-3xl shadow-2xl space-y-6"
      >
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar nueva contraseña'}
        </button>
      </form>
    </section>
  )
}
