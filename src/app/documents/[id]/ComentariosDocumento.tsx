'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CommentBox from '@/components/CommentBox'
import ReactionBar from '@/components/ReactionBar'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUserContext } from '@/context/UserContext'

type CommentRow = {
  id: string
  content: string
  created_at: string
  user_id: string
  document_id: string
}

interface Props {
  docId: string
}

export default function ComentariosDocumento({ docId }: Props) {
  const { user } = useUserContext()
  const [comentarios, setComentarios] = useState<CommentRow[]>([])
  const [loading, setLoading] = useState(true)

  const obtenerComentarios = useCallback(async () => {
    if (!docId) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id, document_id')
        .eq('document_id', docId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComentarios(data ?? [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar comentarios.'
      console.error('[comments/select]', e)
      toast.error(msg)
      setComentarios([])
    } finally {
      setLoading(false)
    }
  }, [docId])

  // Carga inicial
  useEffect(() => {
    obtenerComentarios()
  }, [obtenerComentarios])

  // Realtime: INSERT/UPDATE/DELETE del documento actual
  useEffect(() => {
    if (!docId) return
    const channel = supabase
      .channel(`comments_doc_${docId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `document_id=eq.${docId}` },
        (payload) => {
          setComentarios((prev) => [payload.new as CommentRow, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'comments', filter: `document_id=eq.${docId}` },
        (payload) => {
          const row = payload.new as CommentRow
          setComentarios((prev) => prev.map((c) => (c.id === row.id ? row : c)))
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'comments', filter: `document_id=eq.${docId}` },
        (payload) => {
          const row = payload.old as CommentRow
          setComentarios((prev) => prev.filter((c) => c.id !== row.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [docId])

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">💬 Comentarios</h3>

      {/* Caja para escribir comentarios (pasa el usuario real para que RLS permita insertar) */}
      <CommentBox documentId={docId} user={user} onCommentSent={obtenerComentarios} />

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin w-6 h-6 text-indigo-500" />
        </div>
      ) : comentarios.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Sé el primero en comentar este documento.
        </p>
      ) : (
        <ul className="space-y-4 mt-4">
          {comentarios.map((comentario) => (
            <li key={comentario.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white break-words whitespace-pre-wrap">
                {comentario.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Publicado el{' '}
                {new Date(comentario.created_at).toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Reacciones al documento */}
      <div className="mt-6">
        <ReactionBar documentId={docId} />
      </div>
    </div>
  )
}
