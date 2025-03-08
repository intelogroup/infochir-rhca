
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g";

/**
 * Configures and creates a Supabase client with retry and logging
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: function customFetch(input, init) {
      const modifiedInit = {
        ...init,
        headers: {
          ...init?.headers,
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Site': 'cross-site',
        },
        mode: 'cors' as RequestMode,
        // 5 second timeout for requests
        signal: init?.signal || AbortSignal.timeout(5000)
      };
      
      return fetch(input, modifiedInit)
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
