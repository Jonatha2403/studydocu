'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { sumarPuntos, registrarLogro, checkMissions } from '@/lib/gamification'
import { Share2, Loader2 } from 'lucide-react'

interface DocumentShareProps {
  documentId: string
  userId: string
}

export default function DocumentShare({ documentId, userId }: DocumentShareProps) {
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    setLoading(true)
    try {
      // A: Generar enlace de compartir (puedes personalizar la ruta)
      const shareUrl = `${window.location.origin}/view/${documentId}`

      // B: Registrar enlace en audit_logs o tabla de compartidos si lo deseas
      await supabase.from('audit_logs').insert([{
        user_id: userId,
        action: 'document_shared',
        details: { document_id: documentId, share_url: shareUrl },
      }])

      // C: Gamificación al compartir
      await sumarPuntos(userId, 20, 'Compartir documento')
      await registrarLogro(userId, 'compartir')
      await checkMissions(userId)

      // D: Copiar al portapapeles & notificar
      await navigator.clipboard.writeText(shareUrl)
      toast.success('✅ Enlace copiado y puntos ganados por compartir!')
    } catch (e) {
      console.error(e)
      toast.error('❌ Error al compartir el documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow"
    >
      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      {loading ? 'Compartiendo...' : 'Compartir'}
    </button>
  )
}
