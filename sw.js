// Service Worker para Última Hora R.M.K. (v4.0)
const CACHE_NAME = 'ultima-hora-cache-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/img/logo_fondo_taxi.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/js/aplicacion.js',
  '/admin/admin.html',
  '/taxis-urbanos/solicitar-taxi.html',
  '/taxis-urbanos/registro-taxistas.html',
  '/servicios-eventuales/inscripcion-eventual.html', // Nombre actualizado
  '/interprovincial/reservar-viaje.html',
  '/carga/solicitar-servicio.html',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Almacenando recursos críticos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Estrategia para documentos HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => cachedResponse || fetch(request)
          .then(networkResponse => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));
            return networkResponse;
          })
          .catch(() => caches.match('/offline.html'))
        )
    );
    return;
  }

  // Estrategia Cache First para otros recursos
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => cachedResponse || fetch(request)
        .then(networkResponse => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (request.destination === 'image') {
            return caches.match('/img/logo_fondo_taxi.png');
          }
          return new Response('Recurso no disponible en modo offline');
        })
      )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => 
          cacheName !== CACHE_NAME ? caches.delete(cacheName) : null
        )
      ).then(() => self.clients.claim())
    )
  );
});

// Manejo de actualizaciones push (opcional)
self.addEventListener('push', event => {
  const data = event.data?.json();
  event.waitUntil(
    self.registration.showNotification(data?.title || 'Nueva actualización', {
      body: data?.body || 'Hay nuevas actualizaciones disponibles',
      icon: '/img/notification-icon.png'
    })
  );
});
