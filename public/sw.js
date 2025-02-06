
const CACHE_NAME = 'info-chir-cache-v2'; // Increment version to force update
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.css',
  '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
  '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
  '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
];

// Log service worker lifecycle events
self.addEventListener('install', (event) => {
  console.debug('[Service Worker] Installing new cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.debug('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Clean up old caches and log operations
self.addEventListener('activate', (event) => {
  console.debug('[Service Worker] Activating new service worker');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.debug('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Skip caching for API calls and handle static assets
self.addEventListener('fetch', (event) => {
  // Skip caching for API requests and auth endpoints
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/auth/') ||
      event.request.url.includes('supabase.co')) {
    console.debug('[Service Worker] Skipping cache for:', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.debug('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.debug('[Service Worker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Handle errors gracefully
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.error);
});
