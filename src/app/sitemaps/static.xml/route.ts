const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'

const STATIC_ROUTES = [
  '/',
  '/explorar',
  '/servicios',
  '/blog',
  '/que-es-studydocu',
  '/sobre-mi',
  '/tesis-pregrado',
  '/tesis-maestria',
  '/tesis-doctorado',
  '/tesis-utpl',
  '/tareas-utpl',
  '/examenes-bimestrales',
  '/examen-complexivo',
  '/examenes-validacion',
  '/ayuda-en-tesis-ecuador',
]

const xml = (content: string) => `<?xml version="1.0" encoding="UTF-8"?>\n${content}`

export async function GET() {
  const nowIso = new Date().toISOString()
  const urls = STATIC_ROUTES.map(
    (path) =>
      `<url><loc>${SITE_URL}${path}</loc><lastmod>${nowIso}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  ).join('')

  const body = xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
