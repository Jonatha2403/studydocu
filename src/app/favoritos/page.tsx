'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Loader2, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { removePoints } from '@/lib/points'
import SugerenciasRelacionadas from '@/components/SugerenciasRelacionadas'
import DownloadButton from '@/components/DownloadButton'

/** Tipos del documento y del favorito */
type DocumentRow = {
  id: string
  file_name: string
  category: string
  created_at: string
  download_count: number | null
  likes: number | null
  file_path: string
  approved?: boolean | null
}

type FavoriteRow = {
  id: string
  created_at: string
  document: DocumentRow | null
}

export default function MisFavoritosPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [favoritos, setFavoritos] = useState<FavoriteRow[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** Carga de favoritos con embed del documento.
   *  NOTA: reemplaza "favorites_document_id_fkey" por el NOMBRE REAL de tu FK si difiere.
   */
  const fetchData = useCallback(async (u: SupabaseUser) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          document:documents!favorites_document_id_fkey (
            id,
            file_name,
            category,
            created_at,
            download_count,
            likes,
            file_path,
            approved
          )
        `)
        .eq('user_id', u.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // 🔧 Normalizamos: si 'document' vino como array, tomamos el primero.
      const normalized: FavoriteRow[] = (data as any[] ?? []).map((row) => ({
        id: row.id,
        created_at: row.created_at,
        document: Array.isArray(row.document)
          ? (row.document[0] ?? null)
          : (row.document ?? null),
      }))

      setFavoritos(normalized)
    } catch (e: any) {
      console.error('[mis-favoritos] fetch error:', e)
      setError(e?.message || 'Error al cargar favoritos')
      setFavoritos([])
    } finally {
      setLoading(false)
    }
  }, [])

  /** Sesión + carga */
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message)
          setLoading(false)
          return
        }
        const u = session?.user ?? null
        setUser(u)
        if (u) fetchData(u)
        else setLoading(false)
      })
      .catch((e) => {
        console.error('[mis-favoritos] session error', e)
        setError('No se pudo obtener la sesión')
        setLoading(false)
      })
  }, [fetchData])

  /** Eliminar favorito (optimista) */
  const eliminarFavorito = async (favoriteId: string) => {
    const prev = favoritos
    setFavoritos((cur) => cur.filter((f) => f.id !== favoriteId))
    const { error } = await supabase.from('favorites').delete().eq('id', favoriteId)
    if (error) {
      console.error('[mis-favoritos] delete error:', error)
      toast.error('❌ Error al eliminar de favoritos.')
      setFavoritos(prev)
    } else {
      if (user) await removePoints(user.id, 'Quitar de favoritos')
      toast.success('✅ Eliminado de favoritos.')
    }
  }

  /** Búsqueda */
  const favoritosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return favoritos
    return favoritos.filter((f) => {
      const d = f.document
      if (!d) return false
      return (
        d.file_name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
    })
  }, [favoritos, query])

  /** Estados de UI */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-yellow-400" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Por favor, inicia sesión para ver tus documentos favoritos.
      </p>
    )
  }

  /** Render principal */
  return (
    <div className="max-w-6xl mx-auto mt-8 mb-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">⭐ Mis Documentos Favoritos</h1>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Total: {favoritos.length}
        {favoritos.length > 0 && (
          <>
            {' · '}Descargas acumuladas:{' '}
            {favoritos.reduce((sum, f) => sum + (f.document?.download_count || 0), 0)}
          </>
        )}
      </div>

      {favoritos.length >= 10 && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
          🏅 ¡Felicidades! Has guardado más de 10 documentos en favoritos.
        </div>
      )}

      <input
        type="text"
        placeholder="🔍 Buscar por nombre o categoría..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {favoritosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          {favoritos.length === 0
            ? 'Aún no has guardado ningún documento en tus favoritos.'
            : 'Sin resultados para tu búsqueda.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descargas</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {favoritosFiltrados.map((fav) => {
                const d = fav.document
                const noDisponible = !d || (d.approved === false)
                return (
                  <tr key={fav.id} className="border-t">
                    <td className="p-3">
                      {d?.file_name ?? (
                        <span className="text-muted-foreground">Documento no disponible</span>
                      )}
                    </td>
                    <td className="p-3">{d?.category ?? '-'}</td>
                    <td className="p-3">{d?.download_count ?? 0}</td>
                    <td className="p-3 flex flex-wrap gap-3 items-center">
                      {!noDisponible && d && (
                        <>
                          <Link
                            href={`/vista-previa/${d.id}`}
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> Ver
                          </Link>
                          <DownloadButton filePath={d.file_path} label="Descargar" />
                        </>
                      )}
                      <button
                        onClick={() => eliminarFavorito(fav.id)}
                        className="text-red-500 hover:underline inline-flex items-center gap-1"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {favoritosFiltrados.length > 0 && (
        <div className="mt-8">
          <SugerenciasRelacionadas user={user} />
        </div>
      )}
    </div>
  )
}
