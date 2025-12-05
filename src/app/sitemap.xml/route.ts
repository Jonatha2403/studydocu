import { createClient } from '@supabase/supabase-js'
// ✅ Ya no se necesita NextResponse


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Requiere clave segura para acceso de solo lectura
)

export async function GET() {
  const { data, error } = await supabase
    .from('documents')
    .select('id, updated_at')
    .eq('publico', true)
    .eq('aprobado', true)

  if (error) return new Response('Error al generar sitemap', { status: 500 })

  const urls = data
    .map((doc) => {
      return `
        <url>
          <loc>https://studydocu.ec/documento/${doc.id}</loc>
          <lastmod>${new Date(doc.updated_at).toISOString()}</lastmod>
        </url>
      `
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://studydocu.ec/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>https://studydocu.ec/explorar</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    ${urls}
  </urlset>
  `

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
