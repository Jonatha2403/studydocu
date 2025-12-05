'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Send, MessageSquareText, Loader2, UserCircle, Flag } from 'lucide-react'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { reportarContenido } from '@/lib/report'

// 👇 Usa el mismo componente de tus páginas de perfil/configuración
import LottieAvatar from '@/components/LottieAvatar'

/** ---------- Tipos ---------- */
interface CommentProfileInfo {
  username: string | null
  avatar_url: string | null
}

interface CommentEntry {
  id: string
  created_at: string
  content: string
  user_id: string
  document_id: string
  profiles: CommentProfileInfo | null
}

interface CommentBoxProps {
  documentId: string
  user: User | null
  onCommentSent?: () => void | Promise<void>
}

/** ---------- Helpers para avatar ---------- */
const getCleanUrl = (u?: string | null) => (u ? u.split('?')[0] : '')
const isLottieUrl = (u?: string | null) => getCleanUrl(u).endsWith('.json')

/** ---------- Componente ---------- */
export default function CommentBox({ documentId, user, onCommentSent }: CommentBoxProps) {
  const [comments, setComments] = useState<CommentEntry[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // cache-buster local solo para imágenes (evita ver avatares viejos)
  const [avatarVersion] = useState<number>(Date.now())

  const fetchComments = useCallback(async () => {
    if (!documentId) return
    setLoadingComments(true)
    try {
      // Usamos la vista pública: comments_public_v
      const { data, error } = await supabase
        .from('comments_public_v')
        .select('id, created_at, content, user_id, document_id, username, avatar_url')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[comments_public_v/select]', error)
        throw error
      }

      const mapped: CommentEntry[] =
        ((data as any[] | null) ?? []).map((row) => ({
          id: row.id,
          created_at: row.created_at,
          content: row.content,
          user_id: row.user_id,
          document_id: row.document_id,
          profiles: {
            username: row.username ?? null,
            avatar_url: row.avatar_url ?? null,
          },
        })) || []

      setComments(mapped)
    } catch (error: any) {
      console.error('[comments_public_v/select] fatal', error)
      toast.error(error?.message || '❌ Error al cargar comentarios.')
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }, [documentId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault()
      if (!user) return toast.error('Debes iniciar sesión para comentar.')
      const trimmed = newComment.trim()
      if (!trimmed) return toast.info('El comentario no puede estar vacío.')

      setIsSubmitting(true)
      try {
        const { error } = await supabase.from('comments').insert({
          user_id: user.id,
          document_id: documentId,
          content: trimmed,
        })
        if (error) {
          console.error('[comments/insert]', error)
          throw error
        }
        toast.success('✅ Comentario enviado')
        setNewComment('')
        await fetchComments()
        await onCommentSent?.()
      } catch (e: any) {
        console.error('[comments/insert] fatal', e)
        toast.error(e?.message || '❌ Error al enviar el comentario.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [newComment, user, documentId, fetchComments, onCommentSent]
  )

  const formatDate = (str: string) => {
    const date = new Date(str)
    return `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  const handleReport = async (commentId: string) => {
    if (!user) return toast.error('Debes iniciar sesión.')
    const motivo = prompt('¿Por qué deseas reportar este comentario?')
    if (!motivo) return
    try {
      const result = await reportarContenido(user.id, motivo, documentId, commentId)
      if (result.success) toast.success('✅ Reporte enviado. Gracias por tu aporte.')
      else toast.error('❌ Error al enviar reporte.')
    } catch (e: any) {
      console.error('[reportarContenido]', e)
      toast.error(e?.message || '❌ Error al enviar reporte.')
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 selection:bg-yellow-400 selection:text-black">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <MessageSquareText className="mr-2 text-blue-600 dark:text-yellow-400" />
        Comentarios ({loadingComments ? '...' : comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            rows={3}
            placeholder="Escribe tu comentario aquí..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 text-white text-sm px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Enviando...
              </>
            ) : (
              <>
                <Send size={16} /> Enviar
              </>
            )}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md text-center">
          Debes{' '}
          <a href="/auth" className="text-blue-600 dark:text-yellow-400 font-semibold underline">
            iniciar sesión
          </a>{' '}
          para comentar.
        </p>
      )}

      {loadingComments ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-yellow-400" />
          <p className="mt-2">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay comentarios. ¡Sé el primero!
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const profile = comment.profiles
            const cleanUrl = getCleanUrl(profile?.avatar_url || null)
            const lottie = isLottieUrl(profile?.avatar_url || null)
            const imgSrc =
              !lottie && profile?.avatar_url
                ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${avatarVersion}`
                : undefined

            return (
              <li
                key={comment.id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {profile?.avatar_url ? (
                    lottie ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden grid place-items-center bg-muted">
                        <LottieAvatar src={cleanUrl} size={36} />
                      </div>
                    ) : (
                      <Image
                        src={imgSrc as string}
                        alt="Avatar"
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    )
                  ) : (
                    <UserCircle size={36} className="text-gray-400 dark:text-gray-500" />
                  )}

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                      <span className="font-semibold text-blue-700 dark:text-yellow-400 text-sm">
                        {profile?.username || 'Usuario Anónimo'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {user && (
                      <button
                        onClick={() => handleReport(comment.id)}
                        className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Flag size={14} /> Reportar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
