'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import Auth from '@/components/Auth'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { User, Session } from '@supabase/supabase-js'

interface Document {
  id: string
  file_name: string
  created_at: string
  category: string
  status?: string
  version?: number
  content?: string
  user_id?: string
}

interface Notification {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [processingUpload, setProcessingUpload] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [notification, setNotification] = useState<Notification | null>(null)

  const displayNotification = (message: string, type: Notification['type'], duration = 4000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    if (!user) return []
    setDocumentsLoading(true)
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      const result = data ?? []
      setDocuments(result)
      return result
    } catch (error) {
      const err = error as Error
      console.error('Error fetching documents:', err)
      displayNotification(`Error al cargar documentos: ${err.message}`, 'error')
      setDocuments([])
      return []
    } finally {
      setDocumentsLoading(false)
    }
  }, [user])

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user ?? null)
      } catch (error) {
        const err = error as Error
        console.error('Error getting session:', err)
        setUser(null)
        displayNotification(`Error al cargar sesión: ${err.message}`, 'error')
      } finally {
        setInitialLoading(false)
      }
    }

    cargarUsuario()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      void fetchDocuments()
    } else {
      setDocuments([])
    }
  }, [user, fetchDocuments])

  const handleUploadComplete = async () => {
    setProcessingUpload(true)
    displayNotification('Procesando documento subido...', 'info', 6000)

    try {
      const latest = await fetchDocuments()
      const target = latest[0]
      if (!target) {
        displayNotification('⚠️ No se encontró el documento para procesar.', 'error')
        return
      }

      const text = target.content || ''
      const suggestedCategory = text.includes('marketing')
        ? 'Marketing'
        : text.includes('contabilidad')
          ? 'Contabilidad'
          : text.includes('programación')
            ? 'Programación'
            : text.includes('derecho')
              ? 'Derecho'
              : 'General'

      const { error: updateError } = await supabase
        .from('documents')
        .update({ category: suggestedCategory, status: 'pendiente' })
        .eq('id', target.id)

      if (updateError) throw updateError
      displayNotification('✅ Documento procesado y actualizado correctamente.', 'success')
    } catch (error) {
      const err = error as Error
      console.error('Error al procesar:', err)
      displayNotification(`Error al procesar el documento: ${err.message}`, 'error')
    } finally {
      await fetchDocuments()
      setProcessingUpload(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-4" />
        <p>🔄 Cargando sesión del usuario...</p>
      </div>
    )
  }

  if (!user) return <Auth />

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📄 Subir nuevo documento PDF, Word o Excel
      </h1>
      <p className="mb-4 text-gray-600 text-sm text-center">
        Solo se permiten archivos con texto legible. Archivos vacíos, duplicados o sin categoría
        serán rechazados.
      </p>

      {notification && (
        <div
          className={`mb-4 p-3 rounded text-sm text-center ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-700'
              : notification.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      <UploadForm
        user={user}
        onUploadComplete={handleUploadComplete}
        disabled={processingUpload || documentsLoading}
      />

      {(documentsLoading || processingUpload) && (
        <div className="flex items-center justify-center mt-6 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          <p>{processingUpload ? 'Procesando el documento...' : 'Cargando historial...'}</p>
        </div>
      )}

      {!documentsLoading && documents.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2 text-center">
            📂 Historial de documentos subidos
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="border p-3 rounded shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="font-medium text-base truncate" title={doc.file_name}>
                      📄 {doc.file_name}
                    </span>
                    <span className="text-xs italic">🏷️ {doc.category || 'Sin categoría'}</span>
                    <span className="text-gray-400 text-xs">
                      📅 {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      doc.status === 'aprobado'
                        ? 'bg-green-200 text-green-800'
                        : doc.status === 'rechazado'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {doc.status ?? 'pendiente'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!documentsLoading && documents.length === 0 && (
        <p className="text-center text-gray-500 mt-10">📭 No hay documentos subidos todavía.</p>
      )}

      <div className="mt-8 mb-4 text-center">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          🔐 Ir al panel de revisión de administradores
        </Link>
      </div>
    </main>
  )
}
