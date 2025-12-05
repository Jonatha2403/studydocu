'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CommentBox from '@/components/CommentBox'
import {
  Loader2,
  Download,
  MessageSquare,
  Share2,
  GraduationCap,
  Building,
  ArrowLeft,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// 👇 Usa el mismo componente que en Configuración/Perfil
import LottieAvatar from '@/components/LottieAvatar'

// ==========================
// Types
// ==========================
interface UserProfileData {
  id: string
  username: string | null
  avatar_url: string | null
  points: number | null
  universidad: string | null
  carrera: string | null
  // Si en tu tabla tienes updated_at y lo seleccionas, puedes añadirlo:
  // updated_at?: string | null
}

interface DocumentSummary {
  id: string
  file_name: string
  category: string
  created_at: string
  downloads: number | null
  likes: number | null
  file_path: string
}

interface NivelInfo {
  nivel: string
  medalla: string
  colorClass: string
  next: number | null
}

// ==========================
// Helpers
// ==========================
function getNivelYMedalla(points: number = 0): NivelInfo {
  if (points >= 500)
    return { nivel: 'Gran Maestro del Saber', medalla: '💎 Diamante', colorClass: 'text-cyan-500', next: null }
  if (points >= 300)
    return { nivel: 'Maestro Erudito', medalla: '👑 Oro Estelar', colorClass: 'text-yellow-500', next: 500 }
  if (points >= 150)
    return { nivel: 'Sabio Conocedor', medalla: '🥈 Plata Brillante', colorClass: 'text-gray-400', next: 300 }
  if (points >= 50)
    return { nivel: 'Explorador Curioso', medalla: '🥉 Bronce Sólido', colorClass: 'text-orange-500', next: 150 }
  return { nivel: 'Aprendiz Novato', medalla: '🧑‍🎓 Iniciado', colorClass: 'text-green-500', next: 50 }
}

// Helpers para avatar (Lottie vs imagen)
const getCleanUrl = (u?: string | null) => (u ? u.split('?')[0] : '')
const isLottieUrl = (u?: string | null) => getCleanUrl(u).endsWith('.json')

// ==========================
// Component
// ==========================
export default function PerfilPublicoClient({ username }: { username: string }) {
  const safeUsername = (username || '').trim().toLowerCase()

  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [docs, setDocs] = useState<DocumentSummary[]>([])
  const [favoritos, setFavoritos] = useState<DocumentSummary[]>([])
  const [loggedInUser, setLoggedInUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // cache-buster local solo para imágenes (si en el futuro seleccionas updated_at, úsalo aquí)
  const [avatarVersion] = useState<number>(Date.now())

  const whatsappShare = useMemo(() => {
    const txt = encodeURIComponent(`Visita el perfil de ${safeUsername} en StudyDocu`)
    return `https://wa.me/?text=${txt}`
  }, [safeUsername])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Sesión actual (para habilitar CommentBox cuando haya login)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      setLoggedInUser(session?.user ?? null)

      if (!safeUsername) {
        setError('Nombre de usuario inválido.')
        setProfile(null)
        setDocs([])
        setFavoritos([])
        return
      }

      // Perfil por username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, points, universidad, carrera') // añade updated_at si lo quieres usar aquí
        .eq('username', safeUsername)
        .single<UserProfileData>()

      if (profileError || !profileData) {
        setError('Perfil no encontrado.')
        setProfile(null)
        setDocs([])
        setFavoritos([])
        return
      }
      setProfile(profileData)

      // Documentos públicos aprobados
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at, downloads, likes, file_path')
        .eq('user_id', profileData.id)
        .eq('status', 'aprobado')
        .eq('public', true)
        .order('created_at', { ascending: false })
      if (docError) throw docError
      setDocs(docData || [])

      // Favoritos
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('documents (id, file_name, category, created_at, downloads, likes, file_path)')
        .eq('user_id', profileData.id)
      if (favError) throw favError

      const favoriteDocuments = (favData || [])
        .map((f: any) => f.documents)
        .flat()
        .filter(Boolean) as DocumentSummary[]
      setFavoritos(favoriteDocuments)
    } catch (err) {
      setError(`Error al cargar el perfil: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [safeUsername])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ==========================
  // Render
  // ==========================
  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Cargando perfil…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <button
          onClick={() => history.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="text-sm text-muted-foreground">Perfil no encontrado.</div>
      </div>
    )
  }

  const { nivel, medalla, colorClass, next } = getNivelYMedalla(profile.points || 0)

  // Construcción del avatar: Lottie vs imagen
  const isLottie = isLottieUrl(profile.avatar_url)
  const cleanUrl = getCleanUrl(profile.avatar_url)
  const avatarSrc =
    !isLottie && profile.avatar_url
      ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${avatarVersion}`
      : undefined

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar público: soporta Lottie y foto */}
          {isLottie ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 grid place-items-center bg-muted">
              <LottieAvatar src={cleanUrl} size={96} />
            </div>
          ) : (
            <Avatar className="w-24 h-24 border-4 border-blue-500">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{profile.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          )}

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.username}</h1>
            <p className={`text-sm mt-1 font-medium ${colorClass}`}>🏅 {nivel} ({medalla})</p>
            <p className="text-green-600 dark:text-green-400 text-sm">🧠 {profile.points || 0} puntos</p>
            {next !== null && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Faltan {Math.max(0, next - (profile.points || 0))} puntos para el siguiente nivel.
              </p>
            )}
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" /> Compartir en WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {profile.carrera && (
            <p className="flex items-center gap-2"><GraduationCap size={16} /> Carrera: {profile.carrera}</p>
          )}
          {profile.universidad && (
            <p className="flex items-center gap-2"><Building size={16} /> Universidad: {profile.universidad}</p>
          )}
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

      {docs.length === 0 && favoritos.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">Este usuario no tiene documentos para mostrar.</p>
      )}
    </div>
  )
}

// ==========================
// Subcomponentes
// ==========================
interface DocTableProps {
  docs: DocumentSummary[]
  loggedInUser: SupabaseUser | null
}

function DocTable({ docs, loggedInUser }: DocTableProps) {
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(path)
    return data?.publicUrl || '#'
  }

  return (
    <div className="overflow-x-auto rounded-md border">
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
          {docs.map((doc) => (
            <tr
              key={doc.id}
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td className="p-2 font-medium">
                <Link href={`/documents/${doc.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                  {doc.file_name}
                </Link>
              </td>
              <td className="p-2">{doc.category}</td>
              <td className="p-2">{new Date(doc.created_at).toLocaleDateString('es-ES')}</td>
              <td className="text-center p-2">{doc.downloads || 0}</td>
              <td className="text-center p-2">{doc.likes || 0}</td>
              <td className="text-center p-2">
                {loggedInUser ? (
                  <CommentBox documentId={doc.id} user={loggedInUser} />
                ) : (
                  <Link href={`/documents/${doc.id}#comments`} aria-label="Ver comentarios">
                    <MessageSquare size={16} />
                  </Link>
                )}
              </td>
              <td className="p-2">
                <a
                  href={getPublicUrl(doc.file_path)}
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
  )
}
