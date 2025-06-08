'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Reporte {
  id: string;
  motivo: string;
  created_at: string;
  documents: {
    id: string;
    file_name: string;
    file_path?: string;
  } | null;
  profiles: {
    id: string;
    username: string;
  } | null;
}

export default function AdminReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReportes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        motivo,
        created_at,
        documents ( id, file_name, file_path ),
        profiles ( id, username )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Error al obtener reportes')
    } else {
      setReportes((data as unknown) as Reporte[] || [])
    }
    setLoading(false)
  }

  const handleEliminar = async (id: string, documentId: string | undefined) => {
    if (!documentId) return toast.error('Documento no válido.')
    if (!confirm('¿Deseas aprobar y eliminar este reporte?')) return

    const { error: deleteError } = await supabase.from('reports').delete().eq('id', id)
    const { error: approveError } = await supabase.from('documents').update({ aprobado: true }).eq('id', documentId)

    if (deleteError || approveError) {
      toast.error('❌ Error al aprobar/eliminar el reporte')
    } else {
      toast.success('✅ Reporte eliminado y documento aprobado')
      setReportes(prev => prev.filter(r => r.id !== id))

      // Notificación al autor del documento
      const userId = reportes.find(r => r.id === id)?.profiles?.id
      if (userId) {
        const { error: notifyError } = await supabase.from('notifications').insert({
          user_id: userId,
          title: '✅ Documento aprobado',
          message: 'Tu documento ha sido aprobado tras revisión de un reporte.',
          link: `/documento/${documentId}`,
          created_at: new Date().toISOString(),
        })
        if (notifyError) console.error('Error enviando notificación:', notifyError)
      }
    }
  }

  useEffect(() => {
    fetchReportes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando reportes...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">🚨 Reportes de documentos</h1>
      {reportes.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No hay reportes registrados.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">📄 Documento</th>
                <th className="text-left px-3 py-2">👤 Usuario</th>
                <th className="text-left px-3 py-2">📝 Motivo</th>
                <th className="text-left px-3 py-2">📅 Fecha</th>
                <th className="text-left px-3 py-2">✅ Acción</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link
                      href={`/documento/${r.documents?.id}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      legacyBehavior>
                      {r.documents?.file_name || '—'}
                    </Link>
                  </td>
                  <td className="px-3 py-2">@{r.profiles?.username || '—'}</td>
                  <td className="px-3 py-2">{r.motivo}</td>
                  <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleEliminar(r.id, r.documents?.id)}
                      className="text-green-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> Aprobar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
