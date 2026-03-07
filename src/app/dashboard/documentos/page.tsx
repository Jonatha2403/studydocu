'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Eye, RefreshCw, FileText, Download, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/UserContext'

type DocRow = {
  id: string
  file_name: string
  category: string | null
  created_at: string
  download_count: number | null
  likes: number | null
  approved: boolean | null
}

const DETAIL_BASE = '/vista-previa'

export default function MisDocumentosPage() {
  const { user, loading: userLoading } = useUserContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [docs, setDocs] = useState<DocRow[]>([])
  const [q, setQ] = useState('')

  const fetchDocs = useCallback(async () => {
    if (!user) {
      setDocs([])
      setError('Debes iniciar sesion para ver tus documentos.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at, download_count, likes, approved')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const normalized = (data ?? []).map((d) => ({
        ...d,
        download_count: d.download_count ?? 0,
        likes: d.likes ?? 0,
        approved: d.approved ?? false,
      })) as DocRow[]

      setDocs(normalized)
    } catch (e) {
      const err = e as Error
      setError(err.message || 'Error al cargar tus documentos.')
      setDocs([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!userLoading) {
      void fetchDocs()
    }
  }, [fetchDocs, userLoading])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return docs
    return docs.filter(
      (d) =>
        (d.file_name || '').toLowerCase().includes(term) ||
        (d.category || '').toLowerCase().includes(term)
    )
  }, [docs, q])

  const totalDownloads = useMemo(
    () => docs.reduce((acc, d) => acc + (d.download_count ?? 0), 0),
    [docs]
  )
  const totalLikes = useMemo(() => docs.reduce((acc, d) => acc + (d.likes ?? 0), 0), [docs])

  if (userLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-muted-foreground">
        <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
        Cargando tus documentos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border p-6 text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <Button onClick={fetchDocs} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-3 py-6 sm:px-6">
      <header className="rounded-2xl border bg-background p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis documentos</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus archivos, estado y rendimiento.
            </p>
          </div>
          <Button onClick={fetchDocs} variant="outline" className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Total documentos</p>
          <p className="mt-1 text-2xl font-semibold">{docs.length}</p>
        </div>
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Descargas</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <Download className="h-4 w-4" /> {totalDownloads}
          </p>
        </div>
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Likes</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <Heart className="h-4 w-4" /> {totalLikes}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-4 sm:p-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o categoria"
          className="h-10"
        />
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border bg-background p-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">
            {q ? 'No hay resultados con ese filtro.' : 'Aun no has subido documentos.'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sube tu primer documento para empezar.
          </p>
        </section>
      ) : (
        <>
          <section className="space-y-3 md:hidden">
            {filtered.map((d) => (
              <article key={d.id} className="rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.file_name}</p>
                    <p className="text-xs text-muted-foreground">{d.category ?? 'Sin categoria'}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] ${
                      d.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {d.approved ? 'Aprobado' : 'Pendiente'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>Fecha: {new Date(d.created_at).toLocaleDateString()}</div>
                  <div>Descargas: {d.download_count ?? 0}</div>
                  <div>Likes: {d.likes ?? 0}</div>
                </div>

                <Link
                  href={`${DETAIL_BASE}/${d.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  <Eye className="h-4 w-4" /> Ver documento
                </Link>
              </article>
            ))}
          </section>

          <section className="hidden overflow-x-auto rounded-2xl border md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-center">Categoria</th>
                  <th className="px-4 py-3 text-center">Fecha</th>
                  <th className="px-4 py-3 text-center">Descargas</th>
                  <th className="px-4 py-3 text-center">Likes</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Accion</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-3">{d.file_name}</td>
                    <td className="px-4 py-3 text-center">{d.category ?? '-'}</td>
                    <td className="px-4 py-3 text-center">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">{d.download_count ?? 0}</td>
                    <td className="px-4 py-3 text-center">{d.likes ?? 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          d.approved
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {d.approved ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`${DETAIL_BASE}/${d.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Eye className="h-4 w-4" /> Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
