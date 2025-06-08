'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  userId: string | null
  documentId: string
}

export default function FavoriteButton({ userId, documentId }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id', { head: false })
        .eq('user_id', userId!)
        .eq('document_id', documentId)
        .maybeSingle()

      if (error) {
        if (error.code === 'PGRST116') return false
        throw error
      }
      return !!data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error checking favorite status:', err)
      toast.error('❌ Error al verificar si es favorito.', { description: msg })
      return false
    }
  }, [userId, documentId])

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      if (isMounted) {
        setInitialLoading(false)
        setSaved(false)
      }
      return
    }

    const performInitialCheck = async () => {
      if (!isMounted) return
      setInitialLoading(true)
      const currentSavedStatus = await checkFavoriteStatus()
      if (isMounted) {
        setSaved(currentSavedStatus)
        setInitialLoading(false)
      }
    }

    performInitialCheck()
    return () => {
      isMounted = false
    }
  }, [userId, documentId, checkFavoriteStatus])

  const toggleFavorite = useCallback(async () => {
    if (!userId) {
      toast.error('⚠️ Inicia sesión para guardar favoritos.')
      return
    }

    setIsToggling(true)
    const initiallySaved = saved

    try {
      if (saved) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('document_id', documentId)

        if (error) throw error
        setSaved(false)
        toast.info('🗑️ Eliminado de favoritos.')
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, document_id: documentId })

        if (error) throw error
        setSaved(true)
        toast.success('💖 Guardado en favoritos.')
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Error toggling favorite:', error)
      toast.error(`❌ Error al ${initiallySaved ? 'eliminar de' : 'guardar en'} favoritos.`, {
        description: msg,
      })
      setSaved(initiallySaved)
    } finally {
      setIsToggling(false)
    }
  }, [userId, documentId, saved])

  if (initialLoading) {
    return (
      <button
        disabled
        className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-default"
        aria-label="Cargando estado de favorito"
      >
        <Loader2 size={16} className="animate-spin" />
        Cargando...
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isToggling || !userId}
      className={`text-sm font-medium flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800
        ${
          saved
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/40 focus-visible:ring-indigo-500'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus-visible:ring-gray-500'
        }
        ${isToggling || !userId ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-pressed={saved}
      aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      {isToggling ? (
        <Loader2 size={16} className="animate-spin" />
      ) : saved ? (
        <BookmarkCheck size={16} className="text-indigo-500 dark:text-indigo-300" />
      ) : (
        <Bookmark size={16} />
      )}
      <span className="whitespace-nowrap">
        {isToggling ? 'Procesando...' : saved ? 'Guardado' : 'Guardar'}
      </span>
    </button>
  )
}
