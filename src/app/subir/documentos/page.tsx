// src/app/subir/documentos/page.tsx
'use client'

import { useEffect, useState, useCallback, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import UserProfileEdit from '@/components/UserProfileEdit'
import UploadForm from '@/components/UploadForm'
import Auth from '@/components/Auth'
import { Loader2, LogOut, Search, UploadCloud, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

// --- Interfaces for Tipado ---
interface DocumentEntry {
  id: string
  file_name: string
  created_at: string
  category: string
  status?: string
  version?: number
}

interface UserProfile {
  id: string
  nombre: string | null
  carrera: string | null
  universidad: string | null
  // Add other profile fields as needed
}

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true) // True initially for session check
  const [documents, setDocuments] = useState<DocumentEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDocs, setFilteredDocs] = useState<DocumentEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchInitialData = useCallback(async (currentUser: SupabaseUser) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, nombre, carrera, universidad')
        .eq('id', currentUser.id)
        .single<UserProfile>()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.warn('Profile not found for user:', currentUser.id)
          setProfile(null)
        } else {
          throw profileError
        }
      } else {
        setProfile(profileData)
      }
    } catch (err) {
      const typedError = err as Error
      console.error('Error fetching profile:', typedError)
      setError(`Error al cargar el perfil: ${typedError.message}`)
      setProfile(null)
    }
  }, [])

  const fetchDocuments = useCallback(async (currentUserId: string) => {
    try {
      const { data, error: docError } = await supabase
        .from('documents')
        .select('id, file_name, created_at, category, status, version')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })

      if (docError) throw docError

      setDocuments(data || [])
    } catch (err) {
      const typedError = err as Error
      console.error('Error fetching documents:', typedError)
      setError(`Error al cargar documentos: ${typedError.message}`)
      setDocuments([])
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    const processUserSession = async (sessionUser: SupabaseUser | null) => {
      setUser(sessionUser)
      if (sessionUser) {
        await fetchInitialData(sessionUser)
        await fetchDocuments(sessionUser.id)
      } else {
        setProfile(null)
        setDocuments([])
      }
    }

    // 1. Verificar sesión inicial
    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          console.error('Error getting initial session:', sessionError)
          setError('Error al verificar la sesión inicial.')
        } else {
          await processUserSession(session?.user ?? null)
        }
        setLoading(false)
      })
      .catch((initialError) => {
        console.error('Exception during initial getSession:', initialError)
        setError('Excepción grave al verificar la sesión inicial.')
        setLoading(false)
      })

    // 2. Escuchar cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await processUserSession(session?.user ?? null)

        if (_event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [fetchInitialData, fetchDocuments, router])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDocs(documents)
      return
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const filtered = documents.filter(
      (doc) =>
        doc.file_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        doc.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        (doc.status?.toLowerCase() ?? '').includes(lowerCaseSearchTerm)
    )
    setFilteredDocs(filtered)
  }, [searchTerm, documents])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      toast.success('Sesión cerrada exitosamente.')
      setUser(null)
      setProfile(null)
      setDocuments([])
      router.push('/')
    } catch (err) {
      const typedError = err as Error
      toast.error(`Error al cerrar sesión: ${typedError.message}`)
      setLoading(false)
    }
  }

  const isProfileComplete = !!(
    profile?.nombre &&
    profile?.carrera &&
    profile?.universidad
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-600" />
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 dark:text-red-400 p-4">
        <AlertTriangle size={48} className="mb-4" />
        <p className="text-lg text-center">Ocurrió un error:</p>
        <p className="text-md mt-2 text-center">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            supabase.auth
              .getSession()
              .then(async ({ data: { session } }) => {
                if (session?.user) {
                  await fetchInitialData(session.user)
                  await fetchDocuments(session.user.id)
                } else {
                  setUser(null)
                }
              })
              .catch((e) => console.error('Error on retry:', e))
              .finally(() => setLoading(false))
          }}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Intentar de Nuevo
        </button>
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto mt-8 mb-10 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UploadCloud size={28} className="text-blue-600" /> Subir Documentos
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1.5 py-2 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-300 text-sm text-center">
        Sube tus apuntes, tareas o exámenes en formato PDF, Word o Excel.
        Asegúrate de que tengan contenido legible.
      </p>

      {/* Editor de perfil: se espera que UserProfileEdit tenga la prop onProfileUpdate en su tipo */}
      <UserProfileEdit
        user={user as SupabaseUser}
        onProfileUpdate={(updatedProfile: UserProfile | null) => {
          setProfile(updatedProfile)
          if (
            updatedProfile?.nombre &&
            updatedProfile?.carrera &&
            updatedProfile?.universidad
          ) {
            toast.success('Perfil actualizado. Ahora puedes subir documentos.')
          }
        }}
      />

      {!isProfileComplete && profile !== null && (
        <div className="my-6 bg-yellow-50 dark:bg-yellow-700/30 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-200 p-4 rounded-md text-sm shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-3 shrink-0" />
            <p>
              <strong>Atención:</strong> Para poder subir documentos, primero
              debes completar tu perfil (nombre, carrera y universidad).
            </p>
          </div>
        </div>
      )}

      {!isProfileComplete && profile === null && !error && (
        <div className="my-6 bg-blue-50 dark:bg-blue-700/30 border-l-4 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-200 p-4 rounded-md text-sm shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-3 shrink-0" />
            <p>
              Parece que aún no has configurado tu perfil. Por favor,
              complétalo arriba.
            </p>
          </div>
        </div>
      )}

      {isProfileComplete && (
        <UploadForm
          user={user as SupabaseUser}
          onUploadComplete={() => {
            if (!user) return
            fetchDocuments(user.id)
            toast.success('🎉 ¡Documento subido y 10 puntos ganados!', {
              duration: 4000,
              style: {
                border: '1px solid #4ade80',
                padding: '12px',
                color: '#15803d',
                background: '#f0fdf4',
              },
              iconTheme: {
                primary: '#4ade80',
                secondary: '#f0fdf4',
              },
            })
          }}
        />
      )}

      {documents.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
              📂 Historial de Documentos Subidos ({filteredDocs.length} de{' '}
              {documents.length})
            </h2>
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o estado..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSearch(e.target.value)
                }
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {filteredDocs.length > 0 ? (
            <ul className="space-y-3">
              {filteredDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-grow mb-2 sm:mb-0">
                      <span className="font-medium text-gray-800 dark:text-gray-100 block break-all">
                        📄 {doc.file_name}
                      </span>
                      <span
                        className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block font-medium ${
                          doc.category === 'Resumen'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100'
                            : doc.category === 'Ensayo'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100'
                            : doc.category === 'Tarea'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100'
                            : doc.category === 'Examen'
                            ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        🏷️ {doc.category}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs block mt-1">
                        📅{' '}
                        {new Date(doc.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {doc.version && (
                          <span className="ml-2 text-blue-500 dark:text-blue-400">
                            🔁 Versión: {doc.version}
                          </span>
                        )}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0 ${
                        doc.status === 'aprobado'
                          ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                          : doc.status === 'rechazado'
                          ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                      }`}
                    >
                      {doc.status
                        ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
                        : 'Pendiente'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No se encontraron documentos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      )}

      {documents.length === 0 && !error && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-6">
          📭 Aún no has subido ningún documento. ¡Anímate a compartir tus
          apuntes!
        </p>
      )}

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link
          href="/admin"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          🔐 Ir al panel de revisión de administradores (si tienes permiso)
        </Link>
      </div>
    </main>
  )
}
