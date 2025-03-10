
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('StorageUtils');

/**
 * Checks if a file exists in a Supabase storage bucket
 */
export const checkFileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    // Get file metadata to check if it exists
    const { data } = await supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // If we have a public URL, try to do a HEAD request to verify it's accessible
    if (data?.publicUrl) {
      try {
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        return response.ok;
      } catch (fetchError) {
        logger.error(`File fetch check error for ${data.publicUrl}:`, fetchError);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    logger.error(`Unexpected error checking file ${bucketName}/${filePath}:`, error);
    return false;
  }
};

/**
 * Gets a signed URL with optional expiration (useful for temporary access)
 */
export const getSignedUrl = async (
  bucketName: string, 
  filePath: string, 
  expiresIn = 60 // Default 60 seconds
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
      
    if (error) {
      logger.error(`Signed URL error for ${bucketName}/${filePath}:`, error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    logger.error(`Unexpected error getting signed URL for ${bucketName}/${filePath}:`, error);
    return null;
  }
};
