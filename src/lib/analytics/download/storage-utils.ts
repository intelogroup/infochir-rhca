
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
  document_types?: Record<string, number>;
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
 */
export const getTotalDownloadCount = async (): Promise<number> => {
  try {
    // Use our new RPC function that handles all type conversion internally
    const { data, error } = await supabase
      .rpc('get_download_statistics');
      
    if (error) {
      logger.error('Error getting total download count:', error);
      return 0;
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      // The function returns an array with a single row
      return Number(data[0]?.total_downloads) || 0;
    }
    
    logger.warn('Total download count returned null/undefined from RPC');
    
    // Fallback: Query download_stats_monitoring directly
    const { data: statsData, error: statsError } = await supabase
      .from('download_stats_monitoring')
      .select('count')
      .eq('status', 'success');
      
    if (statsError) {
      logger.error('Error querying download_stats_monitoring:', statsError);
      return 0;
    }
    
    const totalDownloads = statsData?.reduce((sum, stat) => sum + (Number(stat.count) || 0), 0) || 0;
    return totalDownloads;
  } catch (error) {
    logger.error('Exception getting total download count:', error);
    return 0;
  }
};

/**
 * Gets the download count for a specific document type
 */
export const getDownloadCountByType = async (documentType: string): Promise<number> => {
  try {
    if (!documentType) {
      logger.warn('Invalid document type provided for download count');
      return 0;
    }
    
    // Use our new function with document types breakdown
    const { data, error } = await supabase
      .rpc('get_download_statistics');
      
    if (error) {
      logger.error('Error getting download statistics:', error);
      return 0;
    }
    
    if (data && Array.isArray(data) && data.length > 0 && data[0].document_types) {
      // Get the document_types from the first item in the array
      let docTypes = data[0].document_types;
      if (typeof docTypes === 'string') {
        try {
          docTypes = JSON.parse(docTypes);
        } catch (e) {
          logger.error('Error parsing document_types:', e);
          return 0;
        }
      }
      
      return (docTypes as Record<string, number>)[documentType] || 0;
    }
    
    logger.warn(`No download data found for document type: ${documentType}`);
    return 0;
  } catch (error) {
    logger.error('Exception getting download count by type:', error);
    return 0;
  }
};

/**
 * Gets complete download statistics for all document types
 * @returns Object with download counts for all document types
 */
export const getDownloadStatistics = async (): Promise<DownloadStatistics | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_statistics');
      
    if (error) {
      logger.error('Error getting download statistics:', error);
      return null;
    }
    
    // Since the function returns an array with one object, extract the first item
    if (data && Array.isArray(data) && data.length > 0) {
      const stats = data[0];
      
      // Process document_types if needed
      if (stats && stats.document_types) {
        // If document_types is a string (JSON), parse it
        if (typeof stats.document_types === 'string') {
          try {
            stats.document_types = JSON.parse(stats.document_types);
          } catch (e) {
            logger.error('Error parsing document_types:', e);
            stats.document_types = {};
          }
        }
      }
      
      // Return the first (and only) item from the array
      return {
        total_downloads: Number(stats.total_downloads) || 0,
        successful_downloads: Number(stats.successful_downloads) || 0,
        failed_downloads: Number(stats.failed_downloads) || 0,
        document_types: stats.document_types as Record<string, number>
      };
    }
    
    logger.warn('No download statistics returned from database');
    return null;
  } catch (error) {
    logger.error('Exception getting download statistics:', error);
    return null;
  }
};
