'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Lottie from 'lottie-react'
import errorAnim from '@/assets/animations/error.json'
import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function ErrorPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada correctamente')
    router.push('/ingresar')
  }

  useEffect(() => {
    // Puedes registrar en audit_logs si tienes el usuario
    supabase.from('audit_logs').insert([{
      action: 'Pantalla de error',
      context: 'Fallo al cargar perfil en /useSession',
      created_at: new Date().toISOString()
    }])
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="w-52 h-52 mb-4">
          <Lottie animationData={errorAnim} loop autoplay />
        </div>

        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
          <AlertTriangle size={28} />
          <h1 className="text-3xl font-bold">Error al cargar tu perfil</h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
          No pudimos recuperar tus datos. Puedes intentar recargar, cerrar sesión o contactarnos.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Button variant="primary" onClick={() => router.refresh()}>
            🔄 Reintentar
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            🚪 Cerrar sesión
          </Button>

          <Button variant="ghost" onClick={() => router.push('/')}>
            🏠 Volver al inicio
          </Button>

          <a
            href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20tengo%20problemas%20con%20mi%20perfil"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 dark:text-green-400 underline mt-1"
          >
            ¿Necesitas ayuda? Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
