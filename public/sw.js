// Service Worker Version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `infochir-cache-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/og-image.png',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - network first with cache fallback for navigation,
// and cache first with network fallback for assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache a copy of the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache either, serve the index.html for any route
            return caches.match('/index.html');
          });
        })
    );
  } 
  // For other requests (assets, API calls)
  else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return from cache if found
        if (cachedResponse) {
          // Fetch from network in the background to update cache
          fetch(event.request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }).catch(() => {});
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cache the successful response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch((error) => {
          console.error('Fetch failed:', error);
          // Return a custom offline response for API requests
          if (event.request.url.includes('/api/')) {
            return new Response(JSON.stringify({ 
              error: 'Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion réseau.'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
      })
    );
  }
});
