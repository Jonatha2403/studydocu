'use client'

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, Lock, LogIn, UserPlus, AlertTriangle, Loader2 } from 'lucide-react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRemember(true)
    }
  }, [])

  const handleAuth = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.')
      return
    }

    setLoading(true)

    try {
      // 🔹 PROTEGEMOS la llamada a Supabase auth
      let authData
      let authError

      try {
        const resp = isLogin
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password })

        authData = resp.data
        authError = resp.error
      } catch (networkErr: any) {
        console.warn('[Auth] Network error al llamar a Supabase auth:', networkErr)
        setError(
          'No se pudo conectar con el servidor de autenticación. ' +
          'Revisa tu conexión a internet o la configuración de Supabase.'
        )
        toast.error('Error de conexión con Supabase.')
        return
      }

      if (authError) {
        setError(authError.message)
        return
      }

      if (remember) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      const user = authData.user || authData.session?.user

      if (user) {
        // 🔹 Carga de perfil/rol separada y con console.warn (para que Next no muestre pantalla roja)
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (profileError) {
            console.warn('[Auth] Error fetching profile for role:', profileError)
            toast.error('No se pudo obtener tu rol. Intenta recargar la página.')
          } else if (profile?.role) {
            const maxAge = 7 * 24 * 60 * 60
            const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
            document.cookie = `sb-user-role=${profile.role}; path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`
          } else {
            console.warn('[Auth] Perfil sin rol o inexistente para usuario:', user.id)
          }
        } catch (e) {
          console.warn('[Auth] Excepción leyendo perfil/rol:', e)
          toast.error('Ocurrió un error al configurar tu sesión.')
        }
      }

      toast.success(isLogin ? '✅ ¡Bienvenido de nuevo!' : '✅ ¡Cuenta creada con éxito!')

      if (!isLogin) {
        toast.info(
          '📬 Revisa tu correo para confirmar tu cuenta si es necesario.',
          { duration: 6000 }
        )
      }

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.info(
      'Si tu correo está registrado y esta función está implementada, recibirás un enlace para restablecer tu contraseña.',
      { duration: 6000 }
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 selection:bg-yellow-400 selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border dark:border-gray-700 p-6 sm:p-8 rounded-lg shadow-xl bg-white dark:bg-gray-800 w-full max-w-md"
      >
        <div className="text-center mb-6">
          {isLogin ? (
            <LogIn className="mx-auto w-12 h-12 text-blue-600 dark:text-yellow-400 mb-2" />
          ) : (
            <UserPlus className="mx-auto w-12 h-12 text-blue-600 dark:text-yellow-400 mb-2" />
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLogin ? 'Ingresa tus credenciales para acceder.' : 'Completa los campos para unirte.'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm mb-4 flex items-center gap-2"
            role="alert"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo electrónico"
              aria-label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 focus:border-blue-500 dark:focus:border-yellow-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 focus:border-blue-500 dark:focus:border-yellow-500"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                Recordar correo
              </label>
            </div>
            {isLogin && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-600 hover:underline dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 text-white w-full py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
