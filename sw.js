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

// Instalación del Service Worker y precacheo de recursos esenciales
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

// Activación del Service Worker y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia de caché para solicitudes de navegación y recursos estáticos
self.addEventListener('fetch', event => {
  const { request } = event;

  // Estrategia para navegación (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clonar y almacenar en caché la respuesta
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cachedResponse => cachedResponse || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Estrategia para otros recursos (CSS, JS, imágenes)
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
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
            return new Response(
              '<h1>Contenido no disponible offline</h1>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
      })
  );
});

// Manejo de notificaciones push
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

// Manejo de clic en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
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
