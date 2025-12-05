'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Eye, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type DocRow = {
  id: string
  file_name: string
  category: string | null
  created_at: string
  download_count: number | null
  likes: number | null
  approved: boolean | null
}

const DETAIL_BASE = '/vista-previa' // cámbialo a '/documents' si usas ese detalle

export default function MisDocumentosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [docs, setDocs] = useState<DocRow[]>([])
  const [q, setQ] = useState('')

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: ses } = await supabase.auth.getSession()
      const user = ses.session?.user
      if (!user) {
        setError('Debes iniciar sesión para ver tus documentos.')
        setDocs([])
        return
      }

      // ✅ Pide SOLO columnas que existen en tu tabla
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at, download_count, likes, approved')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Normaliza a número
      const normalized = (data ?? []).map(d => ({
        ...d,
        download_count: d.download_count ?? 0,
        likes: d.likes ?? 0,
        approved: d.approved ?? false,
      })) as DocRow[]

      setDocs(normalized)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar tus documentos.')
      setDocs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return docs
    return docs.filter(d =>
      (d.file_name || '').toLowerCase().includes(term) ||
      (d.category || '').toLowerCase().includes(term)
    )
  }, [docs, q])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
        Cargando tus documentos…
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl border p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDocs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🗂️ Mis documentos</h1>
        <button
          onClick={fetchDocs}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          title="Actualizar"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Buscar por nombre o categoría…"
          className="w-full rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          {q ? 'No hay resultados para tu búsqueda.' : 'Aún no has subido documentos.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Descargas</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-2">{d.file_name}</td>
                  <td className="px-4 py-2 text-center">{d.category ?? '-'}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">{d.download_count ?? 0}</td>
                  <td className="px-4 py-2 text-center">{d.likes ?? 0}</td>
                  <td className="px-4 py-2 text-center">
                    {d.approved ? 'Aprobado ✅' : 'Pendiente ⏳'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      href={`${DETAIL_BASE}/${d.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" /> Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
