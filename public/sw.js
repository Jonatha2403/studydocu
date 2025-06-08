// sw.js

// Define un nombre y versión para tu caché
const CACHE_NAME = 'studydocu-cache-v1'; // Cambia 'v1' si actualizas los assets cacheados

// Lista de URLs y recursos esenciales para precachear durante la instalación.
// Asegúrate de que estas rutas sean correctas y accesibles desde la raíz de tu sitio.
const URLS_TO_CACHE = [
  '/',                      // Página principal o "app shell"
  '/offline.html',          // Tu página de fallback offline
  '/manifest.json',         // Manifiesto PWA (si lo tienes en la raíz pública)
  // '/favicon.ico',
  // '/icons/icon-192.png', // Íconos PWA principales (ajusta rutas y nombres)
  // '/icons/icon-512.png',
  // '/styles/globals.css', // Tu CSS global si es un archivo estático y crucial
  // '/_next/static/css/...', // Archivos CSS generados por Next.js (plugins como next-pwa manejan esto mejor)
  // Añade otras rutas importantes que quieras que funcionen offline:
  // '/inicio',
  // '/explorar',
  // '/subir',
];

// Evento 'install': Se dispara cuando el Service Worker se instala.
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-cacheando assets esenciales y página offline...');
        return cache.addAll(URLS_TO_CACHE)
          .catch(error => {
            console.error('[SW] Fallo en el pre-cacheo de algunos assets:', error, URLS_TO_CACHE);
            // Considera cómo manejar esto. Si /offline.html falla, el fallback no funcionará.
          });
      })
      .then(() => {
        // Forza al Service Worker en espera a convertirse en el activo.
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': Se dispara después de la instalación y cuando una nueva versión de SW reemplaza a una antigua.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado.');
  // Elimina cachés antiguas que no coincidan con el CACHE_NAME actual.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME) // Conserva solo la caché actual
          .map((cacheName) => {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[SW] Cachés antiguas eliminadas.');
      // Permite que el SW activado tome control de los clientes (páginas) inmediatamente.
      return self.clients.claim();
    })
  );
});

// Evento 'fetch': Se dispara para cada petición de red que hace la página.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar peticiones que no son GET.
  if (request.method !== 'GET') {
    // console.log('[SW] Ignorando petición no-GET:', request.method, request.url);
    return; 
  }

  // Opcional: Ignorar peticiones de extensiones de Chrome u otros orígenes no deseados.
  // if (request.url.startsWith('chrome-extension://')) {
  //   return;
  // }

  // Estrategia: Cache first, then network, then offline page.
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Si la respuesta está en caché, la devolvemos.
        if (cachedResponse) {
          // console.log('[SW] Sirviendo desde caché:', request.url);
          return cachedResponse;
        }

        // Si no está en caché, intentamos obtenerla de la red.
        // console.log('[SW] Obteniendo de la red:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Solo cachear respuestas válidas (status 2xx).
            if (networkResponse && networkResponse.ok) {
              // console.log('[SW] Cacheando nuevo recurso:', request.url);
              // Es importante clonar la respuesta. Una respuesta es un stream y solo se puede consumir una vez.
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            } else if (networkResponse && !networkResponse.ok) {
              // No cachear respuestas de error.
              console.warn('[SW] Respuesta de red no fue OK, no se cacheará:', request.url, networkResponse.status);
            }
            return networkResponse; // Devolver la respuesta original de la red.
          })
          .catch((error) => {
            // Si la red falla (ej. offline), intentamos servir la página offline.html.
            console.warn('[SW] Fallo en fetch; intentando servir página offline.', request.url, error);
            // Esto solo tiene sentido para peticiones de navegación.
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Para otros assets (imágenes, scripts, css), podrías devolver un placeholder o simplemente dejar que falle.
            // Devolver una respuesta de error genérica si no es una navegación y no hay nada que servir.
            return new Response('Error de red. No se pudo obtener el recurso.', {
              status: 408, // Request Timeout
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});