// src/app/referidos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ReferralCard from '@/components/ReferralCard'
import { Loader2 } from 'lucide-react'

export default function ReferidosPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
 supabase.auth.getUser().then(({ data }) => {

      setUserId(data?.user?.id || null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600 dark:text-yellow-400" />
      </div>
    )
  }

  if (!userId) {
    return <p className="text-center text-gray-500 mt-10">Inicia sesión para ver tu código de referido.</p>
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">
      <ReferralCard userId={userId} />
    </main>
  )
}
