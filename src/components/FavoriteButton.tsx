// /components/FavoriteButton.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  userId: string | null
  documentId: string
  className?: string
  onChange?: (isFav: boolean) => void
  labelOn?: string
  labelOff?: string
}

export default function FavoriteButton({
  userId,
  documentId,
  className = 'text-sm font-medium flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
  onChange,
  labelOn = 'Guardado',
  labelOff = 'Guardar'
}: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const checkFavoriteStatus = useCallback(async () => {
    if (!userId) return false

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('document_id', documentId)
        .maybeSingle()

      if (error) {
        console.error('[FavoriteButton] check error:', error)
        return false
      }

      return !!data
    } catch (e) {
      console.error('[FavoriteButton] unexpected check error:', e)
      return false
    }
  }, [userId, documentId])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!userId) {
        if (mounted) {
          setSaved(false)
          setInitialLoading(false)
        }
        return
      }

      if (mounted) setInitialLoading(true)

      const isFav = await checkFavoriteStatus()

      if (mounted) {
        setSaved(isFav)
        setInitialLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [userId, documentId, checkFavoriteStatus])

  const toggleFavorite = useCallback(async () => {
    if (!userId) {
      toast.error('⚠️ Inicia sesión para guardar favoritos.')
      return
    }

    setIsToggling(true)
    const prev = saved

    try {
      if (saved) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('document_id', documentId)

        if (error) throw error

        setSaved(false)
        onChange?.(false)
        toast.info('🗑️ Eliminado de favoritos.')
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, document_id: documentId })

        // Manejo de duplicado por unique constraint (ya estaba como favorito)
        const code = (error as any)?.code
        if (error && code !== '23505') {
          throw error
        }

        setSaved(true)
        onChange?.(true)

        if (!error) {
          toast.success('💖 Guardado en favoritos.')
        } else {
          // Si era duplicado silencioso, no mostramos error.
          toast.success('💖 Ya estaba en favoritos.')
        }
      }
    } catch (e: any) {
      console.error('[FavoriteButton] toggle error:', e)
      setSaved(prev)
      toast.error(`❌ Error al ${prev ? 'eliminar de' : 'guardar en'} favoritos.`)
    } finally {
      setIsToggling(false)
    }
  }, [userId, documentId, saved, onChange])

  if (initialLoading) {
    return (
      <button
        disabled
        className={`${className} text-gray-400 dark:text-gray-500 cursor-default`}
        aria-label="Cargando estado de favorito"
      >
        <Loader2 size={16} className="animate-spin" />
        Cargando...
      </button>
    )
  }

  const stateClasses = saved
    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/40 focus-visible:ring-indigo-500'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus-visible:ring-gray-500'

  return (
    <button
      onClick={toggleFavorite}
      disabled={isToggling || !userId}
      className={`${className} ${stateClasses} ${
        isToggling || !userId ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
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
        {isToggling ? 'Procesando...' : saved ? labelOn : labelOff}
      </span>
    </button>
  )
}
