'use client'

import { useEffect, useState, useCallback } from 'react'
import { ThumbsUp, ThumbsDown, Smile, Meh, Frown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'
import { toast } from 'sonner'

interface Props {
  documentId: string
}

interface ReactionRecord {
  type: string
}

const reactionsList = [
  { type: 'like', icon: ThumbsUp, label: 'Me gusta' },
  { type: 'dislike', icon: ThumbsDown, label: 'No me gusta' },
  { type: 'smile', icon: Smile, label: 'Interesante' },
  { type: 'meh', icon: Meh, label: 'Neutral' },
  { type: 'frown', icon: Frown, label: 'Confuso' },
]

export default function ReactionBar({ documentId }: Props) {
  const { user } = useUser()
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchReactions = useCallback(async () => {
    const { data, error } = await supabase
      .from('reactions')
      .select('type')
      .eq('document_id', documentId)

    if (error) {
      console.error('❌ Error al obtener reacciones:', error.message)
      return
    }

    const counts: Record<string, number> = {}
    data?.forEach((r: ReactionRecord) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })

    setReactions(counts)
  }, [documentId])

  const fetchUserReaction = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('reactions')
      .select('type')
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error al obtener reacción del usuario:', error.message)
    }

    setUserReaction(data ? data.type : null)
  }, [documentId, user])

  useEffect(() => {
    fetchReactions()
    fetchUserReaction()
  }, [fetchReactions, fetchUserReaction])

  const handleReaction = async (type: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para reaccionar.')
      return
    }

    setLoading(true)

    try {
      if (userReaction === type) {
        await supabase
          .from('reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('document_id', documentId)

        setUserReaction(null)
      } else {
        await supabase.from('reactions').upsert([
          {
            user_id: user.id,
            document_id: documentId,
            type,
          },
        ])

        setUserReaction(type)
      }

      await fetchReactions()
    } catch (e) {
      toast.error('❌ Error al enviar reacción.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-6 items-center justify-center sm:justify-start">
      {reactionsList.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          title={label}
          disabled={loading}
          onClick={() => handleReaction(type)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition ${
            userReaction === type
              ? 'bg-blue-600 text-white border-blue-700 dark:bg-yellow-400 dark:text-black dark:border-yellow-500'
              : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
          } hover:scale-105 active:scale-95`}
        >
          <Icon className="w-4 h-4" />
          <span>{reactions[type] || 0}</span>
        </button>
      ))}
    </div>
  )
}
