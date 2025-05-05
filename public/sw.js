
// Service Worker for InfoChir application
const CACHE_NAME = 'infochir-cache-v3';  // Increment cache version

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/og-image.png',
  // Add critical CSS/JS assets that should be cached
  '/src/index.css'
];

// Install event - precache static assets but don't block activation
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  // Precache in background, don't block installation
  const precachePromise = caches.open(CACHE_NAME)
    .then(cache => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(PRECACHE_ASSETS);
    })
    .catch(err => {
      console.error('[ServiceWorker] Precaching failed:', err);
    });
    
  // Don't wait for precaching to complete before activating
  // This prevents the service worker from blocking the main thread
  event.waitUntil(precachePromise);
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

// Fetch event with optimized non-blocking strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API and Supabase requests - always use network for these
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/_supabase/') || 
      event.request.url.includes('/rest/')) {
    return;
  }

  // For initial page loads, use network-first with fast timeout fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      Promise.race([
        // Network request with timeout
        new Promise((resolve, reject) => {
          // 3 second timeout for network request
          const timeoutId = setTimeout(() => {
            // If network is too slow, try cache
            caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  resolve(cachedResponse);
                } else {
                  // If no cached response, continue waiting for network
                }
              });
          }, 3000);
          
          fetch(event.request).then(response => {
            // Clear timeout as we got a response
            clearTimeout(timeoutId);
            
            // Cache successful responses for future use
            if (response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clonedResponse);
              });
            }
            
            resolve(response);
          }).catch(err => {
            clearTimeout(timeoutId);
            reject(err);
          });
        }),
        
        // Fallback to cache if available, or basic HTML after timeout
        new Promise(resolve => {
          setTimeout(() => {
            caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  resolve(cachedResponse);
                } else {
                  resolve(new Response(
                    '<!DOCTYPE html><html><body><h1>Offline</h1><p>L\'application est actuellement hors ligne.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html' } }
                  ));
                }
              });
          }, 5000); // Wait slightly longer than the network timeout
        })
      ]).catch(() => {
        // Final fallback if both network and cache fail
        return caches.match('/index.html') || new Response(
          '<!DOCTYPE html><html><body><h1>Erreur de connexion</h1><p>Impossible de charger l\'application.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // For assets (CSS, JS, images), use a stale-while-revalidate strategy
  // This provides immediate response from cache if available
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Clone the request because it's a stream that can only be consumed once
        const fetchPromise = fetch(event.request.clone())
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            throw error;
          });
        
        // Return cached response immediately if available, otherwise wait for network
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
