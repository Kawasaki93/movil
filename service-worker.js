// sw.js
const CACHE_NAME = 'playa-juan-v1';

const urlsToCache = [
  '.',
  'index.html',
  'src/hamacas/index.html',
  'src/hamacas/script.js',
  'src/hamacas/style.css',
  'src/hamacas/manifest.json',
  'src/hamacas/icon-192x192.png',
  'src/hamacas/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.css',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache opened');
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url)
              .then(() => console.log(`[Service Worker] Successfully cached: ${url}`))
              .catch(error => console.log(`[Service Worker] Failed to cache: ${url}`, error))
          )
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
      })
      .catch(() => {
        return new Response('Offline content not available');
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 