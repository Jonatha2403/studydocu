'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'

export function useMembership() {
  const { user } = useUserContext()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setIsPremium(false)
      setLoading(false)
      return
    }

    const fetchMembership = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('user_memberships')
          .select('plan, expires_at')
          .eq('user_id', user.id)
          // 👇 Verifica que tengas este campo o elimínalo
          // .eq('status', 'active')
          .order('expires_at', { ascending: false }) // Para tomar la más reciente
          .limit(1)
          .maybeSingle() // 👈 evita errores si no hay registros

        if (error) {
          console.warn('❌ Error al obtener membresía:', error.message)
          setIsPremium(false)
        } else if (data) {
          const notExpired = !data.expires_at || new Date(data.expires_at) > new Date()
          setIsPremium(data.plan === 'premium' && notExpired)
        } else {
          setIsPremium(false) // no hay membresía
        }
      } catch (err) {
        console.error('❌ Error inesperado en useMembership:', err)
        setIsPremium(false)
      } finally {
        setLoading(false)
      }
    }

    fetchMembership()
  }, [user?.id])

  return { isPremium, loading }
}
