'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, Download, Heart, Copy, AlertTriangle } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import DocumentPreview from '@/components/DocumentPreview'
import { useSession } from '@/hooks/useSession'
import { toast } from 'sonner'

export default function VistaPreviaPage() {
  const { id } = useParams()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSession()

  useEffect(() => {
    const fetchDoc = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`*, profiles (username, universidad)`) // universidad para futuras sugerencias
        .eq('id', id)
        .single()

      if (!error) setDoc(data)
      setLoading(false)
    }

    if (id) fetchDoc()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    )
  }

  if (!doc) return <p className="text-center mt-10 text-gray-500">❌ Documento no encontrado.</p>

  const isPDF = doc.file_name?.toLowerCase().endsWith('.pdf')
  const puedeVerCompleto = user?.suscripcion || doc.user_id === user?.id // acceso por autor o suscripción

  const categoryClasses: Record<string, string> = {
    Resumen: 'bg-blue-100 text-blue-600',
    Ensayo: 'bg-purple-100 text-purple-600',
    Tarea: 'bg-orange-100 text-orange-600',
    Examen: 'bg-red-100 text-red-600',
  }
  const categoryStyle = categoryClasses[doc.category as string] || 'bg-gray-100 text-gray-600'

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('📎 Enlace copiado al portapapeles')
  }

  const handleReport = () => {
    toast('⚠️ Funcionalidad de reporte en desarrollo')
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">👁️ Vista previa de documento</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isPDF ? (
            <DocumentPreview filePath={doc.file_path} canViewFull={puedeVerCompleto} />
          ) : (
            <div className="p-4 text-center text-sm text-gray-600">
              ⚠️ Vista previa solo disponible para archivos PDF.
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700"
            >
              <Copy size={16} /> Copiar enlace
            </button>
            <button
              onClick={handleReport}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
            >
              <AlertTriangle size={16} /> Reportar documento
            </button>
          </div>

          <CommentBox documentId={doc.id} user={user} />
        </div>

        <aside className="bg-white dark:bg-gray-900 p-4 border rounded shadow space-y-3 text-sm">
          <p><strong>📄 Nombre:</strong> {doc.file_name}</p>
          <p>
            <strong>🏷️ Categoría:</strong>{' '}
            <span className={`px-2 py-1 rounded text-xs ${categoryStyle}`}>
              {doc.category}
            </span>
          </p>
          <p><strong>📅 Fecha:</strong> {new Date(doc.created_at).toLocaleDateString()}</p>
          <p>
            <strong>👤 Autor:</strong>{' '}
            <Link
              className="text-blue-600 hover:underline"
              href={`/perfil/usuario/${doc.profiles?.username}`}
            >
              @{doc.profiles?.username}
            </Link>
          </p>
          <p><strong>🎓 Universidad:</strong> {doc.profiles?.universidad || '-'}</p>
          <p className="flex items-center gap-2 text-green-700">
            <Download size={16} /> Descargas: <strong>{doc.downloads || 0}</strong>
          </p>
          <p className="flex items-center gap-2 text-pink-600">
            <Heart size={16} /> Likes: <strong>{doc.likes || 0}</strong>
          </p>

          <a
            href={`https://YOUR_PROJECT.supabase.co/storage/v1/object/public/documents/${doc.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full justify-center"
          >
            <Download size={16} /> Descargar documento
          </a>
        </aside>
      </div>
    </div>
  )
}
