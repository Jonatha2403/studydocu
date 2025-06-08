'use client'

import { useState, useCallback, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { AlertTriangle, Send, CheckCircle, Loader2 } from 'lucide-react'

interface ReportFormProps {
  documentId: string
  userId: string | null
}

export default function ReportForm({ documentId, userId }: ReportFormProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault()

      if (!userId) {
        toast.error('⚠️ Debes iniciar sesión para enviar un reporte.')
        return
      }

      const trimmedReason = reason.trim()
      if (!trimmedReason) {
        toast.error('⚠️ Por favor, escribe un motivo para el reporte.')
        return
      }

      setLoading(true)
      try {
        const { error } = await supabase.from('reports').insert({
          user_id: userId,
          document_id: documentId,
          reason: trimmedReason,
        })

        if (error) throw new Error(error.message)

        toast.success('✅ Reporte enviado correctamente.')
        setReason('')
        setSubmitted(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
        toast.error('❌ Hubo un error al enviar el reporte.', {
          description: message,
        })
      } finally {
        setLoading(false)
      }
    },
    [userId, documentId, reason]
  )

  if (!userId && !submitted) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300 text-sm text-center">
        <AlertTriangle className="inline-block w-5 h-5 mr-2" />
        Debes{' '}
        <a
          href="/auth?modo=login"
          className="font-semibold underline hover:text-yellow-800 dark:hover:text-yellow-200"
        >
          iniciar sesión
        </a>{' '}
        para poder reportar un documento.
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-center shadow-md">
        <CheckCircle className="mx-auto w-12 h-12 mb-3 text-green-500 dark:text-green-400" />
        <p className="text-lg font-semibold">¡Gracias por tu reporte!</p>
        <p className="text-sm mt-1">Nuestro equipo lo revisará lo antes posible.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        Reportar este documento
      </h3>
      <textarea
        id="reportReason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full p-2.5 border border-red-300 dark:border-red-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500 transition-colors"
        rows={4}
        placeholder="Describe el problema o el motivo del reporte (ej. contenido inapropiado, error en el documento, etc.)"
        disabled={loading}
        required
      />
      <button
        type="submit"
        disabled={loading || !reason.trim()}
        className="mt-3 w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-red-900 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar Reporte
          </>
        )}
      </button>
    </form>
  )
}
