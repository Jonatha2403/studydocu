// src/components/auth/LoginForm.tsx
'use client'

import React, { useState } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Si no hay callbackUrl, usamos /dashboard
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
          result?.error ||
          `Error al iniciar sesión (código ${res.status}). Inténtalo de nuevo.`
        toast.error(msg)
        return
      }

      const { session } = result

      if (!session?.access_token || !session?.refresh_token) {
        toast.error('La respuesta del servidor no contiene la sesión.')
        return
      }

      // Guardar sesión en Supabase (cliente)
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })

      // Obtener usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        console.error('[LOGIN_GET_USER_ERROR]', userError)
        toast.error('No se pudo obtener el usuario después de iniciar sesión.')
        return
      }

      const user = userData.user

      // Empezamos con el role desde los metadatos, por si ya está ahí
      let role: string | undefined = user.user_metadata?.role

      // Intentamos buscar perfil para sobreescribir el role si existe
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles') // 👈 si tu tabla es 'profiles', cambia aquí
        .select('role')
        .eq('id', user.id)
        .single()

      if (perfilError) {
        // Solo log, sin toast para no asustar al usuario
        console.error('[LOGIN_GET_PROFILE_ERROR]', perfilError)
      }

      if (perfil?.role) {
        role = perfil.role
      }

      toast.success('¡Sesión iniciada correctamente!')

      // Redirección según role
      let target = callbackUrl || '/dashboard'

      if (role === 'admin') {
        if (callbackUrl && callbackUrl.startsWith('/admin')) {
          target = callbackUrl
        } else {
          target = '/admin'
        }
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

  const loginWithProvider = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/verificado-oauth`,
      },
    })

    if (error) {
      toast.error(`Error con ${provider}: ${error.message}`)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-white dark:bg-gray-900/90 backdrop-blur p-8 rounded-3xl shadow-2xl space-y-6"
    >
      <div className="text-center">
        <div className="text-4xl mb-2 text-indigo-600">🔐</div>
        <h2 className="text-2xl font-bold">Iniciar sesión</h2>
        <p className="text-muted-foreground text-sm">
          Accede a tu cuenta StudyDocu
        </p>
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pl-10 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Recuérdame + olvidaste */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-indigo-500" />
          Recuérdame
        </label>
        <Link
          href="/auth/reset-password"
          className="text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Botón login */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
      </button>

      {/* OR Divider */}
      <div className="text-center text-sm text-muted-foreground">
        o continúa con
      </div>

      {/* Botones OAuth */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => loginWithProvider('google')}
          className="flex items-center justify-center gap-3 px-4 py-2 border rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <img src="/icons/google.svg" alt="Google" className="h-5 w-5" />
          Iniciar sesión con Google
        </button>

        <button
          type="button"
          onClick={() => loginWithProvider('facebook')}
          className="flex items-center justify-center gap-3 px-4 py-2 border rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5" />
          Iniciar sesión con Facebook
        </button>
      </div>

      {/* Redirección */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link href="/registrarse" className="text-purple-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </form>
  )
}
