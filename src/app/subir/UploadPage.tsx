'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
// Asegúrate que UserProfileEdit.tsx exista en components/ y se exporte por defecto
import UserProfileEdit from '@/components/UserProfileEdit' 
import Auth from '@/components/Auth'
import { Loader2, LogOut, Search, UploadCloud, AlertTriangle } from 'lucide-react' // Iconos adicionales
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import type { User } from '@supabase/supabase-js' // Tipo específico para el usuario
import { useRouter } from 'next/navigation' // Para redirección

interface DocumentEntry { // Renombrado de 'Document' para evitar colisión con DOM
  id: string
  file_name: string
  created_at: string
  category: string
  status?: string
  version?: number
}

// Asumiendo que UserProfileEdit props son:
// interface UserProfileEditProps {
//   user: User;
//   initialProfile?: UserProfile | null; // UserProfile es otra interfaz que definirías
//   onProfileUpdate?: (updatedProfile: UserProfile | null) => void;
// }
// Si UserProfileEdit solo necesita 'user', la implementación actual está bien.

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocumentEntry[]>([]);
  // const [profile, setProfile] = useState<UserProfile | null>(null); // Si UserProfileEdit lo necesita

  const fetchDocuments = useCallback(async () => {
    if (!user) return; // No hacer fetch si no hay usuario

    try {
      setLoading(true); // Podrías tener un loading específico para documentos
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, created_at, category, status, version')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setDocuments(data);
        setFilteredDocs(data); // Inicialmente mostrar todos los documentos
      }
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error(`Error al cargar documentos: ${error.message}`);
      setDocuments([]);
      setFilteredDocs([]);
    } finally {
      setLoading(false); // O el loading específico de documentos
    }
  }, [user]); // Depende de 'user' para re-fetch si el user.id cambia

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        toast.error("Error al obtener la sesión: " + error.message);
        console.error("Session fetch error:", error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(error => {
        console.error("Exception fetching session:", error);
        toast.error("Excepción al obtener la sesión.");
        setUser(null);
        setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Si el usuario cambia, el siguiente useEffect se encargará de fetchDocuments
      if (_event === 'SIGNED_OUT') {
        router.push('/'); // Redirigir al home al cerrar sesión
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      // Aquí podrías fetch el perfil del usuario si UserProfileEdit lo necesita
      // fetchProfile(user); 
    } else {
      setDocuments([]);
      setFilteredDocs([]);
      // setProfile(null); // Limpiar perfil también
    }
  }, [user, fetchDocuments]); // fetchDocuments está en useCallback

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredDocs(documents);
      return;
    }
    const lowerCaseSearchTerm = term.toLowerCase();
    const filtered = documents.filter(doc =>
      doc.file_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      doc.category.toLowerCase().includes(lowerCaseSearchTerm) ||
      (doc.status?.toLowerCase() ?? '').includes(lowerCaseSearchTerm)
    );
    setFilteredDocs(filtered);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Sesión cerrada exitosamente.");
      setUser(null); // Esto disparará el useEffect para limpiar documentos
      // El listener de onAuthStateChange ya debería manejar la redirección o el estado de Auth
    } catch (error: any) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) { // Mostrar loader principal solo si estamos cargando la sesión inicial
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-600" />
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <main className="max-w-3xl mx-auto mt-8 mb-10 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UploadCloud size={28} className="text-blue-600 dark:text-yellow-400"/> Subir Documentos
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1.5 py-2 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-300 text-sm text-center">
        Sube tus apuntes, tareas o exámenes en formato PDF, Word o Excel. Asegúrate de que tengan contenido legible.
      </p>
      {/* Asumiendo que UserProfileEdit necesita el perfil y una forma de actualizarlo:
      <UserProfileEdit 
         user={user} 
         initialProfile={profile} 
         onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)} 
      />
      Si UserProfileEdit solo muestra info del 'user' o la maneja internamente, está bien como está.
      Por ahora, para que compile con tu import, lo dejamos con 'user' solamente.
      */ }
      <UserProfileEdit user={user} />
      <UploadForm 
        user={user} 
        onUploadComplete={() => {
          fetchDocuments(); // Recargar documentos
          toast.success('🎉 ¡Documento subido y 10 puntos ganados!', {
            duration: 4000,
            style: {
              border: '1px solid #4ade80',
              padding: '12px',
              color: '#15803d', // dark green
              background: '#f0fdf4', // light green
            },
            iconTheme: {
              primary: '#4ade80',
              secondary: '#f0fdf4',
            },
          });
        }} 
      />
      {documents.length === 0 && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-6">
          📭 Aún no has subido ningún documento. ¡Anímate a compartir tus apuntes!
        </p>
      )}
      {documents.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
              📂 Historial de Documentos Subidos ({filteredDocs.length} de {documents.length})
            </h2>
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o estado..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 focus:border-blue-500 dark:focus:border-yellow-500"
              />
            </div>
          </div>

          {loading && documents.length === 0 ? ( // Loader específico si estamos cargando documentos y no hay ninguno aún
             (<div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-6">
               <Loader2 className="animate-spin w-6 h-6 mb-3 text-blue-600 dark:text-yellow-400" />
               <p>Cargando documentos...</p>
             </div>)
          ) : filteredDocs.length > 0 ? (
            <ul className="space-y-3">
              {filteredDocs.map((doc) => (
                <li key={doc.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-grow mb-2 sm:mb-0">
                      <span className="font-medium text-gray-800 dark:text-gray-100 block break-all">📄 {doc.file_name}</span>
                      <span className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block font-medium ${
                        doc.category === 'Resumen' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' :
                        doc.category === 'Ensayo' ? 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100' :
                        doc.category === 'Tarea' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100' :
                        doc.category === 'Examen' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                        'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        🏷️ {doc.category}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs block mt-1">
                        📅 {new Date(doc.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {doc.version && <span className="ml-2 text-blue-500 dark:text-blue-400">🔁 v{doc.version}</span>}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0 ${
                      doc.status === 'aprobado' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                      doc.status === 'rechazado' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                    }`}>
                      {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : 'Pendiente'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No se encontraron documentos que coincidan con tu búsqueda.</p>
          )}
        </div>
      )}
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          🔐 Ir al panel de revisión (Admin)
        </Link>
      </div>
    </main>
  );
}