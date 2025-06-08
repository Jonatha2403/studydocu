'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import CommentBox from '@/components/CommentBox'
import ReactionBar from '@/components/ReactionBar'
import { Loader2 } from 'lucide-react'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id?: string
  document_id?: string
}

export default function ComentariosDocumento({ docId }: { docId: string }) {
  const [comentarios, setComentarios] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const obtenerComentarios = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('document_id', docId)
      .order('created_at', { ascending: false })

    setComentarios(data || [])
    setLoading(false)
  }, [docId])

  useEffect(() => {
    if (docId) obtenerComentarios()
  }, [docId, obtenerComentarios])

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">💬 Comentarios</h3>

      {/* Caja para escribir comentarios */}
      <CommentBox documentId={docId} user={null} onCommentSent={obtenerComentarios} />

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
              <p className="text-sm text-gray-900 dark:text-white">{comentario.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                Publicado el {new Date(comentario.created_at).toLocaleDateString()}
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
