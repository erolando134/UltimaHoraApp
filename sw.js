// Service Worker para Última Hora R.M.K. (v6.0)

const CACHE_NAME = 'ultima-hora-cache-v6';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/estilo/estilo.css',
  '/js/ws.js',
  '/admin/admin.html',
  '/taxis-urbanos/solicitar-taxi.html',
  '/taxis-urbanos/registro-taxistas.html',
  '/servicios-eventuales/inscripcion-eventual.html',
  '/interprovincial/reservar-viaje.html',
  '/carga/solicitar-servicio.html',
  '/img/logo_fondo_taxi.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/img/notification-icon.png'
];

// Instalación del Service Worker y precacheo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching recursos esenciales');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[SW] Error al precachear recursos:', error);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          })
      )
    ).then(() => {
      self.clients.claim();
      self.skipWaiting();
    })
  );
});

// Estrategia de caché para navegación y recursos
self.addEventListener('fetch', event => {
  const { request } = event;

  // Evitar errores con "only-if-cached"
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request)
          .then(cached => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          if (request.destination === 'image') {
            return caches.match('/img/logo_fondo_taxi.png');
          }
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
          return new Response(
            '<h1>Contenido no disponible offline</h1>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
    })
  );
});

// Notificaciones push
self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  const title = data.title || 'Nueva actualización';
  const options = {
    body: data.body || 'Hay nuevos contenidos disponibles',
    icon: '/img/notification-icon.png',
    badge: '/img/icons/icon-192x192.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clic en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
