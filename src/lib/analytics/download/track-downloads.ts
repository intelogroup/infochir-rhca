
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadTracking');

export interface DownloadEvent {
  document_id: string;
  document_type: 'igm' | 'rhca' | 'index-medicus' | 'adc' | 'other';
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
 */
export const trackDownload = async (event: DownloadEvent): Promise<boolean> => {
  logger.log(`Tracking download event:`, event);
  
  try {
    // First increment the download count in the original table if success
    if (event.status === 'success') {
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'downloads',
        row_id: event.document_id
      });
      
      logger.log(`Incremented download count for ${event.document_id}`);
    }
    
    // Log download event for analytics purposes
    const { error } = await supabase
      .from('download_events')
      .insert({
        document_id: event.document_id,
        document_type: event.document_type,
        file_name: event.file_name,
        status: event.status,
        error_details: event.error_details || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        ip_address: null // IP will be captured on the server side
      });
      
    if (error) {
      logger.error('Error logging download event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception tracking download:', error);
    return false;
  }
};
