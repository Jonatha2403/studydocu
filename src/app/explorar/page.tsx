'use client'

import DownloadButton from '@/components/DownloadButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Eye, Loader2, Search, FileText, Download, Heart, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const CATEGORIAS = ['Resumen', 'Ensayo', 'Tarea', 'Examen'] as const
const ORDENES = [
  { label: 'Mas recientes', value: 'created_at' },
  { label: 'Mas descargados', value: 'download_count' },
  { label: 'Mas populares', value: 'likes' },
] as const
const FORMATOS = ['pdf', 'docx', 'xlsx'] as const

interface Documento {
  id: string
  file_name: string
  file_path: string
  category: string
  created_at: string
  download_count: number
  likes: number
  approved: boolean
  university: string | null
  uploaded_by: string
}

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState<'Todos' | (typeof CATEGORIAS)[number]>('Todos')
  const [orden, setOrden] = useState<(typeof ORDENES)[number]['value']>('created_at')
  const [universidad, setUniversidad] = useState<'Todas' | string>('Todas')
  const [formato, setFormato] = useState<'Todos' | (typeof FORMATOS)[number]>('Todos')
  const [universidades, setUniversidades] = useState<string[]>([])
  const [resultados, setResultados] = useState<Documento[]>([])
  const [cargando, setCargando] = useState(false)

  const fetchUniversidades = useCallback(async () => {
    const { data, error } = await supabase
      .from('universities')
      .select('name')
      .order('name', { ascending: true })

    if (error) {
      console.warn('No se pudo cargar universidades:', error)
      return
    }

    const nombres = (data || [])
      .map((u: { name?: string | null }) => u.name)
      .filter((name): name is string => Boolean(name))
    setUniversidades(nombres)
  }, [])

  const handleBuscar = useCallback(async () => {
    setCargando(true)

    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('approved', true)
        .order(orden, { ascending: false })

      if (busqueda.trim()) {
        query = query.ilike('file_name', `%${busqueda.trim()}%`)
      }

      if (categoria !== 'Todos') {
        query = query.eq('category', categoria)
      }

      if (universidad !== 'Todas') {
        query = query.eq('university', universidad)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error al cargar documentos:', error)
        setResultados([])
      } else {
        const filtrados =
          formato === 'Todos'
            ? data
            : data?.filter((d) => d.file_path?.toLowerCase().endsWith(`.${formato}`))
        setResultados((filtrados || []) as Documento[])
      }
    } finally {
      setCargando(false)
    }
  }, [busqueda, categoria, universidad, orden, formato])

  useEffect(() => {
    void fetchUniversidades()
  }, [fetchUniversidades])

  useEffect(() => {
    void handleBuscar()
  }, [handleBuscar])

  const totalDocs = resultados.length
  const totalDownloads = useMemo(
    () => resultados.reduce((acc, doc) => acc + Number(doc.download_count || 0), 0),
    [resultados]
  )
  const totalLikes = useMemo(
    () => resultados.reduce((acc, doc) => acc + Number(doc.likes || 0), 0),
    [resultados]
  )

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 pb-10 pt-6 sm:px-6 lg:pt-8">
      <section className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-900 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Explorar documentos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filtra por categoria, universidad y formato para encontrar material academico.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <article className="rounded-xl border bg-white p-4 dark:bg-gray-900">
          <p className="text-xs text-muted-foreground">Resultados</p>
          <p className="mt-1 text-2xl font-semibold">{totalDocs}</p>
        </article>
        <article className="rounded-xl border bg-white p-4 dark:bg-gray-900">
          <p className="text-xs text-muted-foreground">Descargas visibles</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <Download className="h-4 w-4" /> {totalDownloads}
          </p>
        </article>
        <article className="rounded-xl border bg-white p-4 dark:bg-gray-900">
          <p className="text-xs text-muted-foreground">Likes visibles</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <Heart className="h-4 w-4" /> {totalLikes}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-900 sm:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Buscar</label>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="h-10 w-full rounded-xl border px-3 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as 'Todos' | (typeof CATEGORIAS)[number])
              }
              className="h-10 w-full rounded-xl border px-3 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:bg-gray-800"
            >
              <option value="Todos">Todas</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Universidad
            </label>
            <select
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
              className="h-10 w-full rounded-xl border px-3 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:bg-gray-800"
            >
              <option value="Todas">Todas</option>
              {universidades.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Formato</label>
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value as 'Todos' | (typeof FORMATOS)[number])}
              className="h-10 w-full rounded-xl border px-3 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:bg-gray-800"
            >
              <option value="Todos">Todos</option>
              {FORMATOS.map((f) => (
                <option key={f} value={f}>
                  .{f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Orden</label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as (typeof ORDENES)[number]['value'])}
              className="h-10 w-full rounded-xl border px-3 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:bg-gray-800"
            >
              {ORDENES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => void handleBuscar()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search className="h-4 w-4" /> Buscar
          </button>
        </div>
      </section>

      {cargando ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-muted-foreground dark:bg-gray-900">
          <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
          Cargando documentos...
        </div>
      ) : resultados.length > 0 ? (
        <>
          <section className="space-y-3 md:hidden">
            {resultados.map((doc) => (
              <article key={doc.id} className="rounded-xl border bg-white p-4 dark:bg-gray-900">
                <p className="truncate font-semibold">{doc.file_name}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Categoria: {doc.category || '-'}</p>
                  <p className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {doc.university || 'Desconocida'}
                  </p>
                  <p>Autor: @{(doc.uploaded_by || 'anonimo').slice(0, 8)}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <p>Descargas: {doc.download_count || 0}</p>
                  <p>Likes: {doc.likes || 0}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <DownloadButton docId={doc.id} filePath={doc.file_path} />
                  <Link
                    href={`/vista-previa/${doc.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                  >
                    <Eye className="h-4 w-4" /> Vista previa
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section className="hidden overflow-x-auto rounded-2xl border bg-white shadow-sm dark:bg-gray-900 md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Documento</th>
                  <th className="px-4 py-3 text-center font-semibold">Categoria</th>
                  <th className="px-4 py-3 text-center font-semibold">Universidad</th>
                  <th className="px-4 py-3 text-center font-semibold">Autor</th>
                  <th className="px-4 py-3 text-center font-semibold">Descargas</th>
                  <th className="px-4 py-3 text-center font-semibold">Likes</th>
                  <th className="px-4 py-3 text-center font-semibold">Accion</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-medium">{doc.file_name}</td>
                    <td className="px-4 py-3 text-center">{doc.category || '-'}</td>
                    <td className="px-4 py-3 text-center">{doc.university || 'Desconocida'}</td>
                    <td className="px-4 py-3 text-center">
                      @{(doc.uploaded_by || 'anonimo').slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-center">{doc.download_count || 0}</td>
                    <td className="px-4 py-3 text-center">{doc.likes || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <DownloadButton docId={doc.id} filePath={doc.file_path} />
                        <Link
                          href={`/vista-previa/${doc.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <Eye className="h-4 w-4" /> Vista previa
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border bg-white p-10 text-center dark:bg-gray-900">
          <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No se encontraron resultados.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Si deseas, puedes ser el primero en subir un documento.
          </p>
          <Link
            href="/subir"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Subir documento
          </Link>
        </section>
      )}
    </div>
  )
}
