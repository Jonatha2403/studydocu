'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CommentBox from '@/components/CommentBox'
import FavoriteButton from '@/components/FavoriteButton'
import DocumentPreview from '@/components/DocumentPreview'
import DocumentDetails from '@/components/DocumentDetails'
import LikeButton from '@/components/LikeButton'
import ReactionBar from '@/components/ReactionBar'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  username: string | null;
  avatar_url: string | null;
  points: number | null;
}

interface Documento {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_type: string;
  created_at: string;
  category: string;
  subject: string;
  university: string;
  career: string;
  type: string;
  user_id: string;
  profiles: Profile | null;
  downloads: number;
  likes: number;
  file_path: string;
}

interface NivelInfo {
  nivel: string;
  medalla: string;
  color: string;
  next: number | null;
}

export default function DocumentoDetalle() {
  const params = useParams();
  const id = params?.id as string;
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [error, setError] = useState<string | null>(null);


  

  const fetchData = useCallback(async () => {
    if (!id) {
      setError("ID del documento no encontrado en la URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setUser(sessionData.session?.user ?? null);

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*, profiles(username, avatar_url, points)')
        .eq('id', id)
        .single<Documento>();

      if (docError) {
        setError(docError.message);
        setDocumento(null);
      } else {
        setDocumento(docData);
      }
    } catch (err) {
      const typedError = err as Error;
      console.error("Error fetching document details:", typedError);
      setError(`Error al cargar el documento: ${typedError.message}`);
      setDocumento(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-lg text-red-500 py-10">{error}</p>;
  }

  if (!documento) {
    return <p className="text-center text-lg text-gray-500 py-10">Documento no encontrado.</p>;
  }

  
  const { nivel, medalla, color, next }: NivelInfo = getNivelYMedalla(documento.profiles?.points || 0);

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-10 p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📄 {documento.title}</h1>

      {documento.profiles && (
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={documento.profiles.avatar_url || undefined} alt="avatar" />
            <AvatarFallback>{documento.profiles.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800">@{documento.profiles.username}</p>
            <p className={`text-sm ${color}`}>🏅 {nivel} ({medalla})</p>
            <p className="text-sm text-green-600">🧠 {documento.profiles.points || 0} puntos</p>
            {next !== null && (
              <p className="text-xs text-gray-500">
                Faltan <strong>{Math.max(0, next - documento.profiles.points!)}</strong> puntos para subir de nivel.
              </p>
            )}
          </div>
        </div>
      )}

      <DocumentPreview filePath={documento.file_path} canViewFull={true} />

      <div className="my-6">
        <DocumentDetails document={{
          ...documento,
          uploaded_by: documento.profiles?.username || 'UsuarioAnónimo'
        }} />
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-700 mb-8">
        <span>⬇️ Descargas: {documento.downloads}</span>
        <LikeButton docId={documento.id} initialLikes={documento.likes} userId={user?.id} />
        {user && <FavoriteButton userId={user.id} documentId={documento.id} />}
      </div>

      {user && <CommentBox documentId={documento.id} user={user} />}

      <ReactionBar documentId={documento.id} />
    </div>
  );
}

function getNivelYMedalla(points: number = 0): NivelInfo {
  if (points >= 500) return { nivel: 'Gran Maestro del Saber', medalla: '💎 Diamante', color: 'text-cyan-500', next: null };
  if (points >= 300) return { nivel: 'Maestro Erudito', medalla: '👑 Oro Estelar', color: 'text-yellow-500', next: 500 };
  if (points >= 150) return { nivel: 'Sabio Conocedor', medalla: '🥈 Plata Brillante', color: 'text-gray-400', next: 300 };
  if (points >= 50) return { nivel: 'Explorador Curioso', medalla: '🥉 Bronce Sólido', color: 'text-orange-500', next: 150 };
  return { nivel: 'Aprendiz Novato', medalla: '🧑‍🎓 Iniciado', color: 'text-green-500', next: 50 };
}
