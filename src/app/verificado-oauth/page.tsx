'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function VerificadoOAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        // Si Supabase devolvió error en la URL
        const errorDescription = searchParams?.get('error_description')
        if (errorDescription) {
          console.error('[OAUTH_ERROR]', errorDescription)
          toast.error(`Error al autenticar: ${errorDescription}`)
          setChecking(false)
          router.push('/iniciar-sesion')
          return
        }

        // Verificar si ya hay sesión guardada
        const { data, error } = await supabase.auth.getSession()
        console.log('[OAUTH_CALLBACK_SESSION]', { error, session: data?.session })

        if (data?.session) {
          toast.success('¡Inicio de sesión exitoso! 🎉')
          // Aquí podrías consultar el perfil y redirigir según rol si quieres
          router.push('/dashboard')
        } else {
          toast.error('No se pudo confirmar tu sesión después de iniciar con Google/Facebook.')
          router.push('/iniciar-sesion')
        }
      } catch (e) {
        console.error('[OAUTH_CALLBACK_FATAL]', e)
        toast.error('Ocurrió un error procesando el inicio de sesión.')
        router.push('/iniciar-sesion')
      } finally {
        setChecking(false)
      }
    }

    void run()
  }, [router, searchParams])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
        <h1 className="text-lg font-semibold mb-2">
          Completando inicio de sesión…
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estamos confirmando tus credenciales de Google/Facebook.
          {checking && ' Esto suele tomar solo unos segundos.'}
        </p>
      </div>
    </main>
  )
}
