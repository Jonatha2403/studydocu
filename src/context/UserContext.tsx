// src/context/UserContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface PerfilExtendido {
  id: string
  username?: string
  email?: string
  points?: number
  subscription_active?: boolean
  universidad?: string
  nivel?: string
  intereses?: string[]
  medalla?: string
  nombre_completo?: string
  carrera?: string
  avatar_url?: string
  role?: string
  verificado?: boolean
  has_new_rewards?: boolean
  onboarding_complete?: boolean
  tags?: string[]
}

interface UserContextType {
  user: User | null
  session: Session | null
  perfil: PerfilExtendido | null
  loading: boolean
  perfilError: boolean
  refrescarUsuario: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUserContext = () => {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUserContext debe usarse dentro de un UserProvider')
  }
  return ctx
}

// Solo para debug en desarrollo (opcional)
async function validarEsquemaProfiles() {
  const expectedColumns = [
    'id',
    'email',
    'nombre_completo',
    'universidad',
    'referido',
    'role',
    'points',
    'subscription_active',
    'onboarding_complete',
    'created_at',
    'username',
    'intereses',
    'avatar_url',
    'carrera',
  ]

  try {
    const { data, error } = await supabase.rpc('pg_table_def', {
      table_name_input: 'profiles',
    })
    if (error) throw error

    const found = (data ?? []).map((c: any) => c.column_name)
    const missing = expectedColumns.filter((c) => !found.includes(c))
    if (missing.length) {
      console.warn(
        '⚠️ Columnas faltantes o mal nombradas en "profiles":',
        missing
      )
    }
  } catch (e) {
    console.error('❌ Error validando esquema profiles:', e)
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [perfil, setPerfil] = useState<PerfilExtendido | null>(null)
  const [loading, setLoading] = useState(true)
  const [perfilError, setPerfilError] = useState(false)

  const limpiarEstado = () => {
    setUser(null)
    setSession(null)
    setPerfil(null)
    setPerfilError(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfil')
    }
  }

  const cargarDatos = async () => {
    setLoading(true)
    setPerfilError(false)

    try {
      if (process.env.NODE_ENV === 'development') {
        await validarEsquemaProfiles()
      }

      // 1) Obtener sesión actual
      const {
        data: { session: currentSession },
        error: sessionErr,
      } = await supabase.auth.getSession()

      console.log('🔐 getSession en UserContext =>', {
        sessionErr,
        hasSession: !!currentSession,
      })

      if (sessionErr || !currentSession?.user) {
        // No hay sesión ➜ limpiar todo
        limpiarEstado()
        setLoading(false)
        return
      }

      setUser(currentSession.user)
      setSession(currentSession)

      // 2) (Opcional) Intentar usar cache SOLO si coincide el id
      if (typeof window !== 'undefined') {
        const cache = localStorage.getItem('perfil')
        if (cache) {
          try {
            const parsed = JSON.parse(cache)
            if (parsed?.id === currentSession.user.id) {
              setPerfil(parsed)
            } else {
              localStorage.removeItem('perfil')
            }
          } catch {
            localStorage.removeItem('perfil')
          }
        }
      }

      // 3) Cargar perfil desde la BD
      const { data: perfilData, error: perfilErr } = await supabase
        .from('profiles')
        .select(
          `
          id, username, email, points, subscription_active, universidad,
          nombre_completo, carrera, avatar_url, role, intereses,
          onboarding_complete
        `
        )
        .eq('id', currentSession.user.id)
        .maybeSingle()

      if (perfilErr || !perfilData) {
        console.error('❌ Error cargando perfil:', perfilErr)
        setPerfilError(true)
        setPerfil(null)
        setLoading(false)
        return
      }

      // 4) Tags del usuario
      const { data: tagsRaw } = await supabase
        .from('user_tags')
        .select('tag')
        .eq('user_id', currentSession.user.id)

      const tags = tagsRaw?.map((t) => t.tag) ?? []

      // 5) Lógica de nivel / medalla
      const puntos = perfilData.points ?? 0
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

      const perfilExtendido: PerfilExtendido = {
        ...perfilData,
        nivel,
        medalla,
        verificado: Boolean(currentSession.user.email_confirmed_at),
        has_new_rewards: false,
        tags,
      }

      setPerfil(perfilExtendido)

      if (typeof window !== 'undefined') {
        localStorage.setItem('perfil', JSON.stringify(perfilExtendido))
      }

      console.log('🟢 Perfil extendido cargado:', perfilExtendido)
    } catch (err) {
      console.error('❌ Error al cargar datos del usuario:', err)
      setPerfilError(true)
    } finally {
      setLoading(false)
    }
  }

  // Carga inicial
  useEffect(() => {
    void cargarDatos()

    // Listener de cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[onAuthStateChange]', event, !!newSession)

        if (event === 'SIGNED_OUT') {
          // ⬅️ AQUÍ LIMPIAMOS TODO AL CERRAR SESIÓN
          limpiarEstado()
          setLoading(false)
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          void cargarDatos()
        }
      }
    )

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  // Refrescar al volver al tab/ventana
  useEffect(() => {
    const onFocus = () => {
      void cargarDatos()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        session,
        perfil,
        loading,
        perfilError,
        refrescarUsuario: cargarDatos,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
