'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  filePath: string
  canViewFull?: boolean // Si tiene acceso completo
}

export default function DocumentPreview({ filePath, canViewFull = false }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 120) // 2 minutos

      if (error) {
        console.error('Error al obtener URL firmada:', error)
      }

      if (data?.signedUrl) setPreviewUrl(data.signedUrl)
      setLoading(false)
    }

    if (filePath) fetchPreviewUrl()
  }, [filePath])

  if (loading || !previewUrl) {
    return <p className="text-center text-sm text-muted-foreground py-6">⏳ Cargando vista previa...</p>
  }

  return (
    <div className="relative border rounded-2xl overflow-hidden shadow-lg mt-4 max-w-4xl mx-auto">
      <iframe
        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-[500px] bg-white dark:bg-slate-900"
        style={{ pointerEvents: canViewFull ? 'auto' : 'none' }}
        loading="lazy"
      ></iframe>

      {!canViewFull && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900 opacity-90 flex flex-col items-center justify-end p-6">
          <p className="text-gray-800 dark:text-gray-200 text-sm mb-3">
            🔒 Solo puedes ver una parte del documento
          </p>
          <Link
            href="/suscripcion"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm transition"
          >
            Desbloquear vista completa
          </Link>
        </div>
      )}
    </div>
  )
}
