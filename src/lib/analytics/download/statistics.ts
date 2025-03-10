
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadStatistics');

/**
 * Interface for download statistics by document type
 */
interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Interface for document types statistics returned by our function
 */
interface DocumentTypeStats {
  [key: string]: number;
}

/**
 * Get download statistics grouped by document type
 */
export const getDownloadStatsByType = async (): Promise<Record<string, TypeStats> | null> => {
  try {
    const { data, error } = await supabase
      .from('download_stats_monitoring')
      .select('*');
      
    if (error) {
      logger.error('Error fetching download stats by type:', error);
      return null;
    }
    
    // Process data to group by document type
    const statsByType: Record<string, TypeStats> = {};
    
    data.forEach(stat => {
      const { document_type, status, count } = stat;
      
      if (!statsByType[document_type]) {
        statsByType[document_type] = { total: 0, successful: 0, failed: 0 };
      }
      
      statsByType[document_type].total += Number(count);
      
      if (status === 'success') {
        statsByType[document_type].successful += Number(count);
      } else if (status === 'failed') {
        statsByType[document_type].failed += Number(count);
      }
    });
    
    return statsByType;
  } catch (error) {
    logger.error('Exception in getDownloadStatsByType:', error);
    return null;
  }
};

/**
 * Get download statistics for a specific document
 */
export const getDocumentDownloadStats = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
      
    if (error) {
      logger.error('Error fetching document download stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDocumentDownloadStats:', error);
    return null;
  }
};

/**
 * Get daily download statistics for the specified number of days
 */
export const getDailyDownloadStats = async (daysBack = 7) => {
  try {
    const { data, error } = await supabase
      .rpc('get_daily_downloads', { days_back: daysBack });
      
    if (error) {
      logger.error('Error fetching daily download stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDailyDownloadStats:', error);
    return null;
  }
};

/**
 * Get all download statistics aggregated with document type breakdown
 */
export const getOverallDownloadStats = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_statistics');
      
    if (error) {
      logger.error('Error fetching overall download stats:', error);
      return null;
    }
    
    // Since the function returns an array with one object, extract the first item
    if (data && Array.isArray(data) && data.length > 0) {
      const stats = data[0];
      
      // Convert document_types from jsonb to a proper TypeScript object
      if (stats && stats.document_types) {
        try {
          // If data.document_types is already an object, it doesn't need parsing
          if (typeof stats.document_types === 'string') {
            stats.document_types = JSON.parse(stats.document_types);
          }
        } catch (e) {
          logger.error('Error parsing document_types:', e);
          stats.document_types = {};
        }
      }
      
      return stats;
    }
    
    return null;
  } catch (error) {
    logger.error('Exception in getOverallDownloadStats:', error);
    return null;
  }
};

/**
 * Subscribe to changes in download statistics
 * @param callback Function to call when download statistics change
 * @returns Unsubscribe function
 */
export const subscribeToDownloadStats = (
  callback: () => void
): (() => void) => {
  // Subscribe to the download_events table for real-time updates
  const subscription = supabase
    .channel('download-stats-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'download_events',
      },
      (payload) => {
        logger.log('Download event inserted:', payload.new);
        callback();
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    logger.log('Unsubscribing from download stats changes');
    subscription.unsubscribe();
  };
};
