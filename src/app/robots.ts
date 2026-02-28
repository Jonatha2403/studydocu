import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',

        // ✅ Permitimos todo el sitio público
        allow: '/',

        // 🚫 Bloqueamos áreas privadas o técnicas
        disallow: ['/api/', '/auth/', '/dashboard/', '/admin/', '/_next/static/', '/_next/image/'],
      },
    ],

    // 🔥 Sitemap principal
    sitemap: 'https://studydocu.ec/sitemap.xml',

    // (Opcional pero profesional)
    host: 'https://studydocu.ec',
  }
}
