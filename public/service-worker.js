const CACHE_VERSION = 'v2'
const STATIC_CACHE = `studydocu-static-${CACHE_VERSION}`
const PRECACHE_URLS = ['/offline.html', '/manifest.json']

const DYNAMIC_PREFIXES = [
  '/dashboard',
  '/api',
  '/auth',
  '/iniciar-sesion',
  '/registrarse',
  '/reset-password',
]

function isSameOrigin(url) {
  return url.origin === self.location.origin
}

function isDynamicPath(pathname) {
  return DYNAMIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/avatars/') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.json')
  )
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('studydocu-') && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (!isSameOrigin(url)) return

  // Rutas dinamicas: siempre red primero para evitar datos viejos.
  if (request.mode === 'navigate' || isDynamicPath(url.pathname)) {
    event.respondWith(
      fetch(request).catch(async () => {
        if (request.mode === 'navigate') {
          const offline = await caches.match('/offline.html')
          if (offline) return offline
        }
        return new Response('Network error', { status: 408 })
      })
    )
    return
  }

  // Assets estaticos: cache-first para mejor performance.
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (!response || !response.ok) return response
          const clone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          return response
        })
      })
    )
  }
})
