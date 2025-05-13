// Service Worker para Última Hora R.M.K. (v3.0)
const CACHE_NAME = 'ultima-hora-cache-v4';
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
  '/servicios-eventuales/registro.html',
  '/interprovincial/reservar-viaje.html',
  '/carga/solicitar-servicio.html',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Almacenando recursos críticos');
        return cache.addAll(ASSETS_TO_CACHE); // Quitamos el filtro de HTML
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Estrategia actualizada para SPA
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => cachedResponse || fetch(request))
    );
    return;
  }

  // Estrategia Cache First para assets
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        return cachedResponse || fetch(request)
          .then(networkResponse => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            if (request.destination === 'image') {
              return caches.match('/img/logo_fondo_taxi.png');
            }
            return caches.match('/offline.html');
          });
      })
  );
});

// Resto del código sin cambios...
