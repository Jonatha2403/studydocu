// /components/DownloadButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface Props {
  docId?: string
  filePath: string // Ruta DENTRO del bucket (ej: "2025/08/archivo.docx")
  userId?: string // opcional: si ya lo tienes arriba
  subscriptionActiva?: boolean // opcional
  tieneDocsAprobados?: boolean // opcional
  label?: string
  className?: string
  onDownloaded?: () => void
}

export default function DownloadButton({
  docId,
  filePath,
  userId: userIdProp,
  label = 'Descargar',
  className = 'text-xs text-blue-600 dark:text-blue-400 hover:underline',
  onDownloaded,
}: Props) {
  const [userId, setUserId] = useState<string | null>(userIdProp ?? null)
  const [loading, setLoading] = useState(false)

  // Nombre del bucket (define NEXT_PUBLIC_SUPABASE_BUCKET en .env.local)
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'

  useEffect(() => {
    let mounted = true

    const cargarSesion = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const uid = userIdProp ?? session?.user?.id ?? null
        if (mounted) setUserId(uid)
      } catch (e) {
        console.warn('[DownloadButton] sesion error:', e)
      }
    }

    void cargarSesion()
    return () => {
      mounted = false
    }
  }, [userIdProp])

  const registrarDescarga = async (): Promise<boolean> => {
    if (!docId) return true
    try {
      const res = await fetch(`/api/documents/${docId}/download`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = body?.error || 'No tienes permiso para descargar este documento.'
        toast.error(msg)
        return false
      }

      if (body?.accessMode === 'free' && typeof body?.remainingFreeDownloads === 'number') {
        toast.success(
          `Descarga gratis aplicada. Te quedan ${body.remainingFreeDownloads} descargas gratis.`
        )
      }

      if (body?.accessMode === 'points' && body?.pointsCharged) {
        toast.success(`Se descontaron ${body.pointsCharged} puntos por esta descarga.`)
      }

      return true
    } catch (e) {
      console.warn('[DownloadButton] error registrando descarga:', e)
      toast.error('No se pudo validar tu descarga. Intenta nuevamente.')
      return false
    }
  }

  const handleDescargar = async () => {
    if (!userId) {
      toast.error('Debes iniciar sesion para descargar.')
      return
    }

    try {
      setLoading(true)

      const accessAllowed = await registrarDescarga()
      if (!accessAllowed) return
      onDownloaded?.()

      // Normaliza la ruta: debe ser el "object key" dentro del bucket
      let objectKey = (filePath || '').replace(/^\/+/, '')
      if (objectKey.startsWith(`${BUCKET}/`)) {
        // si por error guardaste "bucket/..." en filePath, recortalo
        objectKey = objectKey.slice(BUCKET.length + 1)
      }

      // 1) URL firmada (sirve para bucket privado)
      const { data: signed, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(objectKey, 60 * 60) // 1 hora

      if (error) console.warn('[DownloadButton] signed url error:', error)

      // 2) Fallback publica (si el bucket es publico)
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectKey)

      const url = signed?.signedUrl || pub?.publicUrl
      if (!url) {
        toast.error('No se pudo generar la URL de descarga.')
        return
      }

      window.open(url, '_blank')
    } catch (e: any) {
      console.error('[DownloadButton] descargar error:', e)
      toast.error(e?.message || 'No se pudo iniciar la descarga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDescargar}
      disabled={loading}
      className={className}
      aria-disabled={loading}
    >
      {loading ? 'Preparando...' : label}
    </button>
  )
}
