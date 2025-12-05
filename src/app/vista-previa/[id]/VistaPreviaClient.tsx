'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, Download, Heart, Copy, AlertTriangle, ArrowLeft } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import DocumentPreview from '@/components/DocumentPreview'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import FavoriteButton from '@/components/FavoriteButton'
import {
  normalizeStoragePath,
  parseSupabaseStorageUrl,
  isHttpUrl,
} from '@/lib/storagePath'

interface Profile {
  username: string
  universidad?: string
}

interface DocumentRow {
  id: string
  file_name: string
  file_path: string
  category: string
  created_at: string
  user_id: string
  downloads?: number
  likes?: number
  approved?: boolean
}

interface DocumentData extends DocumentRow {
  profiles?: Profile
}

interface VistaPreviaClientProps {
  id: string
}

export default function VistaPreviaClient({ id }: VistaPreviaClientProps) {
  const router = useRouter()
  const { user } = useUserContext()

  const [doc, setDoc] = useState<DocumentData | null>(null)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [urlOk, setUrlOk] = useState<boolean>(false)

  /** Lista una carpeta y busca si existe el archivo (v2 no tiene .stat). */
  const checkExists = async (bucket: string, objectKey: string): Promise<boolean> => {
    try {
      const parts = (objectKey || '').split('/').filter(Boolean)
      const fileName = parts.pop() || ''
      const folder = parts.join('/') // '' si raíz

      const { data, error } = await supabase.storage.from(bucket).list(folder || '', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })
      if (error) return false
      return !!data?.find(f => f.name === fileName)
    } catch {
      return false
    }
  }

  /** Genera posibles keys a partir del file_path y el bucket. */
  const buildKeyCandidates = (raw: string, bucket: string): string[] => {
    const cands = new Set<string>()
    const push = (s?: string) => { if (s && s.trim()) cands.add(s.trim()) }

    // 1) Normalizada base
    const norm = normalizeStoragePath(raw, bucket)
    push(norm)

    // 2) Si venía con bucket/... (por si la normalización no lo detectó)
    const trimmed = raw.trim().replace(/^\/+/, '')
    if (trimmed.toLowerCase().startsWith(`${bucket.toLowerCase()}/`)) {
      push(trimmed.slice(bucket.length + 1))
    }

    // 3) Variantes decodificadas/limpias
    try { push(decodeURIComponent(norm)) } catch { /* noop */ }
    Array.from(cands).forEach(k => {
      push(k.replace(/\/{2,}/g, '/'))
      push(k.replace(/\+/g, ' '))
    })

    // 4) Si es URL de supabase con otro bucket → usa esa key directamente
    const parsed = parseSupabaseStorageUrl(raw)
    if (parsed) {
      push(parsed.key)
      try { push(decodeURIComponent(parsed.key)) } catch { /* noop */ }
      push(parsed.key.replace(/\+/g, ' '))
      push(parsed.key.replace(/\/{2,}/g, '/'))
    }

    // Quita vacíos y dupes
    return Array.from(cands).map(s => s.trim()).filter(Boolean)
  }

  /** Intenta firmar o sacar pública para el primer key que exista y responda 200. */
  const resolveWorkingUrl = async (bucket: string, rawPath: string) => {
    const candidates = buildKeyCandidates(rawPath, bucket)

    for (const key of candidates) {
      const exists = await checkExists(bucket, key)
      if (!exists) continue

      let url: string | undefined
      // Intenta firmar (privado)
      try {
        const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(key, 60 * 60)
        if (signed?.signedUrl) url = signed.signedUrl
      } catch { /* noop */ }

      // Fallback pública
      if (!url) {
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key)
        if (pub?.publicUrl) url = pub.publicUrl
      }

      if (!url) continue

      // Verifica que la URL responde
      try {
        const head = await fetch(url, { method: 'HEAD' })
        if (head.ok) {
          return { url, key }
        }
      } catch { /* prueba siguiente */ }
    }

    return { url: undefined as string | undefined, key: undefined as string | undefined }
  }

  useEffect(() => {
    if (!id) return
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) Documento base
        const { data: d, error: e1 } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (e1) throw new Error(`No se pudo leer el documento: ${e1.message}`)
        if (!d) throw new Error('Documento no encontrado.')

        // 2) Resolver URL del archivo
        let bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'

        if (isHttpUrl(d.file_path)) {
          // URL completa: si es de Supabase, extrae bucket/key y re-firma; si no, úsala tal cual
          const parsed = parseSupabaseStorageUrl(d.file_path)
          if (parsed) {
            bucket = parsed.bucket
            const { url } = await resolveWorkingUrl(bucket, parsed.key)
            if (!mounted) return
            if (!url) throw new Error('No se pudo generar acceso al archivo (bucket/ruta).')
            setPublicUrl(url)
          } else {
            if (!mounted) return
            setPublicUrl(d.file_path)
          }
        } else {
          // Ruta interna (key relativa)
          const { url } = await resolveWorkingUrl(bucket, d.file_path)
          if (!mounted) return
          if (!url) throw new Error('No se pudo generar URL del archivo (bucket o ruta incorrectos).')
          setPublicUrl(url)
        }

        // 3) Perfil del autor (no crítico)
        const { data: p } = await supabase
          .from('profiles')
          .select('username, universidad')
          .eq('id', d.user_id)
          .maybeSingle()

        if (!mounted) return
        setDoc({ ...(d as DocumentRow), profiles: p ?? undefined })

        // 4) Marca OK si ya tenemos URL
        setUrlOk(true)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Error cargando el documento.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [id])

  const ext = useMemo(() => {
    const name = (doc?.file_name || doc?.file_path || '').toLowerCase().trim()
    const m = name.match(/\.(\w+)$/)
    return m ? m[1] : ''
  }, [doc])

  const isPDF = ext === 'pdf'
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)

  const officeViewerUrl = useMemo(
    () =>
      publicUrl
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`
        : null,
    [publicUrl]
  )

  const categoryClasses: Record<string, string> = {
    Resumen: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300',
    Ensayo: 'bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-300',
    Tarea: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300',
    Examen: 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-300',
  }

  const categoryStyle = doc
    ? categoryClasses[doc.category] ||
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
    : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('📎 Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  const handleReport = () => toast('⚠️ Funcionalidad de reporte en desarrollo')

  if (!id) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-semibold mb-2">❌ ID inválido</h1>
          <p className="text-sm text-muted-foreground">
            No se recibió un identificador de documento.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Cargando vista previa...
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-semibold mb-2">❌ Documento no encontrado</h1>
          <p className="text-sm text-muted-foreground">{error ?? 'Intenta nuevamente.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      {/* Encabezado + favorito */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold">👁️ Vista previa de documento</h1>
        <FavoriteButton userId={user?.id ?? null} documentId={doc.id} />
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {doc.profiles?.universidad || 'Universidad desconocida'} · {doc.category} · Subido por{' '}
        <Link
          href={`/perfil/usuario/${doc.profiles?.username}`}
          className="text-primary hover:underline"
        >
          @{doc.profiles?.username ?? 'usuario'}
        </Link>
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Visor */}
        <div className="md:col-span-2">
          <div className="rounded-2xl overflow-hidden border bg-background">
            {/* PDF */}
            {publicUrl && isPDF && urlOk && (
              <DocumentPreview filePath={publicUrl} canViewFull />
            )}

            {/* Office (doc/xls/ppt) */}
            {publicUrl && !isPDF && isOffice && urlOk && (
              <iframe
                src={officeViewerUrl ?? undefined}
                className="w-full h-[80vh]"
                title="Vista previa Office"
              />
            )}

            {/* Fallbacks */}
            {publicUrl && !urlOk && (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No se pudo cargar la vista previa. Abre o descarga el archivo directamente.
                </p>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary underline"
                >
                  Abrir / descargar archivo <Download className="w-4 h-4" />
                </a>
              </div>
            )}

            {!publicUrl && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No se pudo generar la URL del archivo.
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <Copy size={16} /> Copiar enlace
            </button>
            <button
              onClick={handleReport}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
            >
              <AlertTriangle size={16} /> Reportar documento
            </button>
          </div>

          <CommentBox documentId={doc.id} user={user} />
        </div>

        {/* Meta */}
        <aside className="bg-white dark:bg-gray-900 p-4 border rounded shadow space-y-3 text-sm">
          <p>
            <strong>📄 Nombre:</strong> {doc.file_name}
          </p>
          <p>
            <strong>🏷️ Categoría:</strong>{' '}
            <span className={`px-2 py-1 rounded text-xs ${categoryStyle}`}>{doc.category}</span>
          </p>
          <p>
            <strong>📅 Fecha:</strong> {new Date(doc.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>👤 Autor:</strong>{' '}
            <Link
              className="text-blue-600 hover:underline"
              href={`/perfil/usuario/${doc.profiles?.username}`}
            >
              @{doc.profiles?.username ?? 'usuario'}
            </Link>
          </p>
          <p>
            <strong>🎓 Universidad:</strong> {doc.profiles?.universidad || '-'}
          </p>
          <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Download size={16} /> Descargas: <strong>{doc.downloads ?? 0}</strong>
          </p>
          <p className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
            <Heart size={16} /> Likes: <strong>{doc.likes ?? 0}</strong>
          </p>
          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full justify-center"
            >
              <Download size={16} /> Descargar documento
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
