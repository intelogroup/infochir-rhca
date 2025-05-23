
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('FileOperations');

/**
 * Check if a file exists in a specific bucket
 * @param bucketName Supabase bucket name
 * @param fileName File name to check
 * @returns Boolean indicating if file exists
 */
export const checkFileExists = async (bucketName: string, fileName: string): Promise<boolean> => {
  try {
    if (!fileName) return false;
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        search: fileName
      });
      
    if (error) {
      logger.error(`Error checking if file exists in ${bucketName}:`, error);
      return false;
    }
    
    return data?.some(file => file.name === fileName) ?? false;
  } catch (err) {
    logger.error(`Exception checking if file exists in ${bucketName}:`, err);
    return false;
  }
};

/**
 * Get public URL for a file in a bucket
 * @param bucketName Supabase bucket name
 * @param fileName File name in the bucket
 * @returns Public URL for the file
 */
export const getFilePublicUrl = (bucketName: string, fileName: string): string => {
  if (!fileName) return '';
  
  // If it's already a URL, return it
  if (fileName.startsWith('http')) return fileName;
  
  // Get public URL from Supabase
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
