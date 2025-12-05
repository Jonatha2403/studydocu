// /components/DownloadButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { puedeDescargar } from '@/lib/downloadControl'

interface Props {
  docId?: string
  filePath: string                 // 🔹 Ruta DENTRO del bucket (ej: "2025/08/archivo.docx")
  userId?: string                  // opcional: si ya lo tienes arriba
  subscriptionActiva?: boolean     // opcional: si ya lo sabes arriba
  tieneDocsAprobados?: boolean     // opcional
  label?: string
  className?: string
}

export default function DownloadButton({
  filePath,
  userId: userIdProp,
  subscriptionActiva,
  tieneDocsAprobados,
  label = 'Descargar',
  className = 'text-xs text-blue-600 dark:text-blue-400 hover:underline',
}: Props) {
  const [puede, setPuede] = useState(false)
  const [userId, setUserId] = useState<string | null>(userIdProp ?? null)
  const [loading, setLoading] = useState(false)

  // Nombre del bucket (define NEXT_PUBLIC_SUPABASE_BUCKET en .env.local)
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'

  useEffect(() => {
    let mounted = true

    const verificar = async () => {
      try {
        // Si arriba ya tienes flags, úsalos directamente
        if (typeof subscriptionActiva === 'boolean' || typeof tieneDocsAprobados === 'boolean') {
          const allowed = !!subscriptionActiva || !!tieneDocsAprobados
          if (mounted) setPuede(allowed)
        } else {
          // Si no, consulta sesión y regla de negocio
          const { data: { session } } = await supabase.auth.getSession()
          const uid = userIdProp ?? session?.user?.id ?? null
          if (mounted) setUserId(uid)

          if (uid) {
            const allowed = await puedeDescargar(uid)
            if (mounted) setPuede(allowed)
          }
        }
      } catch (e) {
        console.warn('[DownloadButton] verificar error:', e)
      }
    }

    verificar()
    return () => { mounted = false }
  }, [subscriptionActiva, tieneDocsAprobados, userIdProp])

  const handleDescargar = async () => {
    if (!userId) {
      toast.error('Debes iniciar sesión para descargar.')
      return
    }

    if (!puede) {
      toast('🚫 Debes suscribirte o subir un documento aprobado para descargar.', {
        action: { label: 'Ver opciones', onClick: () => (window.location.href = '/suscripcion') },
      })
      return
    }

    try {
      setLoading(true)

      // Normaliza la ruta: debe ser el "object key" dentro del bucket
      let objectKey = (filePath || '').replace(/^\/+/, '')
      if (objectKey.startsWith(`${BUCKET}/`)) {
        // si por error guardaste "bucket/..." en filePath, recórtalo
        objectKey = objectKey.slice(BUCKET.length + 1)
      }

      // 1) URL firmada (sirve para bucket privado)
      const { data: signed, error } = await supabase
        .storage
        .from(BUCKET)
        .createSignedUrl(objectKey, 60 * 60) // 1 hora

      if (error) console.warn('[DownloadButton] signed url error:', error)

      // 2) Fallback pública (si el bucket es público)
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
      {loading ? 'Preparando…' : label}
    </button>
  )
}
