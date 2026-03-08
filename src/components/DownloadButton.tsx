// /components/DownloadButton.tsx
'use client'

import { useState } from 'react'
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
  label = 'Descargar',
  className = 'text-xs text-blue-600 dark:text-blue-400 hover:underline',
  onDownloaded,
}: Props) {
  const [loading, setLoading] = useState(false)
  const notifyPointsRefresh = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('studydocu:points-updated'))
  }

  const registrarDescarga = async (): Promise<{
    ok: boolean
    accessMode?: 'owner' | 'premium' | 'free' | 'contributor' | 'points' | 'repeat'
    pointsCharged?: number
  }> => {
    if (!docId) return { ok: true }
    try {
      const res = await fetch(`/api/documents/${docId}/download`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = body?.error || 'No tienes permiso para descargar este documento.'
        toast.error(msg)
        return { ok: false }
      }

      if (body?.accessMode === 'free' && typeof body?.remainingFreeDownloads === 'number') {
        toast.success(
          `Descarga gratis aplicada. Te quedan ${body.remainingFreeDownloads} descargas gratis.`
        )
      }

      if (body?.accessMode === 'points' && body?.pointsCharged) {
        const rest =
          typeof body?.remainingPoints === 'number'
            ? ` Te quedan ${body.remainingPoints} puntos.`
            : ''
        toast.success(`Se descontaron ${body.pointsCharged} puntos por esta descarga.${rest}`)
      }

      if (body?.accessMode === 'contributor') {
        toast.success('Descarga habilitada por tener documentos aprobados.')
      }

      if (body?.accessMode === 'repeat') {
        toast.success('Ya habias descargado este documento. No se descontaron puntos.')
      }

      if (body?.accessMode === 'owner') {
        toast.success('Este documento es tuyo. Tu descarga es gratis y no descuenta puntos.')
      }

      if (body?.accessMode === 'premium') {
        toast.success('Descarga premium aplicada. No se descontaron puntos.')
      }

      return {
        ok: true,
        accessMode: body?.accessMode,
        pointsCharged: Number(body?.pointsCharged || 0),
      }
    } catch (e) {
      console.warn('[DownloadButton] error registrando descarga:', e)
      toast.error('No se pudo validar tu descarga. Intenta nuevamente.')
      return { ok: false }
    }
  }

  const handleDescargar = async () => {
    try {
      setLoading(true)

      const accessResult = await registrarDescarga()
      if (!accessResult.ok) return
      if (accessResult.accessMode === 'points' || accessResult.accessMode === 'free') {
        notifyPointsRefresh()
      }
      onDownloaded?.()

      let url: string | null = null
      if (docId) {
        const urlRes = await fetch(`/api/documents/${docId}/download-url`, { cache: 'no-store' })
        const urlBody = await urlRes.json().catch(() => ({}))
        if (!urlRes.ok || !urlBody?.url) {
          toast.error(urlBody?.error || 'No se pudo generar la URL de descarga.')
          return
        }
        url = urlBody.url
      }

      if (!url) {
        // Fallback legacy cuando no existe docId
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'
        const objectKey = (filePath || '').replace(/^\/+/, '')
        const { data: signed, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(objectKey, 60 * 60)
        if (error) console.warn('[DownloadButton] signed url error:', error)
        url = signed?.signedUrl || null
      }

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
