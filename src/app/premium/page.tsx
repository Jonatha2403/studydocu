'use client'

import { useEffect, useState } from 'react'
import { Sparkles, ShieldCheck, Crown, BadgeCheck } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function PremiumPage() {
  const { user } = useSession()
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const fetchMembership = async () => {
      if (!user) return
      const { data } = await supabase
        .from('user_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()
      setIsPremium(!!data)
    }
    fetchMembership()
  }, [user])

  const handleUpgrade = () => {
    toast('💳 Redirigiendo a pasarela de pago...')
    if (typeof window !== 'undefined') {
      window.open('https://paypal.com', '_blank') // reemplaza con tu URL real
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-10 px-6 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="text-yellow-500" size={28} />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Membresía Premium</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Desbloquea todo el potencial de <span className="font-semibold text-blue-600">StudyDocu</span> con acceso ilimitado a funciones exclusivas.
          </p>

          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2"><ShieldCheck className="text-green-500" size={18} /> Descargas ilimitadas</li>
            <li className="flex items-center gap-2"><BadgeCheck className="text-purple-500" size={18} /> IA educativa avanzada</li>
            <li className="flex items-center gap-2"><Sparkles className="text-yellow-500" size={18} /> Soporte prioritario + logros</li>
            <li className="flex items-center gap-2"><Crown className="text-pink-500" size={18} /> Acceso a asesores verificados</li>
          </ul>

          {isPremium ? (
            <div className="mt-4 text-green-600 font-semibold">🎉 Ya eres usuario Premium. ¡Gracias por tu apoyo!</div>
          ) : (
            <Button
              onClick={handleUpgrade}
              className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-2 rounded-xl"
            >
              💳 Hacerse Premium
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
