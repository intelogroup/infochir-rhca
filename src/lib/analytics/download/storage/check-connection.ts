
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadConnection');

/**
 * Check if the download events connection is working
 */
export const checkDownloadEventsConnection = async () => {
  try {
    logger.log('Checking download events connection...');
    
    // Try to fetch the latest download events to check connection
    const { data, error, count } = await supabase
      .from('download_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) {
      logger.error('Error connecting to download events:', error);
      return {
        connected: false,
        count: 0,
        recentEvents: [],
        error: error.message
      };
    }
    
    logger.log(`Connected to download events. Found ${count} events.`);
    return {
      connected: true,
      count: count || 0,
      recentEvents: data || []
    };
  } catch (error) {
    logger.error('Exception checking download events connection:', error);
    return {
      connected: false,
      count: 0,
      recentEvents: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get download statistics by document type
 */
export const getDownloadTypeStats = async () => {
  try {
    logger.log('Getting download type statistics...');
    
    const { data, error } = await supabase
      .from('download_stats_view')
      .select('*');
      
    if (error) {
      logger.error('Error fetching download type stats:', error);
      return { error: error.message };
    }
    
    // Transform into more readable format
    const documentTypes = data.map(item => ({
      type: item.document_type,
      count: item.total_downloads,
      successful: item.successful_downloads,
      failed: item.failed_downloads
    }));
    
    return { documentTypes };
  } catch (error) {
    logger.error('Exception getting download type stats:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Verify the tracking system is working
 */
export const verifyTrackingSystem = async () => {
  try {
    logger.log('Verifying tracking system...');
    
    // Check connection to download events
    const connectionCheck = await checkDownloadEventsConnection();
    
    if (!connectionCheck.connected) {
      return {
        isWorking: false,
        message: 'Cannot connect to download events tracking system',
        details: connectionCheck
      };
    }
    
    // Check if we have any events
    if (connectionCheck.count === 0) {
      return {
        isWorking: true,
        message: 'Tracking system is connected but no events have been recorded yet',
        details: { ...connectionCheck, noEvents: true }
      };
    }
    
    return {
      isWorking: true,
      message: 'Download tracking system is working correctly',
      details: connectionCheck
    };
  } catch (error) {
    logger.error('Exception verifying tracking system:', error);
    return {
      isWorking: false,
      message: 'Error verifying tracking system',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
};

// Export the subscribeToDownloadStats function from statistics
export { subscribeToDownloadStats } from '../statistics';
