'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase' // Asegúrate que esta ruta sea correcta
import { Bookmark, BookmarkCheck, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  userId: string | null; // Permitir null si el usuario no está logueado
  documentId: string;
}

export default function FavoriteButton({ userId, documentId }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Para la comprobación inicial
  const [isToggling, setIsToggling] = useState(false); // Para la acción de añadir/quitar

  // Función para verificar el estado de favorito (envuelta en useCallback)
  const checkFavoriteStatus = useCallback(async () => {
    // No es necesario verificar userId aquí, ya que el useEffect que la llama lo hará.
    // Esta función asume que userId es válido cuando se llama.
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id', { head: false }) // Solo necesitamos saber si existe una entrada
        .eq('user_id', userId!) // userId está garantizado por la lógica de llamada
        .eq('document_id', documentId)
        .maybeSingle(); // Devuelve la fila o null

      if (error) {
        // PGRST116 (No rows found) no es un error en este contexto.
        if (error.code === 'PGRST116') {
          return false; // No es favorito
        }
        throw error; // Otros errores sí son problemáticos
      }
      return !!data; // true si 'data' no es null (es decir, se encontró un favorito)
    } catch (err: any) {
      console.error("Error checking favorite status:", err);
      toast.error("❌ Error al verificar si es favorito.", {
        description: err.message,
      });
      return false; // Asumir que no es favorito en caso de error
    }
  }, [userId, documentId]); // supabase y toast son accedidos globalmente, no son dependencias directas del callback en sí

  // useEffect para la comprobación inicial del estado de favorito
  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      // Si no hay usuario, no puede ser favorito y no estamos cargando nada específico de favoritos.
      if (isMounted) {
        setInitialLoading(false);
        setSaved(false);
      }
      return; // No hacer nada más
    }

    const performInitialCheck = async () => {
      if (!isMounted) return;
      setInitialLoading(true);

      const currentSavedStatus = await checkFavoriteStatus();

      if (isMounted) {
        setSaved(currentSavedStatus);
        setInitialLoading(false);
      }
    };

    performInitialCheck();

    // Función de limpieza del useEffect
    return () => {
      isMounted = false;
    };
  }, [userId, documentId, checkFavoriteStatus]); // checkFavoriteStatus es ahora una dependencia estable

  // Función para añadir/quitar de favoritos
  const toggleFavorite = useCallback(async () => {
    if (!userId) {
      toast.error('⚠️ Inicia sesión para guardar favoritos.');
      return;
    }

    setIsToggling(true);
    const initiallySaved = saved; // Para revertir en caso de error

    try {
      if (saved) { // Intentar quitar de favoritos (delete)
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('document_id', documentId);

        if (error) throw error;
        setSaved(false);
        toast.info('🗑️ Eliminado de favoritos.');
      } else { // Intentar guardar en favoritos (insert)
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, document_id: documentId });

        if (error) throw error;
        setSaved(true);
        toast.success('💖 Guardado en favoritos.');
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      toast.error(`❌ Error al ${initiallySaved ? 'eliminar de' : 'guardar en'} favoritos.`, {
        description: error.message,
      });
      setSaved(initiallySaved); // Revertir UI al estado anterior en caso de error
    } finally {
      setIsToggling(false);
    }
  }, [userId, documentId, saved]); // Dependencias: saved para saber la acción a realizar

  // Renderizado del botón
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
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isToggling || !userId} // Deshabilitar si está procesando o no hay usuario
      className={`text-sm font-medium flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800
                  ${saved 
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/40 focus-visible:ring-indigo-500' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus-visible:ring-gray-500'}
                  ${isToggling || !userId ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                 `}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
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
  );
}