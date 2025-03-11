
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llxzstqejdrplmxdjxlu.supabase.co";
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
      'Access-Control-Allow-Origin': '*', // Add CORS header
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
 * Handles image URL resolving from Supabase storage with improved caching and error handling
 * @param bucket Storage bucket name
 * @param path File path in the bucket
 * @returns Public URL string
 */
export const getStorageUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  try {
    if (isDebugMode) {
      console.log(`Generating storage URL for ${bucket}/${path}`);
    }
    
    // Check if the bucket exists and we have permissions
    const verifyBucket = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket(bucket);
        if (error) {
          console.error(`Bucket verification failed for ${bucket}:`, error);
          return false;
        }
        console.log(`Bucket ${bucket} verified:`, data);
        return true;
      } catch (err) {
        console.error(`Error checking bucket ${bucket}:`, err);
        return false;
      }
    };
    
    // We won't await this, but it will run in the background for debugging
    if (isDebugMode) {
      verifyBucket();
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    const publicUrl = data.publicUrl;
    
    if (isDebugMode) {
      console.log(`Generated Supabase storage URL for ${bucket}/${path}: ${publicUrl}`);
      
      // Test if the URL is accessible
      fetch(publicUrl, { method: 'HEAD' })
        .then(response => {
          console.log(`URL check for ${publicUrl}: ${response.status} ${response.statusText}`);
        })
        .catch(err => {
          console.error(`URL check failed for ${publicUrl}:`, err);
        });
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
  
  // If the image path is already a full URL (e.g., from /lovable-uploads/), return it as is
  if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, get the URL from Supabase storage
  return getStorageUrl('founder_avatars', imagePath.replace('/founder_avatars/', ''));
};

/**
 * Gets the full URL for an ADC chapter cover image
 * @param imagePath The path to the image in the adc_covers bucket
 * @returns The full public URL for the ADC cover image
 */
export const getADCCoverUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.log('[getADCCoverUrl] Empty image path provided');
    return '';
  }
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('http')) {
    if (isDebugMode) {
      console.log(`[getADCCoverUrl] Using direct URL: ${imagePath}`);
    }
    return imagePath;
  }
  
  // Handle paths with or without bucket prefix
  const cleanPath = imagePath.replace('/adc_covers/', '').replace('adc_covers/', '');
  
  if (isDebugMode) {
    console.log(`[getADCCoverUrl] Processing image path: ${imagePath}`);
    console.log(`[getADCCoverUrl] Cleaned path: ${cleanPath}`);
  }
  
  // Get the URL from Supabase storage - try the requested bucket first (adc_covers)
  let url = getStorageUrl('adc_covers', cleanPath);
  
  // If the user mentioned to use adc_articles_view, let's try that as a fallback
  if (isDebugMode && !url) {
    console.log(`[getADCCoverUrl] Trying alternative bucket: adc_articles_view`);
    url = getStorageUrl('adc_articles_view', cleanPath);
  }
  
  if (isDebugMode) {
    console.log(`[getADCCoverUrl] Final URL: ${url}`);
    
    // For debugging in preview mode, try both buckets
    if (isPreviewMode) {
      try {
        supabase.storage.from('adc_covers').list('', {
          limit: 5,
        }).then(({ data, error }) => {
          if (error) {
            console.error(`[getADCCoverUrl] Error listing adc_covers bucket:`, error);
          } else {
            console.log(`[getADCCoverUrl] adc_covers bucket contents:`, data);
          }
        });
        
        supabase.storage.from('adc_articles_view').list('', {
          limit: 5,
        }).then(({ data, error }) => {
          if (error) {
            console.error(`[getADCCoverUrl] Error listing adc_articles_view bucket:`, error);
          } else {
            console.log(`[getADCCoverUrl] adc_articles_view bucket contents:`, data);
          }
        });
      } catch (err) {
        console.error(`[getADCCoverUrl] Error listing buckets:`, err);
      }
    }
  }
  
  return url;
};
