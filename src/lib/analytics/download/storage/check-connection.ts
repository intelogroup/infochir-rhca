
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadConnection');

/**
 * Check if the download_events table exists and is accessible
 */
export const checkDownloadEventsConnection = async () => {
  try {
    logger.log('Checking download_events table connection...');
    
    // Try to get a count of records from the download_events table
    const { count, error } = await supabase
      .from('download_events')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      logger.error('Error connecting to download_events table:', error);
      return {
        connected: false,
        count: 0,
        recentEvents: [],
        error: error.message
      };
    }
    
    // Get the most recent events for display
    const { data: recentEvents, error: eventsError } = await supabase
      .from('download_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (eventsError) {
      logger.error('Error fetching recent download events:', eventsError);
    }
    
    logger.log(`Download events connection successful. Found ${count} events.`);
    return {
      connected: true,
      count: count || 0,
      recentEvents: recentEvents || []
    };
  } catch (error) {
    logger.error('Unexpected error checking download events connection:', error);
    return {
      connected: false,
      count: 0,
      recentEvents: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Gets statistics about download events by document type
 */
export const getDownloadTypeStats = async () => {
  try {
    // Get statistics by document type
    const { data, error } = await supabase
      .from('download_events')
      .select('document_type, status');
      
    if (error) {
      logger.error('Error fetching download type statistics:', error);
      return { error: error.message, documentTypes: [] };
    }
    
    // Aggregate statistics by document type
    const typeStats = data.reduce((acc, event) => {
      const type = event.document_type;
      
      if (!acc[type]) {
        acc[type] = { 
          type,
          count: 0,
          successful: 0,
          failed: 0
        };
      }
      
      acc[type].count++;
      
      if (event.status === 'success') {
        acc[type].successful++;
      } else if (event.status === 'failed') {
        acc[type].failed++;
      }
      
      return acc;
    }, {});
    
    return { 
      documentTypes: Object.values(typeStats),
      error: null
    };
  } catch (error) {
    logger.error('Unexpected error getting download type statistics:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error',
      documentTypes: []
    };
  }
};

/**
 * Verifies the entire download tracking system
 */
export const verifyTrackingSystem = async () => {
  try {
    // Check if we can connect to the download_events table
    const connection = await checkDownloadEventsConnection();
    
    if (!connection.connected) {
      return {
        isWorking: false,
        message: `Cannot connect to download_events table: ${connection.error}`
      };
    }
    
    // Verify that the trackDownload function is correctly exporting
    const trackDownloadModule = await import('../track-downloads');
    
    if (!trackDownloadModule.trackDownload) {
      return {
        isWorking: false,
        message: 'trackDownload function not found in track-downloads module'
      };
    }
    
    // Try to get stats by document type to further verify
    const stats = await getDownloadTypeStats();
    
    return {
      isWorking: true,
      message: 'Download tracking system is operational',
      details: {
        eventCount: connection.count,
        documentTypes: stats.documentTypes
      }
    };
  } catch (error) {
    return {
      isWorking: false,
      message: `Error verifying tracking system: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
