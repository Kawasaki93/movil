// sw.js
self.addEventListener('install', function(event) {
  // El service worker se instala
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // El service worker se activa
}); 