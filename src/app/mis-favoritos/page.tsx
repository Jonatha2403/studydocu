'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { removePoints } from '@/lib/points'
import SugerenciasRelacionadas from '@/components/SugerenciasRelacionadas'

interface FavoriteDocument {
  id: string;
  file_name: string;
  category: string;
  created_at: string;
  downloads: number | null;
  likes: number | null;
  file_path: string;
}

interface FavoriteEntry {
  id: string;
  documents: FavoriteDocument[] | null;
}

export default function MisFavoritos() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [favoritos, setFavoritos] = useState<FavoriteEntry[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (currentUser: SupabaseUser) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: favoritesError } = await supabase
        .from('favorites')
        .select('id, documents(id, file_name, category, created_at, downloads, likes, file_path)')
        .eq('user_id', currentUser.id);

      if (favoritesError) throw favoritesError;
      setFavoritos(data || []);
    } catch (err) {
      const typedError = err as Error;
      console.error('Error fetching favorites:', typedError);
      setError(`Error al cargar favoritos: ${typedError.message}`);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setError(`Error al obtener sesión: ${sessionError.message}`);
        setLoading(false);
        return;
      }

      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        fetchData(currentUser);
      } else {
        setLoading(false);
      }
    }).catch(err => {
      const typedError = err as Error;
      console.error('Exception getting session:', typedError);
      setError(`Excepción al obtener sesión: ${typedError.message}`);
      setUser(null);
      setLoading(false);
    });
  }, [fetchData]);

  const eliminarFavorito = async (favoritoId: string) => {
    const originalFavoritos = [...favoritos];
    setFavoritos(prev => prev.filter(f => f.id !== favoritoId));

    const { error: deleteError } = await supabase.from('favorites').delete().eq('id', favoritoId);

    if (deleteError) {
      toast.error('❌ Error al eliminar de favoritos.');
      setFavoritos(originalFavoritos);
      console.error('Error deleting favorite:', deleteError);
    } else {
      if (user) await removePoints(user.id, 'Quitar de favoritos');
      toast.success('✅ Eliminado de favoritos.');
    }
  };

  const favoritosFiltrados = favoritos.filter((fav) => {
    const doc = fav.documents?.[0];
    if (!doc) return false;

    const searchTerm = busqueda.toLowerCase();
    return (
      doc.file_name.toLowerCase().includes(searchTerm) ||
      doc.category.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500 dark:text-red-400">{error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Por favor, inicia sesión para ver tus documentos favoritos.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">⭐ Mis Documentos Favoritos</h1>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Total: {favoritos.length} favoritos | {favoritos.reduce((sum, f) => sum + (f.documents?.[0]?.downloads || 0), 0)} descargas acumuladas
      </div>
      {favoritos.length >= 10 && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded text-sm">
          🏅 ¡Felicidades! Has guardado más de 10 documentos en favoritos.
        </div>
      )}
      <input
        type="text"
        placeholder="🔍 Buscar por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-6 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {favoritosFiltrados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descargas</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {favoritosFiltrados.map((fav) => {
                const doc = fav.documents?.[0];
                if (!doc) return null;
                return (
                  <tr key={fav.id} className="border-b dark:border-gray-600">
                    <td className="p-3">{doc.file_name}</td>
                    <td className="p-3">{doc.category}</td>
                    <td className="p-3">{doc.downloads || 0}</td>
                    <td className="p-3">
                      <button
                        onClick={() => eliminarFavorito(fav.id)}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="inline w-4 h-4" /> Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Aún no has guardado ningún documento en tus favoritos.</p>
      )}
      {favoritosFiltrados.length > 0 && (
        <div className="mt-8">
          <SugerenciasRelacionadas user={user} />
        </div>
      )}
    </div>
  );
}
