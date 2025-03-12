
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadCheck');

/**
 * Checks if the download_events table exists and is accessible
 * Returns the count of records to verify data is being saved
 */
export const checkDownloadEventsConnection = async (): Promise<{ 
  connected: boolean; 
  count: number;
  recentEvents: any[];
  error?: string;
}> => {
  try {
    logger.log('Checking download_events table connection...');
    
    // First verify we can connect to Supabase
    const connectionTest = await supabase.from('download_events').select('count()', { count: 'exact', head: true });
    
    if (connectionTest.error) {
      logger.error('Failed to connect to download_events table:', connectionTest.error);
      return { 
        connected: false, 
        count: 0, 
        recentEvents: [],
        error: connectionTest.error.message 
      };
    }
    
    // Get the count of all records
    const { count, error: countError } = await supabase
      .from('download_events')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      logger.error('Error getting download_events count:', countError);
      return { 
        connected: true, 
        count: 0, 
        recentEvents: [],
        error: countError.message 
      };
    }
    
    // Get the 5 most recent records to verify data structure
    const { data: recentEvents, error: recentError } = await supabase
      .from('download_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      logger.error('Error getting recent download_events:', recentError);
      return { 
        connected: true, 
        count: count || 0, 
        recentEvents: [],
        error: recentError.message 
      };
    }
    
    logger.log(`Successfully connected to download_events. Total records: ${count}`);
    logger.log('Recent events:', recentEvents);
    
    return { 
      connected: true, 
      count: count || 0,
      recentEvents: recentEvents || []
    };
  } catch (error) {
    logger.error('Unexpected error checking download_events:', error);
    return { 
      connected: false, 
      count: 0,
      recentEvents: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Gets statistics for each document type
 */
export const getDownloadTypeStats = async (): Promise<{ 
  documentTypes: { type: string; count: number; successful: number; failed: number }[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('download_events')
      .select('document_type, status');
    
    if (error) {
      logger.error('Error getting download type stats:', error);
      return { 
        documentTypes: [],
        error: error.message 
      };
    }
    
    // Process the data to get counts by document type and status
    const typeMap = new Map<string, { count: number; successful: number; failed: number }>();
    
    data.forEach(event => {
      if (!typeMap.has(event.document_type)) {
        typeMap.set(event.document_type, { count: 0, successful: 0, failed: 0 });
      }
      
      const typeStats = typeMap.get(event.document_type)!;
      typeStats.count++;
      
      if (event.status === 'success') {
        typeStats.successful++;
      } else if (event.status === 'failed') {
        typeStats.failed++;
      }
    });
    
    // Convert map to array for easy consumption
    const documentTypes = Array.from(typeMap.entries()).map(([type, stats]) => ({
      type,
      count: stats.count,
      successful: stats.successful,
      failed: stats.failed
    }));
    
    logger.log('Download type statistics:', documentTypes);
    
    return { documentTypes };
  } catch (error) {
    logger.error('Unexpected error getting download type stats:', error);
    return { 
      documentTypes: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Run a quick check to verify the tracking system is working
 */
export const verifyTrackingSystem = async (): Promise<{
  isWorking: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Check connection to the table
    const connectionCheck = await checkDownloadEventsConnection();
    
    if (!connectionCheck.connected) {
      return {
        isWorking: false,
        message: `Cannot connect to download_events table: ${connectionCheck.error}`,
      };
    }
    
    // If we have records, the system is likely working
    if (connectionCheck.count > 0) {
      return {
        isWorking: true,
        message: `Download tracking system is working. Found ${connectionCheck.count} events.`,
        details: {
          recentEvents: connectionCheck.recentEvents,
        }
      };
    }
    
    // If no records, we need to check if the tracking function is actually calling supabase
    return {
      isWorking: connectionCheck.connected,
      message: connectionCheck.count > 0 
        ? `System appears to be working but no download events have been recorded yet.`
        : `System may not be working correctly. No download events found.`,
      details: {
        tableExists: connectionCheck.connected,
        recordCount: connectionCheck.count,
      }
    };
  } catch (error) {
    return {
      isWorking: false,
      message: `Error verifying tracking system: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};
