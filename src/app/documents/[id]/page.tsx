'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
  username: string | null
  avatar_url: string | null
  points: number | null
}

interface Documento {
  id: string
  title: string
  description: string
  file_name: string
  file_type: string
  created_at: string
  category: string
  subject: string
  university: string
  career: string
  type: string
  user_id: string
  profiles: Profile | null
  downloads: number
  likes: number
  file_path: string
}

interface NivelInfo {
  nivel: string
  medalla: string
  color: string
  next: number | null
}

export default function DocumentoDetalle() {
  // ✅ normalizar id
  const rawParams = useParams() as Readonly<Record<string, string | string[]>>
  const id = rawParams?.id
    ? (Array.isArray(rawParams.id) ? rawParams.id[0] : rawParams.id)
    : undefined

  const [documento, setDocumento] = useState<Documento | null>(null)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!id) {
      setError('ID del documento no encontrado en la URL.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    try {
      // sesión
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      setUser(sessionData.session?.user ?? null)

      // documento (sin join por RLS)
      const { data: d, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (docError) throw docError
      if (!d) {
        setDocumento(null)
        setError('Documento no encontrado.')
        return
      }

      // perfil del autor (consulta separada — si RLS no deja, seguimos sin romper)
      let profile: Profile | null = null
      const { data: p, error: pErr } = await supabase
        .from('profiles')
        .select('username, avatar_url, points')
        .eq('id', d.user_id)
        .maybeSingle()
      if (!pErr && p) profile = p

      // map a nuestro tipo local (manejo de posibles nombres de campos)
      const mapped: Documento = {
        id: d.id,
        title: d.title ?? d.file_name ?? 'Documento',
        description: d.description ?? '',
        file_name: d.file_name ?? '',
        file_type: d.file_type ?? '',
        created_at: d.created_at,
        category: d.category ?? '',
        subject: d.subject ?? '',
        university: d.university ?? '',
        career: d.career ?? '',
        type: d.type ?? '',
        user_id: d.user_id,
        profiles: profile,
        downloads: d.downloads ?? d.download_count ?? 0,
        likes: d.likes ?? 0,
        file_path: d.file_path ?? '',
      }
      setDocumento(mapped)

      // URL de storage (firmada -> pública)
      const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'
      let objectKey = (mapped.file_path || '').replace(/^\/+/, '')
      if (objectKey.startsWith(`${BUCKET}/`)) {
        objectKey = objectKey.slice(BUCKET.length + 1)
      }

      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(objectKey, 60 * 60)
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectKey)
      const url = signed?.signedUrl || pub?.publicUrl || null
      setPublicUrl(url)
    } catch (err) {
      const e = err as Error
      console.error('Error fetching document details:', e)
      setError(`Error al cargar el documento: ${e.message}`)
      setDocumento(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const ext = useMemo(() => {
    const name = (documento?.file_name || documento?.file_path || '').toLowerCase()
    const m = name.match(/\.(\w+)$/)
    return m ? m[1] : ''
  }, [documento])

  const isPDF = ext === 'pdf'
  const officeViewerUrl = useMemo(
    () => (publicUrl ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}` : null),
    [publicUrl]
  )
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-lg text-red-500 py-10">{error}</p>
  }

  if (!documento) {
    return <p className="text-center text-lg text-gray-500 py-10">Documento no encontrado.</p>
  }

  const { nivel, medalla, color, next }: NivelInfo = getNivelYMedalla(documento.profiles?.points || 0)

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
                Faltan <strong>{Math.max(0, next - (documento.profiles.points || 0))}</strong> puntos para subir de nivel.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Visor: PDF nativo / Office online / Fallback de descarga */}
      <div className="rounded-2xl overflow-hidden border bg-background mb-6">
        {publicUrl && isPDF && <DocumentPreview filePath={publicUrl} canViewFull={true} />}

        {publicUrl && !isPDF && isOffice && (
          <iframe src={officeViewerUrl ?? undefined} className="w-full h-[75vh]" title="Vista previa Office" />
        )}

        {(!publicUrl || (!isPDF && !isOffice)) && (
          <div className="p-6 text-center text-sm text-gray-600">
            No se pudo cargar la vista previa.{' '}
            {publicUrl ? (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Abrir / descargar archivo
              </a>
            ) : (
              'No hay URL disponible del archivo.'
            )}
          </div>
        )}
      </div>

      <div className="my-6">
        <DocumentDetails
          document={{
            ...documento,
            uploaded_by: documento.profiles?.username || 'UsuarioAnónimo',
          }}
        />
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-700 mb-8">
        <span>⬇️ Descargas: {documento.downloads}</span>
        <LikeButton docId={documento.id} initialLikes={documento.likes} userId={user?.id} />
        {user && <FavoriteButton userId={user.id} documentId={documento.id} />}
      </div>

      {user && <CommentBox documentId={documento.id} user={user} />}

      <ReactionBar documentId={documento.id} />
    </div>
  )
}

function getNivelYMedalla(points: number = 0): NivelInfo {
  if (points >= 500) return { nivel: 'Gran Maestro del Saber', medalla: '💎 Diamante', color: 'text-cyan-500', next: null }
  if (points >= 300) return { nivel: 'Maestro Erudito', medalla: '👑 Oro Estelar', color: 'text-yellow-500', next: 500 }
  if (points >= 150) return { nivel: 'Sabio Conocedor', medalla: '🥈 Plata Brillante', color: 'text-gray-400', next: 300 }
  if (points >= 50) return { nivel: 'Explorador Curioso', medalla: '🥉 Bronce Sólido', color: 'text-orange-500', next: 150 }
  return { nivel: 'Aprendiz Novato', medalla: '🧑‍🎓 Iniciado', color: 'text-green-500', next: 50 }
}
