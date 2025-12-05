'use client'

import { useRouter } from 'next/navigation'
import { ShieldOff, Crown } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function NoAutorizadoPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-24 px-6 py-12 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl transition-all">
        <div className="flex justify-center mb-6">
          <ShieldOff className="text-red-500 dark:text-red-400" size={52} aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Acceso denegado
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Esta sección es exclusiva para usuarios con una suscripción{' '}
          <span className="font-semibold text-purple-600 dark:text-purple-400">Premium activa</span>.
        </p>

        <button
          onClick={() => router.push('/premium')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          aria-label="Ir a la página de Premium"
        >
          <Crown size={18} />
          Obtener Premium
        </button>
      </div>
    </DashboardLayout>
  )
}
