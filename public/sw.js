
// Service Worker for InfoChir application
const CACHE_NAME = 'infochir-cache-v2';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/og-image.png'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Use skipWaiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(PRECACHE_ASSETS);
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  const currentCaches = [CACHE_NAME];
  
  // Claim clients immediately so the new service worker takes effect right away
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
            .map(cacheToDelete => {
              console.log('[ServiceWorker] Removing old cache', cacheToDelete);
              return caches.delete(cacheToDelete);
            })
        );
      }),
      self.clients.claim() // This ensures the service worker takes control of pages immediately
    ])
  );
});

// Fetch event with improved strategies
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Skip API and Supabase requests - always use network for these
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/_supabase/') || 
      event.request.url.includes('/rest/')) {
    return;
  }

  // For HTML navigation requests, use a network-first approach with fast fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html')
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If even the cached index.html is not available, return a basic HTML
              return new Response(
                '<!DOCTYPE html><html><body><h1>Offline</h1><p>The app is currently offline.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
        })
    );
    return;
  }

  // For all other requests (CSS, JS, images), use a stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            throw error;
          });
        
        // Return the cached response immediately if we have it, otherwise wait for the network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
