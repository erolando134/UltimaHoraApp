// Configuración
const CACHE_NAME = 'ultima-hora-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/img/logo.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/js/app.js',
  '/cliente.html',
  '/chofer.html',
  '/admin.html',
  '/seguridad.html',
  '/interprovincial.html',
  '/excursiones.html',
  '/carga.html',
  '/tienda.html'
];

// Instalación y caché de recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Almacenando recursos en caché');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Estrategia: Cache First, luego red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Devuelve recurso en caché si existe
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si no está en caché, lo busca en red
        return fetch(event.request)
          .then((response) => {
            // No cacheamos respuestas que no sean exitosas
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonamos la respuesta para almacenarla
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas HTML
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Manejo de actualizaciones
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
