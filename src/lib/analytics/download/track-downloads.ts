
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "./statistics/types";
import { isValidUuid } from "../track";

const logger = createLogger('DownloadTracking');

export interface DownloadEvent {
  document_id: string;
  document_type: DocumentType;
  file_name: string;
  status: 'success' | 'failed';
  error_details?: string;
  user_agent?: string;
  referrer?: string;
  screen_size?: string;
  ip_address?: string;
}

/**
 * Tracks document download events with fallback mechanisms
 */
export const trackDownload = async (event: DownloadEvent): Promise<boolean> => {
  logger.log(`Tracking download event:`, event);
  
  try {
    // Validate required fields
    if (!event.document_id || !event.document_type || !event.file_name) {
      logger.error('Missing required fields in download event', event);
      return false;
    }
    
    // Check if the document_id is a valid UUID
    const isValidId = isValidUuid(event.document_id);
    
    // First increment the download count in the original table if it's a valid UUID
    if (isValidId) {
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
    }
    
    // Add client-side information to the event
    const enhancedEvent = {
      ...event,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
    };
    
    // Try using track_user_event first (which handles both tracking and RLS)
    try {
      const { error } = await supabase.rpc('track_user_event', {
        p_event_type: 'download',
        p_document_id: isValidId ? event.document_id : null,
        p_document_type: event.document_type,
        p_event_data: {
          fileName: event.file_name,
          status: event.status,
          screenSize: enhancedEvent.screen_size,
          document_reference: !isValidId ? event.document_id : null // Store non-UUID IDs in event_data
        }
      });
      
      if (!error) {
        logger.log('Download event tracked successfully using track_user_event');
        return true;
      }
      
      logger.warn('Failed to use track_user_event, falling back to direct insert:', error);
    } catch (rpcError) {
      logger.warn('Error using track_user_event, falling back to direct insert:', rpcError);
    }
    
    // Fallback: Log download event directly
    // For non-UUID IDs, use a placeholder UUID for the database (which requires UUID format)
    const modifiedEvent = {
      ...enhancedEvent,
      document_id: isValidId ? event.document_id : '00000000-0000-0000-0000-000000000000',
    };
    
    const { error } = await supabase
      .from('download_events')
      .insert(modifiedEvent);
      
    if (error) {
      logger.error('Error logging download event:', error);
      
      // Attempt a retry with minimal data if the error might be due to payload size
      if (error.message?.includes('payload') || error.message?.includes('size')) {
        logger.log('Retrying with minimal download event data');
        
        const minimalEvent = {
          document_id: isValidId ? event.document_id : '00000000-0000-0000-0000-000000000000',
          document_type: event.document_type,
          file_name: event.file_name.substring(0, 255), // Ensure filename is not too long
          status: event.status,
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
