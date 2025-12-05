// src/app/admin/documentos-reportados/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileWarning, ArrowLeft, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'

interface ReportedDoc {
  id: string
  title: string
  created_at: string
  report_count: number
}

export default function ReportedDocsPage() {
  const { perfil, loading: loadingPerfil } = useUserContext()
  const role = (perfil as any)?.role

  const [docs, setDocs] = useState<ReportedDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Traemos reportes + documento relacionado
        const { data, error } = await supabase
          .from('reports')
          .select(`
            id,
            document_id,
            reason,
            created_at,
            documents (
              id,
              title,
              created_at
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[REPORTED_DOCS_LOAD_ERROR]', error)
          toast.error('No se pudieron cargar los documentos reportados.')
          return
        }

        // Agrupar reportes por documento
        const grouped: Record<string, ReportedDoc> = {}

        ;(data || []).forEach((row: any) => {
          const doc = row.documents
          if (!doc) return // por si el doc fue eliminado

          if (!grouped[doc.id]) {
            grouped[doc.id] = {
              id: doc.id,
              title: doc.title,
              created_at: doc.created_at,
              report_count: 1,
            }
          } else {
            grouped[doc.id].report_count += 1
          }
        })

        setDocs(Object.values(grouped))
      } catch (err) {
        console.error('[REPORTED_DOCS_FATAL_ERROR]', err)
        toast.error('Error inesperado al cargar los documentos reportados.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Carga o permisos
  if (loadingPerfil || loading) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 animate-spin" />
          <span>Cargando documentos reportados…</span>
        </div>
      </main>
    )
  }

  if (role !== 'admin') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 px-4">
        <p className="text-lg font-semibold text-center">
          No tienes permisos para ver esta sección (admin requerido).
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      {/* Header con flecha */}
      <header className="mb-8 space-y-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel de administración
        </Link>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileWarning className="w-6 h-6 text-red-500" />
            Documentos reportados
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Documentos que han recibido reportes por parte de los usuarios.
          </p>
        </div>
      </header>

      {docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay documentos reportados.
        </p>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <article
              key={doc.id}
              className="border rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-sm"
            >
              <h2 className="font-semibold text-sm">{doc.title}</h2>

              <p className="text-xs text-muted-foreground mt-1">
                Reportes:{' '}
                <span className="font-semibold">{doc.report_count}</span>
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Subido el:{' '}
                {new Date(doc.created_at).toLocaleString('es-EC', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>

              {/* Aquí luego puedes agregar:
                  - Botón "Ver documento"
                  - Botón "Ver detalles de reportes"
                  - Botón "Eliminar / despublicar" */}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
