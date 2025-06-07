// app/admin/revisar/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Eye, CheckCircle, XCircle, Globe } from 'lucide-react'
import Link from 'next/link'

export default function RevisorAdmin() {
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPendientes = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*, profiles(username, points)')
      .eq('status', 'pendiente')
      .order('created_at', { ascending: false })

    setPendientes(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPendientes()
  }, [])

  const actualizarEstado = async (doc: any, status: string) => {
    await supabase.from('documents').update({ status }).eq('id', doc.id)

    if (status === 'aprobado') {
      await supabase.from('profiles').update({ points: doc.profiles?.points + 10 || 10 }).eq('id', doc.user_id)
      await supabase.from('audit_logs').insert({
        user_id: doc.user_id,
        action: 'admin_approved_document',
        details: { file_name: doc.file_name, category: doc.category },
      })
    } else if (status === 'rechazado') {
      await supabase.from('audit_logs').insert({
        user_id: doc.user_id,
        action: 'admin_rejected_document',
        details: { file_name: doc.file_name, category: doc.category },
      })
    }

    fetchPendientes()
  }

  const togglePublico = async (id: string, actual: boolean) => {
    await supabase.from('documents').update({ public: !actual }).eq('id', id)
    fetchPendientes()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-4" />
        <p>Cargando documentos pendientes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Revisión de Documentos Pendientes</h1>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Volver al dashboard admin</Link>
      </div>

      {pendientes.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No hay documentos pendientes por revisar. 🎉</p>
      ) : (
        <ul className="space-y-4">
          {pendientes.map((doc) => (
            <li key={doc.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">📄 {doc.file_name}</p>
                      <p className="text-sm text-gray-500">
                        🏷️ {doc.category} | 📅 {new Date(doc.created_at).toLocaleDateString()} | 👤 {doc.profiles?.username}
                      </p>
                      <p className="text-xs text-gray-400">ID: {doc.id}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => actualizarEstado(doc, 'aprobado')}
                        className="text-green-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Aprobar
                      </button>
                      <button
                        onClick={() => actualizarEstado(doc, 'rechazado')}
                        className="text-red-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <XCircle size={16} /> Rechazar
                      </button>
                      <button
                        onClick={() => togglePublico(doc.id, doc.public)}
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Globe size={16} /> {doc.public ? 'Ocultar' : 'Hacer público'}
                      </button>
                    </div>
                  </div>
                  {doc.content && (
                    <div className="mt-2 bg-gray-100 p-2 rounded text-xs text-gray-700 whitespace-pre-line max-h-40 overflow-y-auto">
                      <p><strong>Vista previa:</strong></p>
                      <p>{doc.content.slice(0, 500)}...</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
