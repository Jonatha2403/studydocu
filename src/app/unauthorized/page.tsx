'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Lottie from 'lottie-react'
import warningAnim from '@/assets/animations/unauthorized.json' // Asegúrate de tener este archivo

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-black">
      <div className="w-56 h-56 mb-6">
        <Lottie animationData={warningAnim} loop autoplay />
      </div>

      <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">Acceso denegado</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        No tienes permiso para acceder a esta sección.
      </p>

      <Button variant="primary" onClick={() => router.push('/')}>
        🏠 Volver al inicio
      </Button>
    </main>
  )
}
