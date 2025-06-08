// src/hooks/useUserStatus.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useUserStatus() {
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const fetchUserStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return setLoading(false)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const { data: membership } = await supabase
        .from('user_memberships')
        .select('plan, expires_at')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single()

      setRole(profile?.role ?? null)
      setIsPremium(
        membership?.plan === 'premium' &&
          (!membership.expires_at || new Date(membership.expires_at) > new Date())
      )

      setLoading(false)
    }

    fetchUserStatus()
  }, [])

  return { loading, role, isPremium }
}
