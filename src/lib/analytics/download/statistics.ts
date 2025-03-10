
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadStatistics');

/**
 * Gets download statistics by document type
 */
export const getDownloadStatsByType = async (documentType: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_stats_by_type', { doc_type: documentType });
      
    if (error) {
      logger.error('Error fetching download stats by type:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDownloadStatsByType:', error);
    return null;
  }
};

/**
 * Gets download statistics for a specific document
 */
export const getDocumentDownloadStats = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
      
    if (error) {
      logger.error('Error fetching document download stats:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDocumentDownloadStats:', error);
    return null;
  }
};

/**
 * Gets daily download statistics for the past N days
 */
export const getDailyDownloadStats = async (daysBack = 7) => {
  try {
    const { data, error } = await supabase
      .rpc('get_daily_downloads', { days_back: daysBack });
      
    if (error) {
      logger.error('Error fetching daily download stats:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDailyDownloadStats:', error);
    return [];
  }
};

/**
 * Gets download statistics summary for all document types
 */
export const getOverallDownloadStats = async () => {
  try {
    const { data, error } = await supabase
      .from('download_stats_monitoring')
      .select('*')
      .eq('status', 'success');
      
    if (error) {
      logger.error('Error fetching overall download stats:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getOverallDownloadStats:', error);
    return [];
  }
};

/**
 * Subscribes to real-time download stats updates
 * @param callback Function to call when download stats are updated
 * @returns A cleanup function to unsubscribe
 */
export const subscribeToDownloadStats = (callback: () => void): (() => void) => {
  logger.log('Setting up real-time subscription to download stats');
  
  const channel = supabase
    .channel('download-stats-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'download_stats_monitoring'
      },
      (payload) => {
        logger.log('Received download stats update from Supabase:', payload);
        callback();
      }
    )
    .subscribe((status) => {
      logger.log(`Supabase real-time subscription status: ${status}`);
    });

  return () => {
    logger.log('Unsubscribing from download stats updates');
    supabase.removeChannel(channel);
  };
};
