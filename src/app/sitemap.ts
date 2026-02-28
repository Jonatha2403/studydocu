import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://studydocu.ec'

  const routes = [
    // 🔝 Páginas principales
    { path: '/', priority: 1 },
    { path: '/servicios', priority: 0.95 },
    { path: '/explorar', priority: 0.9 },
    { path: '/buscar', priority: 0.9 }, // 🔎 Buscador
    { path: '/planes', priority: 0.8 },

    // 🧠 EXÁMENES (nuevo cluster SEO)
    { path: '/examenes-bimestrales', priority: 0.95 },
    { path: '/examen-complexivo', priority: 0.95 },
    { path: '/examenes-validacion', priority: 0.95 },

    // 🔥 Cluster fuerte de tesis
    { path: '/tesis-pregrado', priority: 0.9 },
    { path: '/tesis-maestria', priority: 0.9 },
    { path: '/tesis-doctorado', priority: 0.9 },
    { path: '/tesis-utpl', priority: 0.95 },
    { path: '/ayuda-en-tesis-ecuador', priority: 0.95 },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date('2026-02-28'),
    changeFrequency: 'weekly',
    priority: route.priority,
  }))
}
