
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadStorage');

/**
 * Checks if a file exists in Supabase storage
 */
export const checkFileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 1,
        offset: 0,
        search: filePath
      });
      
    if (error) {
      throw error;
    }
    
    return !!data && data.length > 0 && data.some(file => file.name === filePath);
  } catch (error) {
    logger.error('Error checking if file exists:', error);
    return false;
  }
};

/**
 * Gets the download count for a specific document
 */
export const getDownloadCount = async (documentId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
      
    if (error) {
      throw error;
    }
    
    // The RPC returns an array, so we need to get the first item
    if (Array.isArray(data) && data.length > 0) {
      return data[0].successful_downloads || 0;
    } else if (data && 'successful_downloads' in data) {
      // Handle case where it might return a single object instead of array
      return data.successful_downloads || 0;
    }
    
    return 0;
  } catch (error) {
    logger.error('Error getting download count:', error);
    return 0;
  }
};

/**
 * Gets the total download count across all documents
 */
export const getTotalDownloadCount = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_total_downloads');
      
    if (error) {
      throw error;
    }
    
    return data || 0;
  } catch (error) {
    logger.error('Error getting total download count:', error);
    return 0;
  }
};

/**
 * Gets the download count for a specific document type
 */
export const getDownloadCountByType = async (documentType: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_downloads_by_type', { doc_type: documentType });
      
    if (error) {
      throw error;
    }
    
    return data || 0;
  } catch (error) {
    logger.error('Error getting download count by type:', error);
    return 0;
  }
};
