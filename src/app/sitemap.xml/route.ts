import { supabaseAdmin } from '@/lib/supabaseAdmin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'
const DOCS_PER_SITEMAP = 20000

const xml = (content: string) => `<?xml version="1.0" encoding="UTF-8"?>\n${content}`

export async function GET() {
  const { count } = await supabaseAdmin
    .from('documents')
    .select('id', { head: true, count: 'exact' })
    .eq('approved', true)

  const total = Number(count || 0)
  const pages = Math.ceil(total / DOCS_PER_SITEMAP)
  const nowIso = new Date().toISOString()

  const entries: string[] = [
    `<sitemap><loc>${SITE_URL}/sitemaps/static.xml</loc><lastmod>${nowIso}</lastmod></sitemap>`,
  ]

  for (let i = 1; i <= pages; i += 1) {
    entries.push(
      `<sitemap><loc>${SITE_URL}/sitemaps/documents/${i}</loc><lastmod>${nowIso}</lastmod></sitemap>`
    )
  }

  const body = xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</sitemapindex>`
  )

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
