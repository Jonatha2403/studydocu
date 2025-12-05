'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export interface PerfilExtendido {
  id: string
  username?: string
  points?: number
  subscription_active?: boolean
  universidad?: string
  nombre_completo?: string
  carrera?: string
  avatar_url?: string
  role?: string
  tags?: string[]
  subscription_status?: string
}

export function useUserProfile() {
  const { user, loading: userLoading } = useUser()
  const [perfil, setPerfil] = useState<PerfilExtendido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      setPerfil(null)
      return
    }

    const fetchPerfil = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          points,
          ssubscription_active,
          universidad,
          nombre_completo,
          carrera,
          avatar_url,
          role,
          tags,
          subscription_status
        `)
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
        setPerfil(null)
      } else {
        setPerfil(data)
        setError(null)
      }

      setLoading(false)
    }

    fetchPerfil()
  }, [user?.id])

  return { perfil, loading: userLoading || loading, error }
}
