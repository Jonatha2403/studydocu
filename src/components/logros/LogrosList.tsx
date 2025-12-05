'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import LogroCard from './LogroCard'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'

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
  title: string
  description: string
  icon: string
  difficulty?: number
  created_at?: string | null
  unlocked?: boolean
}

export default function LogrosList({
  filtro = 'all',
  query = '',
  orden = 'title',
  onStats
}: Props) {
  const { perfil } = useUserContext()
  const [logros, setLogros] = useState<Logro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const userId = perfil?.id ?? null

    async function fetchLogros() {
      setLoading(true)
      setError(null)
      try {
        const { data: allLogros, error: errLogros } = await supabase
          .from('logros')
          .select('*')
          .order('title')

        if (errLogros) {
          console.error('[logros] select error:', errLogros)
          setError('No pudimos cargar los logros.')
        }

        let ids = new Set<string>()
        if (userId) {
          const { data: desbloqueados, error: errUser } = await supabase
            .from('user_logros')
            .select('logro_id')
            .eq('user_id', userId)

          if (errUser) {
            console.error('[user_logros] select error:', errUser)
          }
          ids = new Set((desbloqueados || []).map((r) => r.logro_id))
        }

        const enriched: Logro[] = (allLogros || []).map((l: any) => ({
          id: String(l.id),
          title: String(l.title ?? 'Logro sin título'),
          description: String(l.description ?? ''),
          icon: String(l.icon ?? l.emoji ?? '🏅'),
          difficulty: l.difficulty ?? 1,
          created_at: l.created_at ?? null,
          unlocked: ids.has(l.id),
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
        if (!cancelled) setError('Ocurrió un error al cargar los logros.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    // Llamamos siempre; si cambia userId, recalcula "unlocked"
    fetchLogros()

    // Safety timeout por si algo se cuelga
    const safety = setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 6000)

    return () => {
      cancelled = true
      clearTimeout(safety)
    }
  }, [perfil?.id]) // 👈 solo depende del id del usuario, NO de onStats

  const filtrados = useMemo(() => {
    let arr = [...logros]
    if (filtro === 'unlocked') arr = arr.filter((l) => l.unlocked)
    if (filtro === 'locked') arr = arr.filter((l) => !l.unlocked)
    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      )
    }
    if (orden === 'title') {
      arr.sort((a, b) => a.title.localeCompare(b.title))
    } else if (orden === 'recent') {
      arr.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    } else if (orden === 'difficulty') {
      arr.sort((a, b) => (b.difficulty ?? 0) - (a.difficulty ?? 0))
    }
    return arr
  }, [logros, filtro, query, orden])

  const completados = logros.filter((l) => l.unlocked).length
  const progreso = logros.length > 0 ? Math.round((completados / logros.length) * 100) : 0

  // Loading
  if (loading) {
    return (
      <>
        <div className="mt-6 max-w-sm mx-auto mb-8">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progreso total</p>
          <Progress value={0} />
          <p className="mt-1 text-xs text-muted-foreground">Cargando…</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 animate-pulse">
              <div className="h-4 w-24 bg-muted rounded mb-3" />
              <div className="h-5 w-3/4 bg-muted rounded mb-2" />
              <div className="h-4 w-2/3 bg-muted rounded mb-4" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </>
    )
  }

  // Empty global (no hay logros en tabla)
  if (!loading && logros.length === 0) {
    return (
      <>
        <div className="mt-6 max-w-sm mx-auto mb-8">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progreso total</p>
          <Progress value={0} />
          <p className="mt-1 text-xs text-muted-foreground">0% completado</p>
        </div>

        <div className="rounded-2xl border p-10 text-center">
          <p className="text-lg font-semibold">Aún no hay logros disponibles</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cuando se creen logros, aparecerán aquí. Explora documentos y vuelve más tarde.
          </p>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </div>
      </>
    )
  }

  // Vista normal
  return (
    <>
      <div className="mt-6 max-w-sm mx-auto mb-8">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progreso total</p>
        <Progress value={progreso} />
        <p className="mt-1 text-xs text-muted-foreground">
          {completados} de {logros.length} logros completados
        </p>
      </div>

      {completados === logros.length && logros.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-center p-6 rounded-xl shadow-xl mb-10"
        >
          <p className="text-lg font-semibold">🎉 ¡Felicidades!</p>
          <p className="text-sm">Has desbloqueado todos los logros. ¡Eres un crack estudiantil! 🔥</p>
        </motion.div>
      )}

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">
          <p className="text-base">No hay logros que coincidan con tu búsqueda o filtro.</p>
          <p className="text-sm mt-1">Prueba con otra palabra clave o cambia de pestaña.</p>
        </div>
      ) : (
        <motion.section layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((logro, i) => (
            <motion.div key={logro.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <LogroCard logro={logro} index={i} />
            </motion.div>
          ))}
        </motion.section>
      )}
    </>
  )
}
