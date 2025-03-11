
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g";

// Environment detection helpers
// ----------------------------

// Detect if we're in preview mode by checking URL or env variables
const isPreviewMode = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('preview') || 
   window.location.hostname.includes('lovable.app')) ||
  import.meta.env.VITE_APP_PREVIEW === 'true';

// Check if we're in development, preview or debugging mode
const isDebugMode = import.meta.env.DEV || 
                  isPreviewMode || 
                  import.meta.env.DEBUG === 'true';

// Get current environment for logging and headers
const getEnvironment = () => {
  if (isPreviewMode) return 'preview';
  if (import.meta.env.DEV) return 'development';
  return 'production';
};

// Log status for debugging
if (typeof window !== 'undefined' && isDebugMode) {
  console.log(`Supabase client initializing in ${getEnvironment()} mode`);
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
      'X-Client-Info': `infochir-app/${getEnvironment()}`,
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
 * Gets the direct public URL for a file in Supabase storage
 * @param bucket Storage bucket name
 * @param path File path in the bucket
 * @returns Public URL string
 */
export const getStorageUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  try {
    // Simply construct a direct URL to the file
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    
    if (isDebugMode) {
      console.log(`Generated direct storage URL: ${publicUrl}`);
    }
      
    return publicUrl;
  } catch (error) {
    console.error(`Failed to generate storage URL for ${bucket}/${path}:`, error);
    return '';
  }
};

/**
 * Gets the full URL for a founder avatar
 * @param imagePath The path to the image in the founder_avatars bucket
 * @returns The full public URL for the avatar image
 */
export const getFounderAvatarUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, get the URL from Supabase storage
  return getStorageUrl('founder_avatars', imagePath.replace('/founder_avatars/', ''));
};

/**
 * Gets the full URL for an ADC chapter cover image using the correct bucket
 * @param imagePath The path to the image
 * @returns The full public URL for the ADC cover image
 */
export const getADCCoverUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.log('[getADCCoverUrl] Empty image path provided');
    return '';
  }
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Extract just the filename without path
  let filename = imagePath;
  
  // Remove any bucket prefixes
  filename = filename
    .replace('/adc_covers/', '')
    .replace('adc_covers/', '')
    .replace('/adc_articles_view/', '')
    .replace('adc_articles_view/', '')
    .replace('/atlas_covers/', '')
    .replace('atlas_covers/', '');
    
  // Remove any query parameters
  if (filename.includes('?')) {
    filename = filename.split('?')[0];
  }
  
  // Ensure it has the correct extension (jpg)
  const filenameWithCorrectExt = filename.endsWith('.jpg') 
    ? filename 
    : filename.replace(/\.\w+$/, '.jpg');
  
  // Create direct URL to atlas_covers bucket
  const directUrl = `${SUPABASE_URL}/storage/v1/object/public/atlas_covers/${filenameWithCorrectExt}`;
  
  if (isDebugMode) {
    console.log(`[getADCCoverUrl] Using direct URL: ${directUrl}`);
  }
  
  return directUrl;
};
