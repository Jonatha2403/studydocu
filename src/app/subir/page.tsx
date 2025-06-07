'use client'

import { useEffect, useState, useCallback } from 'react' // useCallback añadido por si lo usas en fetchDocuments
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import Auth from '@/components/Auth'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
// As per your previous fix, shouldAutoApprove is a default import
import shouldAutoApprove from "@/lib/ai-utils"
import type { User } from '@supabase/supabase-js' // Import User type

interface Document {
  id: string
  file_name: string
  created_at: string
  category: string // Consider making this optional if it's set after upload
  status?: string
  version?: number
  content?: string // Content is crucial for categorization
  user_id?: string // Usually good to have user_id if filtering by it
}

// Assume categorizeDocument is an async function you have defined elsewhere
// e.g., async function categorizeDocument(content: string): Promise<string> { ... }
// Si categorizeDocument está en otro archivo, impórtalo. Si es global (menos común), declare está bien.
declare function categorizeDocument(content: string): Promise<string>;


export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true) // For session loading
  const [documentsLoading, setDocumentsLoading] = useState(false) // For document list loading
  const [processingUpload, setProcessingUpload] = useState(false) // For post-upload processing
  const [documents, setDocuments] = useState<Document[]>([])
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)

  const displayNotification = (message: string, type: 'success' | 'error' | 'info', duration: number = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }

  // useCallback para fetchDocuments si se pasa como dependencia a otros hooks o props
  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    if (!user) return [];
    setDocumentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, created_at, category, status, version, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      if (data) {
        setDocuments(data);
        return data;
      }
      return [];
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      displayNotification(`Error al cargar documentos: ${error.message}`, 'error');
      setDocuments([]); // Asegúrate de limpiar en caso de error también
      return [];
    } finally {
      setDocumentsLoading(false);
    }
  }, [user]); // Dependencia 'user' y 'displayNotification' si no está definida dentro o es estable

  // Effect for initializing user session
  useEffect(() => {
    setInitialLoading(true);
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setInitialLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setUser(null);
      setInitialLoading(false);
      displayNotification(`Error al cargar sesión: ${error.message}`, 'error');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []); // displayNotification como dependencia si se usa aquí y no es estable

  // Effect for fetching documents when user changes
  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]); // Clear documents if user logs out
    }
  }, [user, fetchDocuments]); // fetchDocuments es ahora una dependencia estable

  const handleUploadComplete = async (uploadedDocumentId?: string, uploadedDocumentContent?: string) => {
    setProcessingUpload(true);
    displayNotification('Procesando documento subido...', 'info', 6000);

    try {
      let targetDocument: Document | undefined = undefined;

      if (!user) { // Añadir guarda por si el usuario se desloguea mientras tanto
        throw new Error("Usuario no autenticado.");
      }

      if (uploadedDocumentId) {
        const { data: newDoc, error: newDocError } = await supabase
          .from('documents')
          .select('id, file_name, created_at, category, status, version, content')
          .eq('id', uploadedDocumentId)
          .single();
        if (newDocError) throw new Error(`Error fetching uploaded document: ${newDocError.message}`);
        targetDocument = newDoc;
        if (uploadedDocumentContent && !targetDocument.content) {
          targetDocument.content = uploadedDocumentContent;
        }
      } else {
        const { data: latestDocs, error: latestDocsError } = await supabase
          .from('documents')
          .select('id, file_name, created_at, category, status, version, content')
          .eq('user_id', user.id) 
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (latestDocsError) throw latestDocsError;
        if (latestDocs && latestDocs.length > 0) {
          targetDocument = latestDocs[0];
        }
      }

      if (targetDocument && targetDocument.content) {
        const suggestedCategory = await categorizeDocument(targetDocument.content);
        
        // La llamada es correcta si shouldAutoApprove está definida para tomar 1 argumento.
        // El error ts(2554) se corrige en @/lib/ai-utils.ts (o .js)
        const autoApprove = shouldAutoApprove(suggestedCategory); 

        const { error: updateError } = await supabase
          .from('documents')
          .update({ category: suggestedCategory, status: autoApprove ? 'aprobado' : 'pendiente' })
          .eq('id', targetDocument.id);

        if (updateError) {
          throw updateError;
        }
        displayNotification('✅ Documento procesado y actualizado correctamente.', 'success');
      } else if (targetDocument) {
        displayNotification('ℹ️ Documento subido, pero falta contenido para categorizarlo automáticamente.', 'info');
      } else {
        displayNotification('⚠️ No se encontró el documento recién subido para procesar.', 'error');
      }
    } catch (error: any) {
      console.error("Error processing upload:", error);
      displayNotification(`Error al procesar el documento: ${error.message}`, 'error');
    } finally {
      if (user) { // Solo re-fetch si el usuario sigue logueado
           await fetchDocuments(); 
      }
      setProcessingUpload(false);
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
      <h1 className="text-2xl font-bold mb-6 text-center">📄 Subir nuevo documento PDF, Word o Excel</h1>
      <p className="mb-4 text-gray-600 text-sm text-center">
        Solo se permiten archivos con texto legible. Archivos vacíos, duplicados o sin categoría serán rechazados.
      </p>
      {notification && (
        <div className={`mb-4 p-3 rounded text-sm text-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-200' :
            notification.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-200' :
            'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200' // Info
        }`}>
          {notification.message}
        </div>
      )}
      <UploadForm user={user} onUploadComplete={handleUploadComplete} disabled={processingUpload || documentsLoading} />
      {(documentsLoading || processingUpload) && ( // Mostrar un loader combinado si alguna de las dos acciones está en curso
          (<div className="flex items-center justify-center mt-6 text-gray-500 dark:text-gray-400">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            <p>{processingUpload ? "Procesando el último documento..." : "Cargando historial..."}</p>
          </div>)
      )}
      {!documentsLoading && !processingUpload && documents.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">📂 Historial de documentos subidos</h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {documents.map((doc) => (
              <li key={doc.id} className="border p-3 rounded shadow-sm bg-gray-50 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="font-medium text-base text-gray-800 dark:text-gray-100 truncate" title={doc.file_name}>📄 {doc.file_name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">🏷️ {doc.category || 'Sin categoría'}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">📅 {new Date(doc.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    {doc.version && <span className="text-xs text-blue-400 dark:text-blue-500">🔁 Versión: {doc.version}</span>}
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      doc.status === 'aprobado' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      doc.status === 'rechazado' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100' :
                      'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' // pendiente or other
                  }`}>
                    {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : 'Pendiente'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!documentsLoading && !processingUpload && documents.length === 0 && !initialLoading && (
         <p className="text-center text-gray-500 dark:text-gray-400 mt-10">📭 No hay documentos subidos todavía.</p>
      )}
      <div className="mt-8 mb-4 text-center">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">🔐 Ir al panel de revisión de administradores</Link>
      </div>
    </main>
  );
}