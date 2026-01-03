'use client'

import React, { useState } from 'react'
import { Mail, Lock, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      let result: any = null
      try {
        result = await res.json()
      } catch {
        result = null
      }

      if (!res.ok || !result) {
        const msg =
          result?.error || `Error al iniciar sesión (código ${res.status}). Inténtalo de nuevo.`
        toast.error(msg)
        return
      }

      const { session } = result
      if (!session?.access_token || !session?.refresh_token) {
        toast.error('La respuesta del servidor no contiene la sesión.')
        return
      }

      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        console.error('[LOGIN_GET_USER_ERROR]', userError)
        toast.error('No se pudo obtener el usuario después de iniciar sesión.')
        return
      }

      const user = userData.user
      let role: string | undefined = user.user_metadata?.role

      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (perfilError) console.error('[LOGIN_GET_PROFILE_ERROR]', perfilError)
      if (perfil?.role) role = perfil.role

      toast.success('¡Sesión iniciada correctamente!')

      let target = callbackUrl || '/dashboard'
      if (role === 'admin') {
        target = callbackUrl?.startsWith('/admin') ? callbackUrl : '/admin'
      }

      router.push(target)
      router.refresh()
    } catch (err) {
      console.error('[LOGIN_ERROR]', err)
      toast.error('Ocurrió un error inesperado al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/verificado-oauth`,
      },
    })

    if (error) toast.error(`Error con Google: ${error.message}`)
  }

  return (
    <div className="w-full">
      {/* Botones (como tu screenshot) */}
      <div className="space-y-4">
        {/* Google */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="
            w-full h-12 rounded-xl
            bg-white text-slate-900 font-semibold
            flex items-center justify-center gap-3
            shadow-sm hover:bg-white/95 active:scale-[0.99] transition
          "
        >
          <img src="/icons/google.svg" alt="Google" className="h-5 w-5" />
          Continuar con Google
        </button>

        {/* Email toggle */}
        <button
          type="button"
          onClick={() => setShowEmail((v) => !v)}
          className="
            w-full h-12 rounded-xl
            bg-white/10 text-white font-semibold
            border border-white/10
            flex items-center justify-center gap-3
            hover:bg-white/12 active:scale-[0.99] transition
          "
        >
          <Mail className="h-5 w-5 text-white/80" />
          Iniciar sesión con email
          <ChevronDown
            className={`h-4 w-4 text-white/70 transition ${showEmail ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Formulario desplegable */}
      {showEmail && (
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full h-12 pl-11 pr-4 rounded-xl
                bg-white/5 text-white placeholder-white/35
                border border-white/10
                focus:outline-none focus:ring-2 focus:ring-cyan-400/40
              "
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full h-12 pl-11 pr-4 rounded-xl
                bg-white/5 text-white placeholder-white/35
                border border-white/10
                focus:outline-none focus:ring-2 focus:ring-cyan-400/40
              "
            />
          </div>

          <div className="flex items-center justify-between text-sm text-white/60">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-cyan-400" />
              Recuérdame
            </label>

            <Link href="/auth/reset-password" className="text-cyan-300 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-12 rounded-xl
              bg-gradient-to-r from-cyan-500 to-blue-500
              text-white font-semibold
              flex items-center justify-center gap-2
              hover:brightness-110 active:scale-[0.99] transition
              disabled:opacity-60
            "
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      )}

      {/* Registro (como tu screenshot: link abajo) */}
      <div className="mt-6 text-center text-sm text-cyan-300">
        ¿No tienes una cuenta aún?{' '}
        <Link href="/registrarse" className="font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  )
}
