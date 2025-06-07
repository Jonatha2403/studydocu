'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from './useSession'

export function useMembership() {
  const { user } = useSession()
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
      const { data, error } = await supabase
        .from('user_memberships')
        .select('plan, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (!error && data) {
        const notExpired = !data.expires_at || new Date(data.expires_at) > new Date()
        setIsPremium(data.plan === 'premium' && notExpired)
      } else {
        setIsPremium(false)
      }

      setLoading(false)
    }

    fetchMembership()
  }, [user?.id])

  return { isPremium, loading }
}
