
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('FileOperations');

/**
 * Checks if a file exists in Supabase storage
 */
export const checkFileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    if (!bucketName || !filePath) {
      logger.warn('Invalid bucket name or file path provided');
      return false;
    }
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 1,
        offset: 0,
        search: filePath
      });
      
    if (error) {
      logger.error('Error checking if file exists:', error);
      return false;
    }
    
    return !!data && data.length > 0 && data.some(file => file.name === filePath);
  } catch (error) {
    logger.error('Exception checking if file exists:', error);
    return false;
  }
};

/**
 * Gets the public URL for a file in Supabase storage
 */
export const getFilePublicUrl = (bucketName: string, fileName: string): string => {
  if (!bucketName || !fileName) return '';
  
  // If it's already a URL, return it
  if (fileName.startsWith('http')) return fileName;
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
