
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('StorageUtils');

/**
 * Utility to check if a file exists in Supabase storage
 */
export const checkFileExists = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    logger.log(`Checking if file exists: ${bucketName}/${filePath}`);
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // Try a HEAD request to check if file exists
    const response = await fetch(data.publicUrl, { 
      method: 'HEAD',
      cache: 'no-store' 
    });
    
    const exists = response.ok;
    logger.log(`File ${filePath} exists: ${exists}`);
    return exists;
  } catch (error) {
    logger.error(error, { action: 'checkFileExists', bucketName, filePath });
    return false;
  }
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = async (): Promise<{
  totalFiles: number;
  totalSize: number;
  bucketStats: Record<string, { files: number; size: number }>;
} | null> => {
  try {
    // Get list of buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      throw bucketsError;
    }
    
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      bucketStats: {} as Record<string, { files: number; size: number }>
    };
    
    // Get stats for each bucket
    for (const bucket of buckets) {
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucket.name)
        .list();
        
      if (filesError) {
        logger.error(filesError, { action: 'getStorageStats', bucket: bucket.name });
        continue;
      }
      
      const bucketSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      
      stats.totalFiles += files.length;
      stats.totalSize += bucketSize;
      stats.bucketStats[bucket.name] = {
        files: files.length,
        size: bucketSize
      };
    }
    
    logger.log(`Storage stats:`, stats);
    return stats;
  } catch (error) {
    logger.error(error, { action: 'getStorageStats' });
    return null;
  }
};
