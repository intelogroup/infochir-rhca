
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { 
  TypeStats, 
  DocumentTypeStats, 
  OverallDownloadStats,
  DailyDownloadStat
} from "./types";

const logger = createLogger('downloadStatistics');

/**
 * Get download statistics grouped by document type
 */
export const getDownloadStatsByType = async (): Promise<Record<string, TypeStats> | null> => {
  try {
    const { data, error } = await supabase
      .from('download_stats_view')
      .select('*');
      
    if (error) {
      logger.error('Error fetching download stats by type:', error);
      return null;
    }
    
    // Process data to group by document type
    const statsByType: Record<string, TypeStats> = {};
    
    data.forEach(stat => {
      const { document_type, successful_downloads, failed_downloads, total_downloads } = stat;
      
      statsByType[document_type] = { 
        total: Number(total_downloads), 
        successful: Number(successful_downloads), 
        failed: Number(failed_downloads) 
      };
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
export const getDailyDownloadStats = async (daysBack = 7): Promise<DailyDownloadStat[] | null> => {
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
 * Get overall download statistics
 */
export const getOverallDownloadStats = async (): Promise<OverallDownloadStats | null> => {
  try {
    const { data, error } = await supabase
      .from('overall_download_stats_view')
      .select('*')
      .single();
      
    if (error) {
      logger.error('Error fetching overall download stats:', error);
      return null;
    }
    
    // Process document_types if needed
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
    
    return data;
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
  logger.log('Setting up download stats subscription');
  
  // Subscribe to the download_events table for real-time updates
  const channel = supabase
    .channel('download-stats-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'download_events',
      },
      (payload) => {
        logger.log('Download event detected:', payload.new);
        callback();
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    logger.log('Unsubscribing from download stats changes');
    supabase.removeChannel(channel);
  };
};

// Export everything from the operations module
export * from './stats-operations';
