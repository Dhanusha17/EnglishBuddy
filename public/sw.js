self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('englishbuddy-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/favicon.ico',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
