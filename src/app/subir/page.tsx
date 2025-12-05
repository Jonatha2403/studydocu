'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { User, Session } from '@supabase/supabase-js'

interface Document {
  id: string
  file_name: string
  file_path: string
  created_at: string
  category: string
  status?: string
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
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [notification, setNotification] = useState<Notification | null>(null)

  const router = useRouter()

  const displayNotification = (message: string, type: Notification['type'], duration = 4000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  // 📌 Traer documentos del usuario
  const fetchDocuments = useCallback(
    async (): Promise<Document[]> => {
      if (!user) return []
      setDocumentsLoading(true)
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('id, file_name, file_path, created_at, category, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setDocuments(data ?? [])
        return data ?? []
      } catch (error) {
        console.error('Error fetching documents:', error)
        displayNotification('Error al cargar documentos', 'error')
        return []
      } finally {
        setDocumentsLoading(false)
      }
    },
    [user],
  )

  // 📌 Generar URLs firmadas para todos los documentos
  const generateSignedUrls = useCallback(async (docs: Document[]) => {
    const urls: Record<string, string> = {}

    for (const doc of docs) {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60 * 60) // 1 hora válido

      if (!error && data?.signedUrl) {
        urls[doc.id] = data.signedUrl
      }
    }

    setSignedUrls(urls)
  }, [])

  // 📌 Cargar usuario autenticado
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
        displayNotification('Error al cargar sesión', 'error')
      } finally {
        setInitialLoading(false)
      }
    }

    cargarUsuario()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setUser(session?.user ?? null)
      },
    )

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  // 📌 Recargar documentos y URLs cuando haya usuario
  useEffect(() => {
    if (user) {
      fetchDocuments().then((docs) => {
        if (docs.length > 0) {
          generateSignedUrls(docs)
        }
      })
    } else {
      setDocuments([])
    }
  }, [user, fetchDocuments, generateSignedUrls])

  // 📌 Redirigir a /iniciar-sesion si ya sabemos que NO hay usuario
  useEffect(() => {
    if (!initialLoading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [initialLoading, user, router])

  // 🌀 Mientras se verifica la sesión, o mientras redirigimos, mostramos loader
  if (initialLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-4" />
        <p>🔄 Verificando sesión del usuario...</p>
      </div>
    )
  }

  // ✅ Usuario autenticado → mostramos la página de subida
  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📄 Subir nuevo documento PDF, Word o Excel
      </h1>
      <p className="mb-4 text-gray-600 text-sm text-center">
        Solo se permiten archivos con texto legible. Archivos vacíos, duplicados o sin categoría serán
        rechazados.
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
        onUploadComplete={async () => {
          setProcessingUpload(true)
          displayNotification('Procesando documento subido...', 'info', 6000)
          const docs = await fetchDocuments()
          await generateSignedUrls(docs)
          setProcessingUpload(false)
        }}
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
            {documents.map((doc) => {
              const signedUrl = signedUrls[doc.id] || '#'

              return (
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

                    <div className="flex flex-col items-end gap-2">
                      {/* Estado */}
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

                      {/* Botones Ver / Descargar */}
                      {signedUrl !== '#' && (
                        <div className="flex gap-2">
                          <a
                            href={signedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          >
                            👁 Ver
                          </a>
                          <a
                            href={signedUrl}
                            download={doc.file_name}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          >
                            ⬇ Descargar
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
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
