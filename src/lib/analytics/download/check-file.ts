
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('FileChecker');

/**
 * Checks if a file exists in a Supabase storage bucket
 * @param bucketName The name of the storage bucket
 * @param fileName The file name to check
 * @returns Promise<boolean> indicating if the file exists
 */
export const checkFileExists = async (bucketName: string, fileName: string): Promise<boolean> => {
  try {
    logger.log(`Checking if file exists: ${bucketName}/${fileName}`);
    
    if (!fileName) {
      logger.warn('Empty filename provided to checkFileExists');
      return false;
    }
    
    // First try to get the file public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    if (!data || !data.publicUrl) {
      logger.warn(`Could not generate public URL for ${bucketName}/${fileName}`);
      return false;
    }
    
    // Then check if the URL is accessible with a HEAD request
    try {
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      const exists = response.ok;
      logger.log(`File ${bucketName}/${fileName} exists: ${exists}`);
      return exists;
    } catch (fetchError) {
      logger.error(`Error fetching ${data.publicUrl}:`, fetchError);
      return false;
    }
  } catch (error) {
    logger.error(`Error checking file existence for ${bucketName}/${fileName}:`, error);
    return false;
  }
};

/**
 * Subscribes to changes in download statistics
 * @param callback Function to call when stats are updated
 * @returns Function to unsubscribe
 */
export const subscribeToDownloadStats = (callback: () => void): (() => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'download_events'
      },
      () => {
        callback();
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Gets overall download statistics using the optimized view
 */
export const getDownloadStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('overall_download_stats_view')
      .select('*')
      .single();
      
    if (error) {
      console.error('Error fetching download statistics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching download statistics:', error);
    return null;
  }
};
