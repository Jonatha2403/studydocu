'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMembership } from '@/hooks/useMembership'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PremiumBadge from '@/components/PremiumBadge'
import { Lock } from 'lucide-react'

export default function PremiumAreaPage() {
  const router = useRouter()
  const { isPremium, loading } = useMembership()

  useEffect(() => {
    if (!loading && !isPremium) {
      router.push('/no-autorizado')
    }
  }, [loading, isPremium, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          ⏳ Verificando acceso premium...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-yellow-500" size={28} />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Zona Premium <PremiumBadge />
          </h1>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-md space-y-5">
          <p className="text-gray-700 dark:text-gray-300 text-base">
            🎉 ¡Bienvenido! Esta sección es exclusiva para usuarios con membresía activa. Aquí encontrarás:
          </p>

          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
            <li>📘 Acceso a documentos académicos premium</li>
            <li>📬 Asesoría personalizada con tutores verificados</li>
            <li>📥 Descargas ilimitadas sin esperas</li>
            <li>✨ Funcionalidades anticipadas y exclusivas</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
