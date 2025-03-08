
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g";

// Cache for recent queries to reduce duplicate requests
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request options with optimized settings
const fetchOptions = {
  cache: 'default',
  credentials: 'same-origin',
  keepalive: true,
  priority: 'high',
};

/**
 * Configures and creates a Supabase client with optimized settings
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: function customFetch(input, init) {
      // Create a cache key from the request
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';
      
      // Only cache GET requests
      if (method === 'GET') {
        const cacheKey = `${method}:${url}:${JSON.stringify(init?.headers)}`;
        const cachedResponse = queryCache.get(cacheKey);
        
        if (cachedResponse && Date.now() < cachedResponse.expiry) {
          console.debug('[Supabase Cache Hit]:', url);
          return Promise.resolve(cachedResponse.response.clone());
        }
      }
      
      const modifiedInit = {
        ...init,
        ...fetchOptions,
        headers: {
          ...init?.headers,
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Site': 'cross-site',
          'X-Client-Info': `infochir-app/${process.env.VITE_APP_VERSION || '1.0.0'}`
        },
        mode: 'cors' as RequestMode,
        // 6 second timeout for requests
        signal: init?.signal || AbortSignal.timeout(6000)
      };
      
      return fetch(input, modifiedInit)
        .then(response => {
          // Cache successful GET responses
          if (method === 'GET' && response.ok && response.status === 200) {
            const cacheKey = `${method}:${url}:${JSON.stringify(init?.headers)}`;
            queryCache.set(cacheKey, {
              response: response.clone(),
              expiry: Date.now() + CACHE_TTL
            });
            
            // Cleanup old cache entries
            if (queryCache.size > 100) {
              const now = Date.now();
              for (const [key, value] of queryCache.entries()) {
                if (now > value.expiry) {
                  queryCache.delete(key);
                }
              }
            }
          }
          return response;
        })
        .catch(error => {
          // Log with more information about the request
          console.error('[Supabase Fetch Error]:', {
            error,
            url: typeof input === 'string' ? input : input.url,
            method: modifiedInit.method || 'GET'
          });
          throw error;
        });
    },
    headers: {
      'X-Client-Info': `infochir-app/${process.env.VITE_APP_VERSION || '1.0.0'}`
    }
  },
  // Default fetch options
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 30000, // 30 seconds
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.debug('[Supabase Auth Event]:', event);
  console.debug('[Supabase Auth Session]:', {
    user: session?.user?.id,
    expiresAt: session?.expires_at,
    authenticated: !!session?.user
  });
});

// Add debug logging for fetch requests in development
if (process.env.NODE_ENV === 'development') {
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    if (typeof input === 'string' && input.includes('supabase')) {
      console.debug('[Supabase Request]:', {
        url: input,
        options: init
      });
    }
    return originalFetch.apply(window, [input, init]);
  };
}

/**
 * Utility functions for checking connection status
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Perform a minimal query to check connection
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    return !error;
  } catch (error) {
    console.error('[Supabase] Connection check failed:', error);
    return false;
  }
};

/**
 * Prefetch and cache common data
 */
export const prefetchCommonData = async () => {
  try {
    console.log('[Supabase] Prefetching common data...');
    
    // Prefetch recent articles
    await supabase
      .from('articles')
      .select('id, title, abstract, publication_date, source')
      .order('publication_date', { ascending: false })
      .limit(10);
      
    // Prefetch member counts
    await supabase
      .from('members')
      .select('count', { count: 'exact', head: true });
      
    console.log('[Supabase] Prefetching complete');
    return true;
  } catch (error) {
    console.error('[Supabase] Prefetching failed:', error);
    return false;
  }
};
