// src/hooks/useSession.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface PerfilExtendido {
  id: string
  username?: string
  puntos?: number
  suscripcion_activa?: boolean
  universidad?: string
  nivel?: string
  medalla?: string

  // ⚠️ Estas propiedades deben estar incluidas para evitar los errores:
  nombre?: string
  carrera?: string
  avatar_url?: string
  role?: string
  subscription_status?: 'Activa' | 'Inactiva' | string
}


export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<PerfilExtendido | null>(null)
  const [loading, setLoading] = useState(true)

  const cargarSesion = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      setUser(null)
      setPerfil(null)
      setLoading(false)
      return
    }

    setUser(userData.user)

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, puntos, suscripcion_activa, universidad')
      .eq('id', userData.user.id)
      .single()

    if (!profileError && profileData) {
      const puntos = profileData.puntos || 0
      let nivel = 'Nuevo'
      let medalla = '🥉 Bronce'

      if (puntos >= 500) {
        nivel = 'Experto'
        medalla = '🥇 Oro'
      } else if (puntos >= 200) {
        nivel = 'Avanzado'
        medalla = '🥈 Plata'
      } else if (puntos >= 50) {
        nivel = 'Explorador'
      }

      setPerfil({ ...profileData, nivel, medalla })
    } else {
      setPerfil(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    cargarSesion()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      cargarSesion()
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, perfil, loading }
}
