// Service Worker para Última Hora R.M.K. (v2.1)
const CACHE_NAME = 'ultima-hora-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/img/logo_fondo_taxi.png', // Corregido nombre de archivo
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/js/app.js',
  '/js/config.js', // Añadido archivo de configuración
  '/clientes/cliente.html',
  '/choferes/choferes.html',
  '/admin/admin.html',
  '/seguridad/seguridad.html',
  '/interprovincial/interprovincial.html',
  '/excursiones/excursiones.html',
  '/carga/carga.html',
  '/tienda/tienda.html',
  '/offline.html' // Añadida página offline
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Almacenando recursos críticos');
        return cache.addAll(ASSETS_TO_CACHE.filter(url => !url.endsWith('.html')));
      })
      .then(() => {
        console.log('[SW] Todos los recursos fueron almacenados');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Estrategia para documentos HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Estrategia para otros recursos
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
          if (request.headers.get('Accept').includes('image')) {
            return caches.match('/img/placeholder.jpg');
          }
          return new Response('Recurso no disponible sin conexión');
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

// Manejo de actualizaciones push
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/img/notification-icon.png'
    })
  );
});

self.addEventListener('message', event => {
  if (event.data.type === 'UPDATE_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => self.skipWaiting());
  }
});
