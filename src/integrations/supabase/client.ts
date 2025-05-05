import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('SupabaseClient');

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
  logger.log(`Supabase client initializing in ${getEnvironment()} mode`);
  logger.log(`Debug mode: ${isDebugMode ? 'enabled' : 'disabled'}`);
}

// Get current hostname for CORS
const getCurrentHostname = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return null;
};

// Create a connection timeout promise that will reject after a certain time
const createTimeoutPromise = (timeoutMs = 10000) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Supabase connection timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
};

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
      'X-Client-Mode': isDebugMode ? 'development' : 'production',
      'Content-Type': 'application/json',
      // Set proper origin header for CORS
      ...(getCurrentHostname() ? { 'Origin': getCurrentHostname() } : {})
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
 * Utility function for checking connection status with timeout
 */
export const checkSupabaseConnection = async (timeoutMs = 10000): Promise<boolean> => {
  try {
    logger.log('Checking Supabase connection...');
    
    // Use Promise.race to implement a timeout
    const result = await Promise.race([
      supabase.from('articles').select('id').limit(1).maybeSingle(),
      createTimeoutPromise(timeoutMs)
    ]);
    
    // If we get here, the query completed before the timeout
    const { data, error } = result as any;
      
    if (error) {
      logger.error('Supabase connection check failed', error);
      
      // Add more detailed error information
      if (error.code) {
        logger.error(`Error code: ${error.code}, Message: ${error.message}`);
      }
      
      // Check for network-related errors
      if (error.message && (
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.message.includes('connection')
      )) {
        logger.error('This appears to be a network connectivity issue');
      }
    } else {
      logger.log('Supabase connection successful');
    }
    
    return !error;
  } catch (error) {
    if (error instanceof Error && error.message.includes('timed out')) {
      logger.error('Supabase connection timed out - this could indicate network issues');
    } else {
      logger.error('Supabase connection check failed with exception', error);
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
    // Check if path already contains bucket name and remove it
    let cleanPath = path;
    if (cleanPath.startsWith(`/${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 2);
    } else if (cleanPath.startsWith(`${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 1);
    }
    
    // Try to get public URL using Supabase storage SDK
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
      if (data && data.publicUrl) {
        return data.publicUrl;
      }
    } catch (err) {
      logger.error(`Failed to get URL from Storage SDK for ${bucket}/${cleanPath}:`, err);
    }
    
    // Fallback to direct URL construction
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
    
    logger.log(`Generated storage URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    logger.error(`Failed to generate storage URL for ${bucket}/${path}:`, error);
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
    logger.log('[getADCCoverUrl] Empty image path provided');
    return '';
  }
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('/lovable-uploads/') || 
      imagePath.startsWith('http://') || 
      imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If the image path is a full Supabase URL, return it as is
  if (imagePath.includes('/storage/v1/object/public/')) {
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
  
  // Create direct URL to atlas_covers bucket (primary location)
  const directUrl = `${SUPABASE_URL}/storage/v1/object/public/atlas_covers/${filename}`;
  
  logger.log(`[getADCCoverUrl] Using direct URL: ${directUrl}`);
  
  return directUrl;
};

/**
 * Gets the URL for an ADC or Atlas image with proper fallback handling
 * @param filename The filename or path to the image
 * @returns The full public URL
 */
export const getAtlasImageUrl = (filename: string | null | undefined): string => {
  if (!filename) return '';
  
  // Try multiple storage buckets if needed
  const buckets = ['atlas_covers', 'adc_covers', 'adc_articles_view'];
  
  // Start with the ADC cover URL approach
  const primaryUrl = getADCCoverUrl(filename);
  if (primaryUrl) return primaryUrl;
  
  // If that fails, try each bucket directly
  for (const bucket of buckets) {
    try {
      const cleanFilename = filename
        .replace(/^\//, '') // Remove leading slash
        .split('/').pop() || filename; // Get just filename if path
      
      const url = getStorageUrl(bucket, cleanFilename);
      
      logger.log(`[getAtlasImageUrl] Trying ${bucket} bucket: ${url}`);
      
      return url;
    } catch (error) {
      logger.error(`[getAtlasImageUrl] Error with ${bucket} bucket:`, error);
    }
  }
  
  // Last resort, return the filename as is (might be a full URL)
  return filename;
};
