
// Service Worker for InfoChir application
const CACHE_NAME = 'infochir-cache-v6';  // Increased cache version

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/og-image.png',
  // Critical CSS/JS assets
  '/src/index.css',
  // Critical hero images - preload with high priority
  '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
  '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
  '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
];

// Secondary assets to cache in the background
const SECONDARY_ASSETS = [
  // Additional key assets that are often used
  '/src/App.css',
  // Common route assets
  '/about',
  '/rhca',
  '/igm',
  '/submission'
];

// Install event - precache critical assets first, then secondary assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  // Add critical assets to cache immediately (blocking)
  const criticalCachePromise = caches.open(CACHE_NAME)
    .then(cache => {
      console.log('[ServiceWorker] Pre-caching critical assets');
      return cache.addAll(CRITICAL_ASSETS);
    });
    
  // Wait for critical assets before activation
  event.waitUntil(criticalCachePromise);
  
  // Cache secondary assets in the background (non-blocking)
  criticalCachePromise.then(() => {
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching secondary assets in background');
        return cache.addAll(SECONDARY_ASSETS);
      })
      .catch(err => {
        console.warn('[ServiceWorker] Secondary caching failed:', err);
      });
  });
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

// Optimized fetch event with improved caching strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Always use network for API and Supabase requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/_supabase/') || 
      event.request.url.includes('/rest/') ||
      event.request.url.includes('/functions/')) {
    return;
  }

  // Handle HTML navigation requests with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Final fallback
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Optimized strategy for images - stale-while-revalidate with background update
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response immediately if available
          if (cachedResponse) {
            // Update cache in the background
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, networkResponse));
                }
              })
              .catch(() => {});
            
            return cachedResponse;
          }
          
          // Not in cache, get from network
          return fetch(event.request)
            .then(networkResponse => {
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }
              
              // Cache the new response
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
              
              return networkResponse;
            })
            .catch(error => {
              console.error('[ServiceWorker] Fetch error:', error);
              // No fallback for images that fail to load
              return new Response('Image not available', { 
                status: 404, 
                headers: {'Content-Type': 'text/plain'} 
              });
            });
        })
    );
    return;
  }

  // For CSS/JS assets, use cache-first approach for fast loading
  if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Also update the cache in the background
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.status === 200) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, networkResponse));
                }
              })
              .catch(() => {});
              
            return cachedResponse;
          }
          
          // Not in cache, get from network
          return fetch(event.request)
            .then(networkResponse => {
              if (networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            });
        })
    );
    return;
  }

  // For all other assets, use stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
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

// Clean up old caches periodically
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheToDelete => caches.delete(cacheToDelete))
        );
      })
    );
  }
});

// Improve performance by preloading the next likely page
self.addEventListener('fetch', event => {
  // Additional optimization for preloading the next page
  if (event.request.mode === 'navigate') {
    // Detect navigation patterns and preload the likely next page
    // This is a simplistic implementation - could be improved with analytics data
    if (event.request.url.includes('/rhca')) {
      // After RHCA, users often go to IGM
      fetch('/igm').catch(() => {});
    } else if (event.request.url.includes('/igm')) {
      // After IGM, users often go to submissions
      fetch('/submission').catch(() => {});
    }
  }
});
