'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface LikeButtonProps {
  docId: string
  initialLikes: number
  userId?: string
}

export default function LikeButton({ docId, initialLikes, userId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const checkLiked = async () => {
      const { data, error } = await supabase
        .from('reactions')
        .select('id')
        .eq('document_id', docId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) console.error('Error checking like status:', error)
      else if (data) setLiked(true)
    }

    checkLiked()
  }, [docId, userId])

  const handleLike = async () => {
    if (liked || loading || !userId) {
      if (!userId) toast.error('Debes iniciar sesión para dar "Me gusta".')
      return
    }

    setLoading(true)
    setLiked(true)
    setLikes((prev) => prev + 1)

    try {
      const { error: updateError } = await supabase
        .from('documents')
        .update({ likes: likes + 1 })
        .eq('id', docId)

      if (updateError) throw updateError

      const { error: reactionError } = await supabase.from('reactions').insert({
        document_id: docId,
        user_id: userId,
        type: 'like',
      })

      if (reactionError) throw reactionError
    } catch (err) {
      const error = err as Error
      console.error('Error al dar like:', error)
      toast.error(`Error al dar Me Gusta: ${error.message}`)
      setLiked(false)
      setLikes((prev) => prev - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className="flex items-center text-blue-600 hover:text-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-5 h-5 mr-1 ${liked ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {likes}
    </button>
  )
}
