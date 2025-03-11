import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadStorage');

/**
 * Interface for download statistics returned by our RPC function
 */
interface DownloadStatistics {
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
  document_types_stats?: Record<string, number>;
}

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
 * Gets the download count for a specific document
 */
export const getDownloadCount = async (documentId: string): Promise<number> => {
  try {
    if (!documentId) {
      logger.warn('Invalid document ID provided for download count');
      return 0;
    }
    
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
      
    if (error) {
      logger.error('Error getting download count:', error);
      return 0;
    }
    
    // The RPC returns an array, so we need to get the first item
    if (Array.isArray(data) && data.length > 0) {
      return Number(data[0].successful_downloads) || 0;
    } else if (data && typeof data === 'object' && 'successful_downloads' in data) {
      // Handle case where it might return a single object instead of array
      return Number(data.successful_downloads) || 0;
    }
    
    logger.warn(`No download data found for document ID: ${documentId}`);
    return 0;
  } catch (error) {
    logger.error('Exception getting download count:', error);
    return 0;
  }
};

/**
 * Gets the total download count across all documents
 * Now using the overall_download_stats_view for more efficient queries
 */
export const getTotalDownloadCount = async (): Promise<number> => {
  try {
    // Use our new view for more efficient queries
    const { data, error } = await supabase
      .from('overall_download_stats_view')
      .select('total_downloads')
      .single();
      
    if (error) {
      logger.error('Error getting total download count:', error);
      return 0;
    }
    
    return Number(data?.total_downloads) || 0;
  } catch (error) {
    logger.error('Exception getting total download count:', error);
    return 0;
  }
};

/**
 * Gets the download count for a specific document type
 * Now using the download_stats_view for more efficient queries
 */
export const getDownloadCountByType = async (documentType: string): Promise<number> => {
  try {
    if (!documentType) {
      logger.warn('Invalid document type provided for download count');
      return 0;
    }
    
    // Use our new view for more efficient queries
    const { data, error } = await supabase
      .from('download_stats_view')
      .select('successful_downloads')
      .eq('document_type', documentType)
      .single();
      
    if (error) {
      logger.error('Error getting download count by type:', error);
      return 0;
    }
    
    return Number(data?.successful_downloads) || 0;
  } catch (error) {
    logger.error('Exception getting download count by type:', error);
    return 0;
  }
};

/**
 * Gets complete download statistics for all document types
 * Now using overall_download_stats_view for more efficient queries
 * @returns Object with download counts for all document types
 */
export const getDownloadStatistics = async (): Promise<DownloadStatistics | null> => {
  try {
    const { data, error } = await supabase
      .from('overall_download_stats_view')
      .select('*')
      .single();
      
    if (error) {
      logger.error('Error getting download statistics:', error);
      return null;
    }
    
    // Process document_types_stats if needed
    if (data && data.document_types_stats) {
      // If document_types_stats is a string (JSON), parse it
      if (typeof data.document_types_stats === 'string') {
        try {
          data.document_types_stats = JSON.parse(data.document_types_stats);
        } catch (e) {
          logger.error('Error parsing document_types_stats:', e);
          data.document_types_stats = {};
        }
      }
    }
    
    // Return the processed statistics
    return {
      total_downloads: Number(data.total_downloads) || 0,
      successful_downloads: Number(data.successful_downloads) || 0,
      failed_downloads: Number(data.failed_downloads) || 0,
      document_types_stats: data.document_types_stats as Record<string, number>
    };
  } catch (error) {
    logger.error('Exception getting download statistics:', error);
    return null;
  }
};
