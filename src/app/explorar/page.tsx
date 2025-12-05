'use client'

import DownloadButton from '@/components/DownloadButton'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, Loader2, Search } from 'lucide-react'
import Link from 'next/link'

const CATEGORIAS = ['Resumen', 'Ensayo', 'Tarea', 'Examen'] as const
const ORDENES = [
  { label: 'Más recientes', value: 'created_at' },
  { label: 'Más descargados', value: 'download_count' },
  { label: 'Más populares', value: 'likes' },
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

    const nombres = (data || []).map((u) => u.name).filter(Boolean)
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
        setResultados(filtrados || [])
      }
    } finally {
      setCargando(false)
    }
  }, [busqueda, categoria, universidad, orden, formato])

  useEffect(() => {
    void fetchUniversidades()
    void handleBuscar()
  }, [fetchUniversidades, handleBuscar])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        📚 Explorar documentos
      </h1>

      {/* Filtros + botón */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {/* Búsqueda */}
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar por nombre..."
          className="md:col-span-2 rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        />

        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as any)}
          className="rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        >
          <option value="Todos">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Universidad */}
        <select
          value={universidad}
          onChange={(e) => setUniversidad(e.target.value)}
          className="rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        >
          <option value="Todas">Todas las universidades</option>
          {universidades.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Formato */}
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value as any)}
          className="rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        >
          <option value="Todos">Todos los formatos</option>
          {FORMATOS.map((f) => (
            <option key={f} value={f}>
              .{f}
            </option>
          ))}
        </select>

        {/* Orden */}
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as any)}
          className="rounded-2xl px-4 py-2 text-sm border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        >
          {ORDENES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botón buscar */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleBuscar}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all"
        >
          <Search className="w-4 h-4" /> Buscar
        </button>
      </div>

      {/* Resultados */}
      {cargando ? (
        <div className="text-center py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> Cargando documentos...
        </div>
      ) : resultados.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl shadow-md border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="px-4 py-3 text-left">📄 Documento</th>
                <th className="px-4 py-3">🏷️ Categoría</th>
                <th className="px-4 py-3">🎓 Universidad</th>
                <th className="px-4 py-3">👤 Autor</th>
                <th className="px-4 py-3">⬇️ Descargas</th>
                <th className="px-4 py-3">👍 Likes</th>
                <th className="px-4 py-3">🔗 Acción</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-accent/30 transition">
                  <td className="px-4 py-2 font-medium">{doc.file_name}</td>
                  <td className="px-4 py-2 text-center">{doc.category}</td>
                  <td className="px-4 py-2 text-center">{doc.university || '-'}</td>
                  <td className="px-4 py-2 text-center">@{doc.uploaded_by.slice(0, 6)}...</td>
                  <td className="px-4 py-2 text-center">{doc.download_count}</td>
                  <td className="px-4 py-2 text-center">{doc.likes}</td>
                  <td className="px-4 py-2 text-center space-y-1">
                    <DownloadButton docId={doc.id} filePath={doc.file_path} />
                    <Link
                      href={`/vista-previa/${doc.id}`}
                      className="text-xs inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Vista previa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          🚫 No se encontraron resultados.
          <div className="text-sm mt-2">
            ¿Quieres ser el primero en subir algo así?{' '}
            <Link href="/subir" className="underline text-primary">
              Sube uno aquí
            </Link>
            .
          </div>
        </div>
      )}
    </div>
  )
}
