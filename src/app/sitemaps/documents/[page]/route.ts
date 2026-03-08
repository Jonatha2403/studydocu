import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type RouteParams = { page: string } | Promise<{ page: string }>

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'
const DOCS_PER_SITEMAP = 20000

const xml = (content: string) => `<?xml version="1.0" encoding="UTF-8"?>\n${content}`

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET(_: Request, context: { params: RouteParams }) {
  const resolvedParams = await context.params
  const pageNum = Number(resolvedParams?.page)

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    return NextResponse.json({ error: 'Pagina invalida.' }, { status: 400 })
  }

  const from = (pageNum - 1) * DOCS_PER_SITEMAP
  const to = from + DOCS_PER_SITEMAP - 1

  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return NextResponse.json(
      { error: 'No se pudo construir sitemap de documentos.' },
      { status: 500 }
    )
  }

  const rows = data || []
  const urls = rows
    .map((doc) => {
      const loc = `${SITE_URL}/vista-previa/${doc.id}`
      const lastMod = doc.created_at ? new Date(doc.created_at).toISOString() : undefined
      return `<url><loc>${escapeXml(loc)}</loc>${lastMod ? `<lastmod>${lastMod}</lastmod>` : ''}<changefreq>daily</changefreq><priority>0.7</priority></url>`
    })
    .join('')

  const body = xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
