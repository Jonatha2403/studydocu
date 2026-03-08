'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Download, Heart, Copy, AlertTriangle, ArrowLeft } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import DocumentPreview from '@/components/DocumentPreview'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import FavoriteButton from '@/components/FavoriteButton'
import DownloadButton from '@/components/DownloadButton'
import LikeButton from '@/components/LikeButton'
import ReactionBar from '@/components/ReactionBar'

interface Profile {
  username: string
  universidad?: string
}

interface DocumentRow {
  id: string
  file_name: string
  file_path: string
  file_url?: string | null
  category: string
  created_at: string
  user_id: string
  likes?: number
  download_count?: number
  approved?: boolean
  author_username?: string | null
  author_university?: string | null
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

  useEffect(() => {
    if (!id) return
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const metaRes = await fetch(`/api/documents/${id}/public-metadata`, { cache: 'no-store' })
        const metaBody = await metaRes.json().catch(() => ({}))
        if (!metaRes.ok) throw new Error(metaBody?.error || 'No se pudo leer el documento.')

        const previewRes = await fetch(`/api/documents/${id}/preview-url`, { cache: 'no-store' })
        const previewBody = await previewRes.json().catch(() => ({}))
        if (!previewRes.ok || !previewBody?.url) {
          throw new Error(previewBody?.error || 'No se pudo obtener la URL de vista previa.')
        }

        if (!mounted) return
        const authorUsername = metaBody?.author_username || 'usuario'
        const authorUniversity = metaBody?.author_university || null

        setDoc({
          ...(metaBody as DocumentRow),
          profiles: {
            username: authorUsername,
            universidad: authorUniversity || undefined,
          },
        })
        setPublicUrl(previewBody.url)
        setUrlOk(true)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Error cargando el documento.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
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

  useEffect(() => {
    if (typeof window === 'undefined' || user) return

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if ((event.ctrlKey || event.metaKey) && key === 'p') {
        event.preventDefault()
        event.stopPropagation()
        toast.error('Para imprimir o descargar debes iniciar sesion.')
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [user])

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
      toast.success('Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  const handleReport = () => toast('Funcionalidad de reporte en desarrollo')

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
          <h1 className="text-xl font-semibold mb-2">ID invalido</h1>
          <p className="text-sm text-muted-foreground">
            No se recibio un identificador de documento.
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
          <h1 className="text-xl font-semibold mb-2">Documento no encontrado</h1>
          <p className="text-sm text-muted-foreground">{error ?? 'Intenta nuevamente.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-8 md:pb-12">
      {!user && (
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            body::before {
              content: 'Para imprimir este documento debes iniciar sesion y descargarlo con permisos.';
              visibility: visible !important;
              display: block !important;
              padding: 32px;
              font-size: 18px;
              color: #111827;
            }
          }
        `}</style>
      )}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold">Vista previa de documento</h1>
        <FavoriteButton userId={user?.id ?? null} documentId={doc.id} />
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {doc.profiles?.universidad || 'Universidad desconocida'} - {doc.category} - Subido por{' '}
        <Link
          href={`/perfil/usuario/${doc.profiles?.username}`}
          className="text-primary hover:underline"
        >
          @{doc.profiles?.username ?? 'usuario'}
        </Link>
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-2xl overflow-hidden border bg-background">
            {publicUrl && isPDF && urlOk && <DocumentPreview filePath={publicUrl} />}

            {publicUrl && !isPDF && isOffice && urlOk && (
              <div>
                <iframe
                  src={officeViewerUrl ?? undefined}
                  className="w-full h-[80vh]"
                  title="Vista previa Office"
                />
                <div className="p-3 text-center text-sm">
                  <a
                    href={officeViewerUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Abrir vista externa
                  </a>
                </div>
              </div>
            )}

            {publicUrl && !urlOk && (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No se pudo cargar la vista previa en linea. Intenta nuevamente mas tarde.
                </p>
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

          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-700">
              <span className="mr-2 font-medium">Interacciones:</span>
              <LikeButton docId={doc.id} initialLikes={Number(doc.likes ?? 0)} userId={user?.id} />
            </div>
            <ReactionBar documentId={doc.id} />
          </div>

          <CommentBox documentId={doc.id} user={user} />
        </div>

        <aside className="bg-white dark:bg-gray-900 p-4 border rounded shadow space-y-3 text-sm">
          <p>
            <strong>Nombre:</strong> {doc.file_name}
          </p>
          <p>
            <strong>Categoria:</strong>{' '}
            <span className={`px-2 py-1 rounded text-xs ${categoryStyle}`}>{doc.category}</span>
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(doc.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Autor:</strong>{' '}
            <Link
              className="text-blue-600 hover:underline"
              href={`/perfil/usuario/${doc.profiles?.username}`}
            >
              @{doc.profiles?.username ?? 'usuario'}
            </Link>
          </p>
          <p>
            <strong>Universidad:</strong> {doc.profiles?.universidad || '-'}
          </p>
          <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Download size={16} /> Descargas: <strong>{doc.download_count ?? 0}</strong>
          </p>
          <p className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
            <Heart size={16} /> Likes: <strong>{doc.likes ?? 0}</strong>
          </p>
          {doc.file_path && (
            <DownloadButton
              docId={doc.id}
              filePath={doc.file_path}
              onDownloaded={() =>
                setDoc((prev) =>
                  prev ? { ...prev, download_count: Number(prev.download_count ?? 0) + 1 } : prev
                )
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              label="Descargar documento"
            />
          )}
        </aside>
      </div>
    </div>
  )
}
