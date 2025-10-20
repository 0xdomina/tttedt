const CACHE_NAME = 'edqorta-cache-v1';
// IMPORTANT: These URLs must match the ones in index.html exactly.
const APP_SHELL_URLS = [
  './',
  './index.html',
  './index.tsx',
  './favicon.svg',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://aistudiocdn.com/zustand@^4.5.4',
  'https://aistudiocdn.com/react-window@^1.8.10',
  'https://aistudiocdn.com/react-virtualized-auto-sizer@^1.0.24'
];

// On install, cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(APP_SHELL_URLS).catch(error => {
        // This helps debug caching issues with cross-origin resources
        console.error('[Service Worker] Failed to cache app shell:', error);
      });
    })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// On fetch, implement caching strategies
self.addEventListener('fetch', (event) => {
  // Use a cache-first strategy for all GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Return from cache if found
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise, fetch from network, cache it, and return the response
          return fetch(event.request).then((networkResponse) => {
            // Check for valid response before caching
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});