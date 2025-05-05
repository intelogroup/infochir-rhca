
// Service Worker for InfoChir application
const CACHE_NAME = 'infochir-cache-v8';  // Increased cache version

// Assets to cache immediately on install - critical path
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
  '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png',
  // Make sure the GPT Engineer script is cached
  'https://cdn.gpteng.co/gptengineer.js'
];

// CSP-safe fetch - doesn't modify headers that could conflict with CSP
const safeFetch = (request) => {
  return fetch(request).then(response => {
    // Don't modify Content-Security-Policy headers
    return response;
  });
};

// Install event - precache critical assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  // Add critical assets to cache immediately (blocking)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .catch(err => {
        console.warn('[ServiceWorker] Caching failed:', err);
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

// Optimized fetch event with improved caching strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests for specific domains and allow them to proceed normally
  if (!event.request.url.startsWith(self.location.origin) && 
      (event.request.url.includes('cdn.gpteng.co') || 
       event.request.url.includes('stripe.com') || 
       event.request.url.includes('supabase.co'))) {
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
      safeFetch(event.request)
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

  // For JS/CSS assets, use cache-first for fast loading but update cache in background
  if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Also update the cache in the background
            safeFetch(event.request)
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
          return safeFetch(event.request)
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

  // For all other assets, use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response immediately if available
        const fetchPromise = safeFetch(event.request)
          .then(networkResponse => {
            // Update cache with new response
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, networkResponse.clone()));
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            throw error;
          });
        
        return cachedResponse || fetchPromise;
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Improve performance by preloading the next likely page
self.addEventListener('fetch', event => {
  // Additional optimization for preloading the next page
  if (event.request.mode === 'navigate') {
    // Detect navigation patterns and preload the likely next page
    if (event.request.url.includes('/rhca')) {
      // After RHCA, users often go to IGM
      fetch('/igm').catch(() => {});
    } else if (event.request.url.includes('/igm')) {
      // After IGM, users often go to submissions
      fetch('/submission').catch(() => {});
    }
  }
});

// Force clients to update when a new service worker is activated
self.addEventListener('activate', event => {
  // After activation, force all clients to use this version
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.navigate(client.url);
    });
  });
});
