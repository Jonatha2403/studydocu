// src/context/UserContext.tsx
'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
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
  refrescarUsuario: () => Promise<void>
  clearCache: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUserContext = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext debe usarse dentro de un UserProvider')
  return ctx
}

/**
 * ✅ Cache liviano y seguro:
 * - Se guarda por userId
 * - TTL para evitar datos “viejos” eternos
 */
const CACHE_KEY = 'studydocu:perfil:v1'
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 min

type PerfilCachePayload = {
  userId: string
  savedAt: number
  perfil: PerfilExtendido
}

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function getNivelYMedalla(points?: number) {
  const p = points ?? 0

  if (p >= 500) return { nivel: 'Experto', medalla: '🥇 Oro' }
  if (p >= 200) return { nivel: 'Avanzado', medalla: '🥈 Plata' }
  if (p >= 50) return { nivel: 'Explorador', medalla: '🥉 Bronce' }
  return { nivel: 'Nuevo', medalla: '🥉 Bronce' }
}

// Solo para debug en desarrollo (opcional). No bloquea la carga.
async function validarEsquemaProfilesDevOnly() {
  if (process.env.NODE_ENV !== 'development') return

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
    const { data, error } = await supabase.rpc('pg_table_def', { table_name_input: 'profiles' })
    if (error) throw error

    const found = (data ?? []).map((c: any) => c.column_name)
    const missing = expectedColumns.filter((c) => !found.includes(c))
    if (missing.length) console.warn('⚠️ Columnas faltantes en "profiles":', missing)
  } catch (e) {
    console.warn('⚠️ No se pudo validar esquema profiles (dev only):', e)
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [perfil, setPerfil] = useState<PerfilExtendido | null>(null)
  const [loading, setLoading] = useState(true)
  const [perfilError, setPerfilError] = useState(false)

  // ✅ evita llamadas simultáneas (focus + onAuthStateChange)
  const inFlightRef = useRef<Promise<void> | null>(null)

  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY)
    }
  }, [])

  const limpiarEstado = useCallback(() => {
    setUser(null)
    setSession(null)
    setPerfil(null)
    setPerfilError(false)
    clearCache()
  }, [clearCache])

  const cargarDatos = useCallback(async () => {
    // Dedup: si ya hay una carga corriendo, espera esa misma
    if (inFlightRef.current) return inFlightRef.current

    const task = (async () => {
      setLoading(true)
      setPerfilError(false)

      try {
        // Dev-only validation (no bloquea si falla)
        void validarEsquemaProfilesDevOnly()

        // 1) Sesión actual
        const {
          data: { session: currentSession },
          error: sessionErr,
        } = await supabase.auth.getSession()

        if (sessionErr || !currentSession?.user) {
          limpiarEstado()
          return
        }

        setUser(currentSession.user)
        setSession(currentSession)

        // 2) Cache (si coincide userId y no está expirado)
        if (typeof window !== 'undefined') {
          const cached = safeParseJSON<PerfilCachePayload>(localStorage.getItem(CACHE_KEY))
          const isValid =
            cached &&
            cached.userId === currentSession.user.id &&
            Date.now() - cached.savedAt <= CACHE_TTL_MS

          if (isValid) {
            setPerfil(cached!.perfil)
          } else if (cached) {
            localStorage.removeItem(CACHE_KEY)
          }
        }

        // 3) Perfil desde BD
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
          return
        }

        // 4) Tags (si falla, no rompe)
        const { data: tagsRaw, error: tagsErr } = await supabase
          .from('user_tags')
          .select('tag')
          .eq('user_id', currentSession.user.id)

        if (tagsErr) console.warn('⚠️ Error cargando tags:', tagsErr)

        const tags = tagsRaw?.map((t) => t.tag) ?? []

        // 5) Nivel / medalla
        const { nivel, medalla } = getNivelYMedalla(perfilData.points)

        const perfilExtendido: PerfilExtendido = {
          ...perfilData,
          nivel,
          medalla,
          verificado: Boolean(currentSession.user.email_confirmed_at),
          has_new_rewards: false,
          tags,
        }

        setPerfil(perfilExtendido)

        // 6) Guardar cache con TTL
        if (typeof window !== 'undefined') {
          const payload: PerfilCachePayload = {
            userId: currentSession.user.id,
            savedAt: Date.now(),
            perfil: perfilExtendido,
          }
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
        }
      } catch (err) {
        console.error('❌ Error al cargar datos del usuario:', err)
        setPerfilError(true)
      } finally {
        setLoading(false)
      }
    })()

    inFlightRef.current = task
    await task.finally(() => {
      inFlightRef.current = null
    })
  }, [limpiarEstado])

  // Carga inicial + listener auth
  useEffect(() => {
    void cargarDatos()

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      // SIGNED_OUT: limpia
      if (event === 'SIGNED_OUT') {
        limpiarEstado()
        setLoading(false)
        return
      }

      // SIGNED_IN / TOKEN_REFRESHED: recarga
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        void cargarDatos()
      }
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [cargarDatos, limpiarEstado])

  // Refrescar al volver al tab/ventana (solo si la pestaña vuelve visible)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void cargarDatos()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [cargarDatos])

  const value = useMemo<UserContextType>(
    () => ({
      user,
      session,
      perfil,
      loading,
      perfilError,
      refrescarUsuario: cargarDatos,
      clearCache,
    }),
    [user, session, perfil, loading, perfilError, cargarDatos, clearCache]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
