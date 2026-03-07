'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Loader2, Trash2, Eye, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useUserContext } from '@/context/UserContext'
import { Button } from '@/components/ui/button'

type DocumentRow = {
  id: string
  file_name: string
  category: string | null
  created_at: string
  download_count: number | null
  likes: number | null
  file_path: string
  approved?: boolean | null
}

type FavoriteBase = {
  id: string
  document_id: string
  created_at: string
}

export default function MisFavoritosPage() {
  const { user, loading: userLoading } = useUserContext()
  const [favoritos, setFavoritos] = useState<
    Array<{ id: string; created_at: string; document: DocumentRow | null }>
  >([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) {
      setFavoritos([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data: favRows, error: favError } = await supabase
        .from('favorites')
        .select('id, document_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (favError) throw favError

      const favorites = (favRows ?? []) as FavoriteBase[]
      if (favorites.length === 0) {
        setFavoritos([])
        return
      }

      const docIds = favorites.map((f) => f.document_id)
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at, download_count, likes, file_path, approved')
        .in('id', docIds)

      if (docsError) throw docsError

      const docsMap = new Map((docs ?? []).map((d: any) => [d.id, d as DocumentRow]))
      setFavoritos(
        favorites.map((f) => ({
          id: f.id,
          created_at: f.created_at,
          document: docsMap.get(f.document_id) ?? null,
        }))
      )
    } catch (e) {
      const err = e as Error
      console.error('[mis-favoritos] fetch error:', err)
      setError(err.message || 'Error al cargar favoritos')
      setFavoritos([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!userLoading) {
      void fetchData()
    }
  }, [fetchData, userLoading])

  const eliminarFavorito = async (favoriteId: string) => {
    const prev = favoritos
    setFavoritos((cur) => cur.filter((f) => f.id !== favoriteId))
    const { error: delError } = await supabase.from('favorites').delete().eq('id', favoriteId)
    if (delError) {
      setFavoritos(prev)
      toast.error('No se pudo eliminar de favoritos')
      return
    }
    toast.success('Eliminado de favoritos')
  }

  const favoritosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return favoritos
    return favoritos.filter((f) => {
      const d = f.document
      if (!d) return false
      return (
        (d.file_name || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q)
      )
    })
  }, [favoritos, query])

  if (userLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border bg-background p-8 text-center">
        <p className="text-muted-foreground">Inicia sesion para ver tus favoritos.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border bg-background p-8 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <Button onClick={() => void fetchData()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl space-y-5 rounded-2xl border bg-background p-4 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Star className="h-6 w-6 text-amber-500" /> Mis favoritos
          </h1>
          <p className="text-sm text-muted-foreground">Documentos guardados para revisar luego.</p>
        </div>
        <p className="text-sm text-muted-foreground">Total: {favoritos.length}</p>
      </header>

      <input
        type="text"
        placeholder="Buscar por nombre o categoria"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border px-4 py-2.5 text-sm"
      />

      {favoritosFiltrados.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          {favoritos.length === 0
            ? 'Aun no has guardado ningun documento en favoritos.'
            : 'Sin resultados para tu busqueda.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-left">Descargas</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {favoritosFiltrados.map((fav) => {
                const d = fav.document
                const noDisponible = !d || d.approved === false
                return (
                  <tr key={fav.id} className="border-t">
                    <td className="p-3">
                      {d?.file_name ?? (
                        <span className="text-muted-foreground">Documento no disponible</span>
                      )}
                    </td>
                    <td className="p-3">{d?.category ?? '-'}</td>
                    <td className="p-3">{d?.download_count ?? 0}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {!noDisponible && d && (
                          <Link
                            href={`/vista-previa/${d.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Eye className="h-4 w-4" /> Ver
                          </Link>
                        )}
                        <button
                          onClick={() => void eliminarFavorito(fav.id)}
                          className="inline-flex items-center gap-1 text-red-500 hover:underline"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
