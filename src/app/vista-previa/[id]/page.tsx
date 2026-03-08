import type { Metadata } from 'next'
import VistaPreviaClient from './VistaPreviaClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

interface PageProps {
  params:
    | {
        id: string
      }
    | Promise<{
        id: string
      }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'

type DocSeoRow = {
  id: string
  file_name: string | null
  category: string | null
  approved: boolean | null
  created_at: string | null
  university: string | null
}

const normalizeTitle = (value: string) => value.replace(/\s+/g, ' ').trim()

async function getSeoDocById(id: string): Promise<DocSeoRow | null> {
  if (!id) return null

  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id, file_name, category, approved, created_at, university')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as DocSeoRow
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const id = resolvedParams?.id ?? ''
  const doc = await getSeoDocById(id)

  if (!doc || !doc.approved) {
    return {
      title: 'Documento no disponible | StudyDocu',
      description: 'El documento solicitado no esta disponible en este momento.',
      robots: { index: false, follow: false },
    }
  }

  const fileName = normalizeTitle(doc.file_name || 'Documento academico')
  const category = normalizeTitle(doc.category || 'Material academico')
  const university = normalizeTitle(doc.university || 'Universidad desconocida')
  const title = `${fileName} | ${category} | StudyDocu`
  const description = `Vista previa de ${fileName}. Categoria: ${category}. Universidad: ${university}.`
  const canonical = `${SITE_URL}/vista-previa/${doc.id}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'StudyDocu',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}

export default async function VistaPreviaPage({ params }: PageProps) {
  const resolvedParams = await params
  return <VistaPreviaClient id={resolvedParams?.id ?? ''} />
}
