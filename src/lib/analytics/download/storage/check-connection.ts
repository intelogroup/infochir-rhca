
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadEventsConnection');

export interface ConnectionCheckResult {
  connected: boolean;
  count: number;
  recentEvents: any[];
  error?: string;
}

/**
 * Checks connection to the download_events table and returns current count
 */
export const checkDownloadEventsConnection = async (): Promise<ConnectionCheckResult> => {
  try {
    // Check if we can access the download_events table
    const { data, error, count } = await supabase
      .from('download_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      logger.error('Error checking download_events connection:', error);
      return {
        connected: false,
        count: 0,
        recentEvents: [],
        error: error.message
      };
    }
    
    return {
      connected: true,
      count: count || 0,
      recentEvents: data || []
    };
  } catch (error) {
    logger.error('Exception checking download_events connection:', error);
    return {
      connected: false,
      count: 0,
      recentEvents: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Verifies if tracking system is working properly
 */
export const verifyTrackingSystem = async (): Promise<{isWorking: boolean, message: string, details?: any}> => {
  try {
    // 1. Check if download_events table exists and is accessible
    const connectionCheck = await checkDownloadEventsConnection();
    
    if (!connectionCheck.connected) {
      return {
        isWorking: false,
        message: `Cannot connect to download_events table: ${connectionCheck.error}`,
        details: connectionCheck
      };
    }
    
    // 2. Check if we have any events recorded
    if (connectionCheck.count === 0) {
      return {
        isWorking: true,
        message: "Connection to download_events is working, but no events have been recorded yet",
        details: connectionCheck
      };
    }
    
    return {
      isWorking: true,
      message: `Download tracking system is working properly. ${connectionCheck.count} events recorded.`,
      details: connectionCheck
    };
  } catch (error) {
    logger.error('Error verifying tracking system:', error);
    return {
      isWorking: false,
      message: `Error verifying tracking system: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};

/**
 * Get statistics about downloads by document type
 */
export const getDownloadTypeStats = async (): Promise<{documentTypes?: any[], error?: string}> => {
  try {
    const { data, error } = await supabase
      .from('download_stats_view')
      .select('*')
      .order('total_downloads', { ascending: false });
    
    if (error) {
      logger.error('Error fetching download type stats:', error);
      return { error: error.message };
    }
    
    const documentTypes = data.map(stat => ({
      type: stat.document_type,
      count: stat.total_downloads,
      successful: stat.successful_downloads,
      failed: stat.failed_downloads
    }));
    
    return { documentTypes };
  } catch (error) {
    logger.error('Exception fetching download type stats:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
