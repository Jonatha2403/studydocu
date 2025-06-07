// sw.js

// Define un nombre y versión para tu caché
const CACHE_NAME = 'studydocu-static-cache-v1';

// Lista de URLs y recursos esenciales para precachear durante la instalación.
// Asegúrate de que estas rutas sean correctas y accesibles.
const URLS_TO_CACHE = [
  '/',                      // Tu página principal/app shell
  '/offline.html',          // Página de fallback offline
  '/manifest.json',         // Manifiesto de la PWA
  // '/favicon.ico',        // Favicon
  // '/icons/icon-192.png', // Iconos PWA principales
  // '/icons/icon-512.png',
  // '/_next/static/...',   // Archivos estáticos generados por Next.js (esto es más complejo de manejar directamente aquí, 
                           // Next.js PWA plugins como next-pwa lo hacen automáticamente)
  // '/styles/globals.css', // Tu CSS global si es un archivo estático
  // '/js/main.js',         // Tu JS principal si es un archivo estático
  // Considera añadir las rutas principales de tu app si quieres que funcionen offline desde el inicio:
  // '/inicio',
  // '/explorar',
  // '/subir',
  // '/auth'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Instalado');
  // Realiza la instalación (pre-cacheo de assets)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-cacheando assets esenciales y página offline');
        // Es importante que todas las URLs en URLS_TO_CACHE sean válidas y accesibles,
        // de lo contrario, cache.addAll() fallará.
        return cache.addAll(URLS_TO_CACHE)
          .catch(error => {
            console.error('[ServiceWorker] Fallo en el pre-cacheo de algunos assets:', error);
            // Podrías decidir no fallar toda la instalación si algunos assets no críticos no se cachean,
            // pero es mejor asegurar que los esenciales estén correctos.
          });
      })
      .then(() => {
        // Forzar la activación del nuevo Service Worker inmediatamente.
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': Se dispara después de que el SW se instala y cuando una nueva versión reemplaza a una antigua.
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activado');
  // Limpia cachés antiguas que no coincidan con CACHE_NAME.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME) // Solo borra cachés con nombres diferentes
          .map((cacheName) => {
            console.log('[ServiceWorker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[ServiceWorker] Cachés antiguas eliminadas.');
      // Permite que el Service Worker activado tome control de los clientes (páginas) no controlados inmediatamente.
      return self.clients.claim();
    })
  );
});

// Evento 'fetch': Se dispara para cada petición de red que hace la página.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar peticiones que no son GET (ej. POST, PUT) ya que no suelen ser cacheadas.
  if (request.method !== 'GET') {
    // console.log('[ServiceWorker] Ignorando petición no-GET:', request.method, request.url);
    return;
  }

  // Ignorar peticiones de extensiones de Chrome o scripts de terceros si no quieres que interfieran.
  if (request.url.startsWith('chrome-extension://') || request.url.includes('google-analytics.com')) {
    // console.log('[ServiceWorker] Ignorando petición de extensión/tercero:', request.url);
    return; 
  }
  
  // Estrategia: Cache first, then network, then offline page for navigations or specific assets.
  // Para assets estáticos, esta estrategia es buena. Para datos API, podrías necesitar otras.
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Si la respuesta está en caché, la devolvemos.
        if (cachedResponse) {
          // console.log('[ServiceWorker] Sirviendo desde caché:', request.url);
          return cachedResponse;
        }

        // Si no está en caché, intentamos obtenerla de la red.
        // console.log('[ServiceWorker] Obteniendo de la red:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Si la petición de red es exitosa, la cacheamos para futuras peticiones.
            if (networkResponse && networkResponse.ok) {
              // console.log('[ServiceWorker] Cacheando nuevo recurso:', request.url);
              const responseToCache = networkResponse.clone(); // Clonamos la respuesta porque es un stream y solo se puede consumir una vez.
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            } else if (networkResponse && !networkResponse.ok) {
              // No cachear respuestas no exitosas (ej. 404, 500) a menos que sea una estrategia deliberada.
              console.warn('[ServiceWorker] Respuesta de red no fue OK, no se cacheará:', request.url, networkResponse.status);
            }
            return networkResponse;
          })
          .catch((error) => {
            // Si la red falla (ej. offline), intentamos servir la página offline.html desde la caché.
            console.error('[ServiceWorker] Fallo en fetch; sirviendo página offline en su lugar.', request.url, error);
            // Asegúrate de que '/offline.html' esté en URLS_TO_CACHE.
            // Solo intentar para peticiones de navegación.
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Para otros tipos de peticiones (CSS, JS, imágenes), podrías devolver una respuesta de error genérica
            // o simplemente dejar que falle si no tienes un placeholder específico.
            // Por ahora, solo el fallback a offline.html para navegaciones.
            return new Response("Network error occurred", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            });
          });
      })
  );
});