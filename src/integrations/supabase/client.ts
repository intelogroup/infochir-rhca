
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g";

// Detect if we're in preview mode by checking URL or env variables
const isPreviewMode = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('preview') || 
   window.location.hostname.includes('lovable.app')) ||
  process.env.VITE_APP_PREVIEW === 'true';

// Check if we're in development, preview or debugging mode
const isDebugMode = process.env.NODE_ENV === 'development' || 
                  isPreviewMode || 
                  process.env.DEBUG === 'true';

// Log status for debugging
if (typeof window !== 'undefined' && isDebugMode) {
  console.log(`Supabase client initializing in ${isPreviewMode ? 'preview' : process.env.NODE_ENV} mode`);
  console.log(`Debug mode: ${isDebugMode ? 'enabled' : 'disabled'}`);
}

/**
 * Configures and creates a Supabase client with settings optimized for the current environment
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'infochir-supabase-auth'
  },
  global: {
    headers: {
      'X-Client-Info': `infochir-app/${isPreviewMode ? 'preview' : '1.1.0'}`,
      'X-Client-Mode': isDebugMode ? 'development' : 'production'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Utility function for checking connection status
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (isDebugMode) {
      console.log('Checking Supabase connection...');
    }
    
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    if (isDebugMode) {
      if (error) {
        console.error('Supabase connection check failed', error);
      } else {
        console.log('Supabase connection successful');
      }
    }
    
    return !error;
  } catch (error) {
    if (isDebugMode) {
      console.error('Supabase connection check failed with exception', error);
    }
    return false;
  }
};

/**
 * Handles image URL resolving from Supabase storage
 * @param bucket Storage bucket name
 * @param path File path in the bucket
 * @returns Public URL string
 */
export const getStorageUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  const publicUrl = data.publicUrl;
  
  if (isDebugMode) {
    console.log(`Generated Supabase storage URL for ${bucket}/${path}: ${publicUrl}`);
  }
    
  return publicUrl;
};
