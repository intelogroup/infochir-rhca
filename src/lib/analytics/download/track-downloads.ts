
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadTracking');

export interface DownloadEvent {
  document_id: string;
  document_type: 'igm' | 'rhca' | 'index-medicus' | 'adc' | 'other' | 'test';
  file_name: string;
  status: 'success' | 'failed';
  error_details?: string;
  user_agent?: string;
  referrer?: string;
  screen_size?: string;
  ip_address?: string;
}

/**
 * Tracks document download events
 * Note: As per requirements, we only track successful downloads 
 */
export const trackDownload = async (event: DownloadEvent): Promise<boolean> => {
  // Skip tracking failed downloads
  if (event.status === 'failed') {
    logger.log('Skipping tracking for failed download as per requirements');
    return true;
  }
  
  logger.log(`Tracking download event:`, event);
  
  try {
    // Validate required fields
    if (!event.document_id || !event.document_type || !event.file_name) {
      logger.error('Missing required fields in download event', event);
      return false;
    }
    
    // First increment the download count in the original table
    try {
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'downloads',
        row_id: event.document_id
      });
      
      logger.log(`Incremented download count for ${event.document_id}`);
    } catch (incrementError) {
      logger.error('Error incrementing download count:', incrementError);
      // Continue with event logging even if increment fails
    }
    
    // Add client-side information to the event
    const enhancedEvent = {
      ...event,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
    };
    
    // Log download event for analytics purposes - use a direct insert
    const { error } = await supabase
      .from('download_events')
      .insert(enhancedEvent);
      
    if (error) {
      logger.error('Error logging download event:', error);
      
      // Attempt a retry with minimal data if the error might be due to payload size
      if (error.message?.includes('payload') || error.message?.includes('size')) {
        logger.log('Retrying with minimal download event data');
        
        const minimalEvent = {
          document_id: event.document_id,
          document_type: event.document_type,
          file_name: event.file_name,
          status: event.status,
          error_details: event.error_details?.substring(0, 255) || null,
        };
        
        const { error: retryError } = await supabase
          .from('download_events')
          .insert(minimalEvent);
          
        if (retryError) {
          logger.error('Error on retry logging download event:', retryError);
          return false;
        }
        
        logger.log('Minimal download event logged successfully on retry');
        return true;
      }
      
      return false;
    }
    
    logger.log('Download event tracked successfully');
    return true;
  } catch (error) {
    logger.error('Exception tracking download:', error);
    return false;
  }
};
