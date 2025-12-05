'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

function isHttpUrl(s?: string | null) {
  if (!s) return false
  return /^https?:\/\//i.test(s.trim())
}

interface Props {
  /** Puede ser una URL completa (public/signed) o una key relativa del Storage */
  filePath: string
  /** Si lo usas para permitir abrir en pestaña completa */
  canViewFull?: boolean
  /** Opcional: si envías key y quieres forzar otro bucket */
  bucketOverride?: string
}

/**
 * DocumentPreview robusto:
 * - Si `filePath` es URL http(s) => la usa tal cual.
 * - Si es una key de Storage => la firma con el bucket.
 */
export default function DocumentPreview({ filePath, canViewFull, bucketOverride }: Props) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isPdf = useMemo(() => {
    const s = (filePath || '').toLowerCase()
    return s.endsWith('.pdf') || /\.pdf(\?|$)/i.test(s)
  }, [filePath])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        // Caso 1: ya es URL
        if (isHttpUrl(filePath)) {
          if (!active) return
          setResolvedUrl(filePath)
          return
        }

        // Caso 2: key de Storage
        const bucket = bucketOverride || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'
        const key = filePath.trim().replace(/^\/+/, '')

        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, 60 * 60)
        if (error || !data?.signedUrl) {
          throw new Error(error?.message || 'No se pudo firmar el archivo en Storage.')
        }
        if (!active) return
        setResolvedUrl(data.signedUrl)
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'No se pudo cargar el archivo.')
        setResolvedUrl(null)
      } finally {
        if (!active) return
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [filePath, bucketOverride])

  if (loading) {
    return (
      <div className="w-full h-[70vh] grid place-items-center text-sm text-muted-foreground">
        Cargando documento…
      </div>
    )
  }

  if (error || !resolvedUrl) {
    return (
      <div className="p-6 text-center text-sm text-red-600">
        {error || 'No se pudo cargar el documento.'}
      </div>
    )
  }

  // Office docs
  const isOffice = /\.(docx?|xlsx?|pptx?)(?:$|\?)/i.test(resolvedUrl)
  const officeViewerUrl = isOffice
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resolvedUrl)}`
    : null

  return (
    <div className="w-full">
      {isPdf && (
        <iframe src={resolvedUrl} className="w-full h-[80vh]" title="PDF" />
      )}

      {isOffice && officeViewerUrl && (
        <iframe src={officeViewerUrl} className="w-full h-[80vh]" title="Office" />
      )}

      {!isPdf && !isOffice && (
        <div className="p-6 text-center">
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Abrir archivo
          </a>
        </div>
      )}

      {/* 🔗 Enlace adicional para abrir en pestaña completa */}
      {canViewFull && resolvedUrl && (
        <div className="mt-3 text-center">
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline"
          >
            Ver en pestaña completa
          </a>
        </div>
      )}
    </div>
  )
}
