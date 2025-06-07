// /components/DownloadButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { puedeDescargar } from '@/lib/downloadControl'
import { supabase } from '@/lib/supabase'

interface Props {
  docId: string
  filePath: string
  userId?: string
  suscripcionActiva?: boolean
  tieneDocsAprobados?: boolean
}

export default function DownloadButton({ filePath }: Props) {
  const [puede, setPuede] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const verificar = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (user) {
        setUserId(user.id)
        const resultado = await puedeDescargar(user.id)
        setPuede(resultado)
      }
    }
    verificar()
  }, [])

  const handleDescargar = () => {
    if (!puede || !userId) {
      toast("🚫 Debes suscribirte o subir un documento aprobado para descargar.", {
        action: {
          label: 'Ver opciones',
          onClick: () => window.location.href = '/suscripcion'
        }
      })
      return
    }
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    window.open(`${SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`, '_blank')
  }

  return (
    <button
      onClick={handleDescargar}
      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
    >
      Descargar
    </button>
  )
}
