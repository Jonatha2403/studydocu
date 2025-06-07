'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import Auth from '@/components/Auth'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js' // Importar el tipo User

interface Document {
  id: string
  file_name: string
  created_at: string
  category: string
  status?: string
  version?: number
  // content no está aquí, lo cual es consistente con el select actual
}

export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null) // Mejorado: Tipado para user
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true); // Asegurar que loading es true al inicio del efecto
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setNotification(`❌ Error al obtener sesión: ${sessionError.message}`);
        // setUser(null); // Ya se setea a null si data.session.user no existe
      }
      setUser(data?.session?.user ?? null);
      setLoading(false);
    }).catch(error => { // Capturar cualquier error de la promesa en sí
        console.error("Exception during getSession:", error);
        setNotification(`❌ Excepción al obtener sesión: ${(error as Error).message}`);
        setUser(null);
        setLoading(false);
    });

    const { data: listener, error: authListenerError } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // No es necesario setLoading(false) aquí, ya que esto maneja cambios de estado, no la carga inicial.
    });

    if (authListenerError) {
        console.error("Error setting up auth listener:", authListenerError);
        setNotification(`❌ Error con el listener de autenticación: ${authListenerError.message}`);
    }

    return () => {
      // Asegurarse que listener y listener.subscription existen antes de desuscribir
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]); // Limpiar documentos si el usuario cierra sesión o no hay usuario
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) { // Doble verificación por si acaso
        setDocuments([]);
        return;
    }
    // Podrías añadir un estado de carga específico para documentos si la carga es lenta
    // ej. setDocumentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, created_at, category, status, version')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error; // Lanzar el error para ser capturado por el bloque catch
      }

      if (data) {
        setDocuments(data);
      } else {
        setDocuments([]); // Si no hay data, asegurar que documents sea un array vacío
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching documents:", error);
      setNotification(`❌ Error al cargar documentos: ${error.message}`);
      setDocuments([]); // En caso de error, limpiar documentos o mantener los antiguos?
                       // Limpiar es más seguro para evitar mostrar datos incorrectos.
    } finally {
      // ej. setDocumentsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-4" />
        <p>🔄 Cargando sesión del usuario...</p>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">📄 Subir nuevo documento PDF, Word o Excel</h1>
      <p className="mb-4 text-gray-600 text-sm text-center">
        Solo se permiten archivos con texto legible. Archivos vacíos, duplicados o sin categoría serán rechazados.
      </p>
      {notification && (
        <div className={`mb-4 p-3 rounded text-sm text-center ${
            notification.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {notification}
        </div>
      )}
      {/* La integración de onUploadComplete se verá después, como mencionaste */}
      <UploadForm user={user} onUploadComplete={() => {
        fetchDocuments(); // Refresca la lista de documentos
        setNotification('✅ Documento subido correctamente.');
        setTimeout(() => setNotification(null), 4000);
      }} />

      {documents.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2 text-center">📂 Historial de documentos subidos</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {documents.map((doc) => (
              <li key={doc.id} className="border p-3 rounded shadow-sm bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-base">📄 {doc.file_name}</span>
                    <span className="text-xs text-gray-500 italic">🏷️ {doc.category}</span>
                    <span className="text-gray-400 text-xs">📅 {new Date(doc.created_at).toLocaleDateString()}</span>
                    {doc.version && <span className="text-xs text-blue-400">🔁 Versión: {doc.version}</span>}
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    doc.status === 'aprobado' ? 'bg-green-200 text-green-800' :
                    doc.status === 'rechazado' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800' // pendiente u otro
                  }`}>
                    {doc.status || 'pendiente'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Mostrar mensaje si no hay documentos y no está cargando la sesión inicial */}
      {!loading && documents.length === 0 && user && (
          <p className="text-center text-gray-500 mt-10">Aún no has subido ningún documento.</p>
      )}

      <div className="mt-6 text-center">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">🔐 Ir al panel de revisión de administradores</Link>
      </div>

      <div className="mt-10 text-xs text-gray-400 text-center">
        🚀 Próximamente: Resumen automático, dashboard personal, ranking mensual y etiquetas por materia/universidad.
      </div>
    </main>
  );
}