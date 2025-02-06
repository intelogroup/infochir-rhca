
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.debug('[Supabase Auth Event]:', event);
  console.debug('[Supabase Auth Session]:', {
    user: session?.user?.id,
    expiresAt: session?.expires_at,
  });
});

// Add debug logging for network requests
if (process.env.NODE_ENV === 'development') {
  const originalFetch = supabase.rest.headers;
  supabase.rest.headers = (...args) => {
    console.debug('[Supabase Request]:', {
      url: args[0],
      method: args[1]?.method,
      headers: args[1]?.headers,
    });
    return originalFetch.apply(supabase.rest, args);
  };
}
