'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Document {
  id: string
  file_name: string
}

interface Props {
  user: { id: string } | null
}

export default function SugerenciasRelacionadas({ user }: Props) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchDocs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name')
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('❌ Error al obtener recomendaciones:', error)
        setDocs([])
      } else {
        setDocs(data || [])
      }
      setLoading(false)
    }

    fetchDocs()
  }, [user])

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Cargando recomendaciones...</p>
  }

  if (docs.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">📌 Recomendaciones recientes</h2>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.id}>
            <Link
              href={`/vista-previa/${doc.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {doc.file_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
