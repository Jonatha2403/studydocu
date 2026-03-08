'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUserContext } from '@/context/UserContext'
import LogroCard from './LogroCard'
import { motion } from 'framer-motion'
import { ACHIEVEMENTS_CATALOG } from '@/lib/achievementsCatalog'

type VistaFiltro = 'all' | 'unlocked' | 'locked'
type Orden = 'title' | 'recent' | 'difficulty'

interface Props {
  filtro?: VistaFiltro
  query?: string
  orden?: Orden
  onStats?: (s: { total: number; unlocked: number }) => void
}

interface Logro {
  id: string
  key: string
  title: string
  description: string
  icon: string
  difficulty?: number
  created_at?: string | null
  unlocked?: boolean
}

async function fetchUnlockedKeys(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_key, achievement')
    .eq('user_id', userId)

  if (error) {
    console.error('[user_achievements] select error:', error)
    return new Set<string>()
  }

  return new Set(
    ((data || []) as any[])
      .map((row) => String(row?.achievement_key || row?.achievement || '').trim())
      .filter(Boolean)
  )
}

async function fetchOptionalDbLogros() {
  const { data, error } = await supabase
    .from('logros')
    .select('id, title, description, icon, difficulty, created_at, key')
    .order('title')

  if (error) {
    console.warn('[logros] fallback to local catalog:', error.message)
    return [] as Logro[]
  }

  return (data || []).map((l: any) => ({
    id: String(l.id || l.key || l.title),
    key: String(l.key || l.id || l.title || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_'),
    title: String(l.title ?? 'Logro'),
    description: String(l.description ?? ''),
    icon: String(l.icon ?? 'trophy'),
    difficulty: Number(l.difficulty ?? 1),
    created_at: l.created_at ?? null,
    unlocked: false,
  }))
}

function buildBaseCatalog(): Logro[] {
  return ACHIEVEMENTS_CATALOG.map((a) => ({
    id: a.key,
    key: a.key,
    title: a.title,
    description: a.description,
    icon: a.icon,
    difficulty: a.difficulty,
    created_at: null,
    unlocked: false,
  }))
}

export default function LogrosList({
  filtro = 'all',
  query = '',
  orden = 'title',
  onStats,
}: Props) {
  const { perfil } = useUserContext()
  const [logros, setLogros] = useState<Logro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const userId = perfil?.id ?? null

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const [dbLogros, unlocked] = await Promise.all([
          fetchOptionalDbLogros(),
          userId ? fetchUnlockedKeys(userId) : Promise.resolve(new Set<string>()),
        ])

        const mergedByKey = new Map<string, Logro>()
        buildBaseCatalog().forEach((l) => mergedByKey.set(l.key, l))
        dbLogros.forEach((l) => {
          const existing = mergedByKey.get(l.key)
          mergedByKey.set(l.key, { ...existing, ...l, key: l.key || existing?.key || l.id })
        })

        const enriched = Array.from(mergedByKey.values()).map((l) => ({
          ...l,
          unlocked: unlocked.has(l.key),
        }))

        if (!cancelled) {
          setLogros(enriched)
          onStats?.({
            total: enriched.length,
            unlocked: enriched.filter((l) => l.unlocked).length,
          })
        }
      } catch (e) {
        console.error('[logros] unexpected error:', e)
        if (!cancelled) {
          setError('Ocurrio un error al cargar los logros.')
          const fallback = buildBaseCatalog()
          setLogros(fallback)
          onStats?.({ total: fallback.length, unlocked: 0 })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [perfil?.id, onStats])

  const filtrados = useMemo(() => {
    let arr = [...logros]
    if (filtro === 'unlocked') arr = arr.filter((l) => l.unlocked)
    if (filtro === 'locked') arr = arr.filter((l) => !l.unlocked)
    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      )
    }
    if (orden === 'title') arr.sort((a, b) => a.title.localeCompare(b.title))
    if (orden === 'recent')
      arr.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    if (orden === 'difficulty') arr.sort((a, b) => (b.difficulty ?? 0) - (a.difficulty ?? 0))
    return arr
  }, [logros, filtro, query, orden])

  const completados = logros.filter((l) => l.unlocked).length

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border p-4">
            <div className="mb-3 h-4 w-24 rounded bg-muted" />
            <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {completados === logros.length && logros.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 p-6 text-center text-white shadow-xl"
        >
          <p className="text-lg font-semibold">Felicidades</p>
          <p className="text-sm">Desbloqueaste todos los logros disponibles.</p>
        </motion.div>
      )}

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">
          <p className="text-base">No hay logros que coincidan con tu busqueda o filtro.</p>
          <p className="mt-1 text-sm">Prueba con otra palabra clave o cambia de pestana.</p>
          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <motion.section layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((logro, i) => (
            <motion.div
              key={logro.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LogroCard logro={logro} index={i} />
            </motion.div>
          ))}
        </motion.section>
      )}
    </>
  )
}
