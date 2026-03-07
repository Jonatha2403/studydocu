'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import { Button } from '@/components/ui/button'

type DocumentEntry = {
  id: string
  file_name: string
  created_at: string
  category: string | null
  status?: string | null
}

export default function DashboardSubirPage() {
  const { user, loading: userLoading } = useUserContext()
  const [documents, setDocuments] = useState<DocumentEntry[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  const fetchDocuments = useCallback(async () => {
    if (!user) return
    setLoadingDocs(true)
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, created_at, category, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8)
      if (error) throw error
      setDocuments(data ?? [])
    } catch (e) {
      console.error('[DASHBOARD_SUBIR_FETCH_DOCS_ERROR]', e)
    } finally {
      setLoadingDocs(false)
    }
  }, [user])

  useEffect(() => {
    if (!userLoading && user) {
      void fetchDocuments()
    }
  }, [userLoading, user, fetchDocuments])

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando...
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 py-4 sm:px-6">
      <header className="rounded-2xl border bg-background p-4 sm:p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <UploadCloud className="h-6 w-6" /> Subir documento
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comparte tus apuntes y suma puntos automaticamente.
        </p>
      </header>

      <section className="rounded-2xl border bg-background p-4 sm:p-6">
        <UploadForm
          user={user}
          onUploadComplete={async () => {
            await fetchDocuments()
          }}
        />
      </section>

      <section className="rounded-2xl border bg-background p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ultimos documentos subidos</h2>
          <Button
            type="button"
            variant="outline"
            className="inline-flex items-center gap-2"
            onClick={() => void fetchDocuments()}
            disabled={loadingDocs}
          >
            {loadingDocs ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualizar
          </Button>
        </div>

        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no tienes documentos subidos.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="rounded-lg border px-3 py-2 text-sm">
                <div className="font-medium">{doc.file_name}</div>
                <div className="text-xs text-muted-foreground">
                  {doc.category ?? 'Sin categoria'} ·{' '}
                  {new Date(doc.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
