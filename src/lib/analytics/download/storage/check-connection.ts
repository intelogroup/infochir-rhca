
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadStorage');

/**
 * Check connection to download events table
 */
export const checkDownloadEventsConnection = async () => {
  try {
    // Check if we can access the download_events table
    const { data, error, count } = await supabase
      .from('download_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      logger.error('Error checking download events connection:', error);
      return {
        connected: false,
        count: 0,
        recentEvents: [],
        error: error.message
      };
    }
    
    logger.log(`Download events connection successful. Found ${count} events.`);
    
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
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Get download statistics by document type
 */
export const getDownloadTypeStats = async () => {
  try {
    // Get download statistics grouped by document type
    const { data, error } = await supabase
      .from('download_stats_view')
      .select('*');
      
    if (error) {
      logger.error('Error fetching download type stats:', error);
      return { error: error.message };
    }
    
    // Transform data into a more usable format
    const documentTypes = data.map(item => ({
      type: item.document_type,
      count: Number(item.total_downloads),
      successful: Number(item.successful_downloads),
      failed: Number(item.failed_downloads)
    }));
    
    return { documentTypes };
  } catch (error) {
    logger.error('Exception fetching download type stats:', error);
    return { 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

/**
 * Verify that the download tracking system is working correctly
 */
export const verifyTrackingSystem = async () => {
  try {
    // Import the verification function dynamically to avoid circular dependencies
    const { verifyTrackingSystem } = await import('../test-tracking');
    return await verifyTrackingSystem();
  } catch (error) {
    logger.error('Exception verifying tracking system:', error);
    return {
      isWorking: false,
      message: "Une erreur est survenue lors de la vérification du système",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Subscribe to download events changes
 */
export const subscribeToDownloadEvents = (callback: (payload: any) => void) => {
  try {
    const channel = supabase
      .channel('download-events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'download_events'
        },
        (payload) => {
          logger.log('Download event detected:', payload);
          callback(payload);
        }
      )
      .subscribe();
      
    // Return a function to unsubscribe
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    logger.error('Exception subscribing to download events:', error);
    // Return a no-op function
    return () => {};
  }
};
