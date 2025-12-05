// ✅ Archivo: /app/api/sitemap/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://studydocu.ec'

  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })

  if (error) {
    return new Response('Error al generar sitemap', { status: 500 })
  }

  const urls = documents
    .map((doc) => {
      return `
    <url>
      <loc>${baseUrl}/documento/${doc.id}</loc>
      <lastmod>${new Date(doc.updated_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    })
    .join('')

  const staticUrls = `
    <url>
      <loc>${baseUrl}/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${baseUrl}/explorar</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>${baseUrl}/premium</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${urls}
    </urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
