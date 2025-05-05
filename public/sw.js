// Service Worker for InfoChir application
const CACHE_NAME = 'infochir-cache-v9';  // Increased cache version

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

// Domains that should bypass the service worker completely
const BYPASS_DOMAINS = [
  'ingesteer.services-prod.nsvcs.net',
  'llxzstqejdrplmxdjxlu.supabase.co'
];

// CSP-safe fetch - doesn't modify headers that could conflict with CSP
const safeFetch = (request) => {
  return fetch(request).then(response => {
    // Don't modify Content-Security-Policy headers
    return response;
  });
};

// Check if a request should bypass the service worker
const shouldBypass = (url) => {
  return BYPASS_DOMAINS.some(domain => url.includes(domain));
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
  
  const url = event.request.url;
  
  // Completely bypass the service worker for certain domains
  if (shouldBypass(url)) {
    return;
  }
  
  // Skip cross-origin requests for specific domains and allow them to proceed normally
  if (!url.startsWith(self.location.origin) && 
      (url.includes('cdn.gpteng.co') || 
       url.includes('stripe.com') || 
       url.includes('supabase.co') ||
       url.includes('ingesteer.services-prod.nsvcs.net'))) {
    return;
  }
  
  // Always use network for API and Supabase requests
  if (url.includes('/api/') || 
      url.includes('/_supabase/') || 
      url.includes('/rest/') ||
      url.includes('/functions/')) {
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

// The rest of the service worker remains unchanged
// ... keep existing code
