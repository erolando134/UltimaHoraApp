// Service Worker para Última Hora R.M.K. (v5.0)
const CACHE_NAME = 'ultima-hora-cache-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html', // Página personalizada offline
  '/css/styles.css',
  '/js/aplicacion.js',
  '/admin/admin.html',
  '/taxis-urbanos/solicitar-taxi.html',
  '/taxis-urbanos/registro-taxistas.html',
  '/servicios-eventuales/inscripcion-eventual.html',
  '/interprovincial/reservar-viaje.html',
  '/carga/solicitar-servicio.html',
  '/img/logo_fondo_taxi.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/img/notification-icon.png' // Icono para notificaciones push
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Almacenando recursos críticos');
        return cache.addAll(ASSETS_TO_CACHE)
          .catch(error => {
            console.error('[SW] Error al cachear recursos:', error);
          });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Estrategia para navegación (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          // Intentar red si no hay caché
          return cachedResponse || fetch(request)
            .then(networkResponse => {
              // Actualizar caché con nueva respuesta
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
              return networkResponse;
            })
            .catch(async () => {
              // Fallback 1: Versión genérica offline
              const offlineResponse = await caches.match('/offline.html');
              // Fallback 2: Página principal si no existe offline
              return offlineResponse || caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Estrategia para otros recursos (CSS, JS, imágenes)
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Devuelve caché si existe
        if (cachedResponse) return cachedResponse;

        // Si no, busca en red y actualiza caché
        return fetch(request)
          .then(networkResponse => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Manejo específico para imágenes
            if (request.destination === 'image') {
              return caches.match('/img/logo_fondo_taxi.png');
            }
            
            // Respuesta genérica para otros recursos
            return new Response(
              '<h1>Contenido no disponible offline</h1>', 
              { headers: {'Content-Type': 'text/html'} }
            );
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Listo para manejar peticiones');
      return self.clients.claim();
    })
  );
});

// Manejo de notificaciones push (solo si está implementado)
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  
  const title = data.title || 'Nueva actualización';
  const options = {
    body: data.body || 'Hay nuevos contenidos disponibles',
    icon: '/img/notification-icon.png',
    badge: '/img/icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejo de clic en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://tu-dominio.com/')
  );
});
