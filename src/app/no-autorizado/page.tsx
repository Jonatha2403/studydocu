'use client'

import { useRouter } from 'next/navigation'
import { ShieldOff, Crown } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function NoAutorizadoPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-24 px-6 py-12 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-5">
          <ShieldOff className="text-red-500 dark:text-red-400" size={50} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Acceso Denegado
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Esta sección es exclusiva para miembros con una suscripción <span className="font-semibold text-purple-600 dark:text-purple-400">premium activa</span>.
        </p>

        <button
          onClick={() => router.push('/premium')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          <Crown size={18} />
          Obtener Premium
        </button>
      </div>
    </DashboardLayout>
  )
}
