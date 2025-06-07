// perfil-publico/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import CommentBox from '@/components/CommentBox'
import { Loader2, Download, MessageSquare, Share2, GraduationCap, Building } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserProfileData {
  id: string;
  username: string | null;
  avatar_url: string | null;
  points: number | null;
  universidad: string | null;
  carrera: string | null;
}

interface DocumentSummary {
  id: string;
  file_name: string;
  category: string;
  created_at: string;
  downloads: number | null;
  likes: number | null;
  file_path: string;
}

interface NivelInfo {
  nivel: string;
  medalla: string;
  color: string;
  next: number | null;
}

function getNivelYMedalla(points: number = 0): NivelInfo {
  if (points >= 500) return { nivel: 'Gran Maestro del Saber', medalla: '💎 Diamante', color: 'text-cyan-500', next: null };
  if (points >= 300) return { nivel: 'Maestro Erudito', medalla: '👑 Oro Estelar', color: 'text-yellow-500', next: 500 };
  if (points >= 150) return { nivel: 'Sabio Conocedor', medalla: '🥈 Plata Brillante', color: 'text-gray-400', next: 300 };
  if (points >= 50) return { nivel: 'Explorador Curioso', medalla: '🥉 Bronce Sólido', color: 'text-orange-500', next: 150 };
  return { nivel: 'Aprendiz Novato', medalla: '🧑‍🎓 Iniciado', color: 'text-green-500', next: 50 };
}

export default function PerfilPublicoPage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [favoritos, setFavoritos] = useState<DocumentSummary[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setLoggedInUser(session?.user ?? null);

      if (!username) {
        notFound();
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, points, universidad, carrera')
        .eq('username', username)
        .single<UserProfileData>();

      if (profileError) {
        if (profileError.code === 'PGRST116') notFound();
        throw profileError;
      }
      if (!profileData) {
        notFound();
        return;
      }
      setProfile(profileData);

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at, downloads, likes, file_path')
        .eq('user_id', profileData.id)
        .eq('status', 'aprobado')
        .eq('public', true)
        .order('created_at', { ascending: false });

      if (docError) throw docError;
      setDocs(docData || []);

      const { data: favQueryData, error: favError } = await supabase
        .from('favorites')
        .select('documents (id, file_name, category, created_at, downloads, likes, file_path)')
        .eq('user_id', profileData.id);

      if (favError) throw favError;

      const favoriteDocuments = (favQueryData || [])
        .map(fav => fav.documents)
        .flat()
        .filter(Boolean) as DocumentSummary[];
      setFavoritos(favoriteDocuments);

    } catch (err) {
      const typedError = err as Error;
      if (typedError.message.includes("PGRST116")) {
        notFound();
      } else {
        setError(`Error al cargar el perfil: ${typedError.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-6 h-6 animate-spin" /></div>
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!profile) return <p className="text-center mt-10 text-gray-500 dark:text-gray-400">Perfil no encontrado.</p>;

  const { nivel, medalla, color, next } = getNivelYMedalla(profile.points || 0);

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-blue-500">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{profile.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.username}</h1>
            <p className={`text-sm mt-1 font-medium ${color}`}>🏅 {nivel} ({medalla})</p>
            <p className="text-green-600 dark:text-green-400 text-sm">🧠 {profile.points || 0} puntos</p>
            {next !== null && <p className="text-xs text-gray-500 dark:text-gray-400">Faltan {next - (profile.points || 0)} puntos para el siguiente nivel.</p>}
            <a href={`https://wa.me/?text=Visita%20el%20perfil%20de%20${profile.username}%20en%20StudyDocu`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
              <Share2 className="inline mr-1" size={14} /> Compartir en WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {profile.carrera && <p className="flex items-center gap-2"><GraduationCap size={16} /> Carrera: {profile.carrera}</p>}
          {profile.universidad && <p className="flex items-center gap-2"><Building size={16} /> Universidad: {profile.universidad}</p>}
        </div>
      </header>

      {docs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">📄 Documentos Públicos</h2>
          <DocTable docs={docs} loggedInUser={loggedInUser} />
        </section>
      )}

      {favoritos.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">⭐ Favoritos</h2>
          <DocTable docs={favoritos} loggedInUser={loggedInUser} />
        </section>
      )}

      {docs.length === 0 && favoritos.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Este usuario no tiene documentos para mostrar.</p>}
    </div>
  );
}

interface DocTableProps {
  docs: DocumentSummary[];
  loggedInUser: SupabaseUser | null;
}

function DocTable({ docs, loggedInUser }: DocTableProps) {
  const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || 'YOUR_PROJECT_ID';
  const fileUrlBase = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/documents`;

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Categoría</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-center p-2">⬇️</th>
            <th className="text-center p-2">👍</th>
            <th className="text-center p-2">💬</th>
            <th className="text-left p-2">Descargar</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(doc => (
            <tr key={doc.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <td className="p-2 font-medium">
                <Link href={`/documents/${doc.id}`} className="hover:underline text-blue-600 dark:text-blue-400">{doc.file_name}</Link>
              </td>
              <td className="p-2">{doc.category}</td>
              <td className="p-2">{new Date(doc.created_at).toLocaleDateString('es-ES')}</td>
              <td className="text-center p-2">{doc.downloads || 0}</td>
              <td className="text-center p-2">{doc.likes || 0}</td>
              <td className="text-center p-2">
                {loggedInUser
                  ? <CommentBox documentId={doc.id} user={loggedInUser} />
                  : <Link href={`/documents/${doc.id}#comments`}><MessageSquare size={16} /></Link>}
              </td>
              <td className="p-2">
                <a
                  href={`${fileUrlBase}/${doc.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-300 border px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-800"
                  download
                >
                  <Download size={14} /> Descargar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
