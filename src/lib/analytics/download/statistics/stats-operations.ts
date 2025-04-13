
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import type { TypeStats, DocumentTypeStats } from './types';

const logger = createLogger('downloadStats');

/**
 * Subscribe to download stats changes
 */
export const subscribeToDownloadStats = (callback: () => void) => {
  logger.log('Setting up download stats subscription');
  
  const channel = supabase
    .channel('download-events-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'download_events'
      },
      () => {
        logger.log('Download event detected, triggering callback');
        callback();
      }
    )
    .subscribe();
  
  return () => {
    logger.log('Unsubscribing from download stats');
    supabase.removeChannel(channel);
  };
};

/**
 * Get download statistics by document type
 */
export const getDownloadStatsByType = async (docType: string): Promise<TypeStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_stats_by_type', { doc_type: docType });
    
    if (error) {
      logger.error(`Error fetching download stats for type ${docType}:`, error);
      throw error;
    }
    
    // Fix: Access the data object directly since it's a single row result
    return {
      total: data?.total_downloads || 0,
      successful: data?.successful_downloads || 0,
      failed: data?.failed_downloads || 0
    };
  } catch (error) {
    logger.error(`Error in getDownloadStatsByType for ${docType}:`, error);
    return { total: 0, successful: 0, failed: 0 };
  }
};

/**
 * Get download statistics for a specific document
 */
export const getDocumentDownloadStats = async (documentId: string): Promise<TypeStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
    
    if (error) {
      logger.error(`Error fetching download stats for document ${documentId}:`, error);
      throw error;
    }
    
    // Fix: Access the data object directly since it's a single row result
    return {
      total: data?.total_downloads || 0,
      successful: data?.successful_downloads || 0,
      failed: data?.failed_downloads || 0
    };
  } catch (error) {
    logger.error(`Error in getDocumentDownloadStats for ${documentId}:`, error);
    return { total: 0, successful: 0, failed: 0 };
  }
};

/**
 * Get daily download statistics
 */
export const getDailyDownloadStats = async (daysBack: number = 7) => {
  try {
    const { data, error } = await supabase
      .rpc('get_daily_downloads', { days_back: daysBack });
    
    if (error) {
      logger.error('Error fetching daily download stats:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    logger.error('Error in getDailyDownloadStats:', error);
    return [];
  }
};

/**
 * Get overall download statistics
 */
export const getOverallDownloadStats = async (): Promise<{
  total: number;
  successful: number;
  failed: number;
  byType: DocumentTypeStats;
}> => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_statistics');
    
    if (error) {
      logger.error('Error fetching overall download statistics:', error);
      throw error;
    }
    
    // Transform document types from jsonb to a typed object
    const docTypes: DocumentTypeStats = {};
    
    if (data?.document_types) {
      Object.entries(data.document_types).forEach(([key, value]) => {
        docTypes[key] = typeof value === 'number' ? value : 0;
      });
    }
    
    return {
      total: data?.total_downloads || 0,
      successful: data?.successful_downloads || 0,
      failed: data?.failed_downloads || 0,
      byType: docTypes
    };
  } catch (error) {
    logger.error('Error in getOverallDownloadStats:', error);
    return { total: 0, successful: 0, failed: 0, byType: {} };
  }
};
