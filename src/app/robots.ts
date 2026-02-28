import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/', '/admin/', '/_next/static/', '/_next/image/'],
      },
    ],

    sitemap: 'https://www.studydocu.ec/sitemap.xml',
    host: 'https://www.studydocu.ec',
  }
}
