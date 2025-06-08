'use client'

import DownloadButton from '@/components/DownloadButton'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CATEGORIAS = ['Todos', 'Resumen', 'Ensayo', 'Tarea', 'Examen']
const ORDENES = [
  { label: 'Más recientes', value: 'created_at' },
  { label: 'Más descargados', value: 'downloads' },
  { label: 'Más populares', value: 'likes' },
]
const FORMATOS = ['Todos', 'pdf', 'docx', 'xlsx']

interface DocumentResult {
  id: string
  file_name: string
  file_path: string
  category: string
  created_at: string
  downloads: number
  likes: number
  user_id: string
  public: boolean
  profiles?: {
    username: string
    universidad: string
  }
}

interface UsuarioInfo {
  id: string
  suscripcion: boolean
  tieneDocumentosAprobados: boolean
}

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [orden, setOrden] = useState('created_at')
  const [universidad, setUniversidad] = useState('Todas')
  const [formato, setFormato] = useState('Todos')
  const [universidades, setUniversidades] = useState<string[]>([])
  const [resultados, setResultados] = useState<DocumentResult[]>([])
  const [cargando, setCargando] = useState(false)
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null)

  const fetchUniversidades = async () => {
    const { data } = await supabase.from('profiles').select('universidad')
    if (data) {
      const únicas = Array.from(new Set(data.map((p) => p.universidad).filter(Boolean)))
      setUniversidades(únicas)
    }
  }

  const obtenerUsuario = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) return

    const { data: perfil } = await supabase
      .from('profiles')
      .select('id, puntos, suscripcion_activa')
      .eq('id', user.id)
      .single()

    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'aprobado')

    setUsuario({
      id: user.id,
      suscripcion: perfil?.suscripcion_activa,
      tieneDocumentosAprobados: (count || 0) > 0,
    })
  }

  const handleBuscar = useCallback(async () => {
    setCargando(true)

    let query = supabase
      .from('documents')
      .select(
        `
        id,
        file_name,
        file_path,
        category,
        created_at,
        downloads,
        likes,
        user_id,
        public,
        profiles (username, universidad)
      `
      )
      .eq('status', 'aprobado')
      .eq('public', true)
      .order(orden, { ascending: false })

    if (busqueda) query = query.ilike('file_name', `%${busqueda}%`)
    if (categoria !== 'Todos') query = query.eq('category', categoria)
    if (universidad !== 'Todas') query = query.eq('profiles.universidad', universidad)

    const { data } = await query
    if (data) {
      const filtrados =
        formato === 'Todos' ? data : data.filter((d) => d.file_path.endsWith(`.${formato}`))

      const transformados: DocumentResult[] = filtrados.map((d) => ({
        id: d.id,
        file_name: d.file_name,
        file_path: d.file_path,
        category: d.category,
        created_at: d.created_at,
        downloads: d.downloads,
        likes: d.likes,
        user_id: d.user_id,
        public: d.public,
        profiles:
          Array.isArray(d.profiles) && d.profiles.length > 0
            ? {
                username: d.profiles[0].username,
                universidad: d.profiles[0].universidad,
              }
            : undefined,
      }))

      setResultados(transformados)
    }
    setCargando(false)
  }, [busqueda, categoria, universidad, orden, formato])

  useEffect(() => {
    fetchUniversidades()
    obtenerUsuario()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (
        busqueda.length > 2 ||
        categoria !== 'Todos' ||
        universidad !== 'Todas' ||
        orden !== 'created_at' ||
        formato !== 'Todos'
      ) {
        handleBuscar()
      } else {
        setResultados([])
      }
    }, 400)
    return () => clearTimeout(delay)
  }, [busqueda, categoria, universidad, orden, formato, handleBuscar])

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        📚 Explorar documentos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 items-center mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar por nombre..."
          className="rounded-xl px-4 py-2 text-sm shadow focus:ring-2 focus:ring-blue-500 border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm shadow border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={universidad}
          onChange={(e) => setUniversidad(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm shadow border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="Todas">Todas las universidades</option>
          {universidades.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm shadow border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {FORMATOS.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm shadow border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {ORDENES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="text-center text-muted-foreground my-6">
          <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" /> Cargando documentos...
        </div>
      ) : resultados.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full text-sm text-gray-800 dark:text-white">
            <thead className="bg-gray-100 dark:bg-slate-800 text-left">
              <tr>
                <th className="px-4 py-3">📄 Documento</th>
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
                <tr
                  key={doc.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-4 py-2 font-medium">{doc.file_name}</td>
                  <td className="px-4 py-2">{doc.category}</td>
                  <td className="px-4 py-2">{doc.profiles?.universidad ?? '-'}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/perfil/usuario/${doc.profiles?.username}`}
                      className="text-blue-600 dark:text-blue-300 hover:underline"
                    >
                      @{doc.profiles?.username}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{doc.downloads ?? 0}</td>
                  <td className="px-4 py-2">{doc.likes ?? 0}</td>
                  <td className="px-4 py-2 space-y-1">
                    <DownloadButton
                      docId={doc.id}
                      filePath={doc.file_path}
                      userId={usuario?.id}
                      suscripcionActiva={usuario?.suscripcion}
                      tieneDocsAprobados={usuario?.tieneDocumentosAprobados}
                    />
                    <Link
                      href={`/vista-previa/${doc.id}`}
                      className="block text-purple-600 dark:text-purple-400 hover:underline text-xs inline-flex items-center"
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
        busqueda.length > 2 && (
          <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
            <p>🚫 No se encontraron resultados. Intenta con otras palabras.</p>
            <p className="text-xs mt-2">
              ¿Quieres ser el primero en subir un documento así?{' '}
              <Link href="/subir" className="text-primary underline">
                Sube uno aquí
              </Link>
              .
            </p>
          </div>
        )
      )}
    </div>
  )
}
