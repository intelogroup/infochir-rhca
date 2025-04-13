
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "./types";

const logger = createLogger('DownloadStatsOperations');

/**
 * Manually increment download count for a document
 * This is a fallback when the automatic tracking fails
 */
export const incrementDownloadCount = async (
  documentId: string, 
  documentType: DocumentType
): Promise<boolean> => {
  try {
    // First increment the primary article downloads count
    const { error: articleError } = await supabase
      .rpc('increment_count', {
        table_name: 'articles',
        column_name: 'downloads',
        row_id: documentId
      });

    if (articleError) {
      logger.error('Error incrementing article download count:', articleError);
      // Continue with stats tracking even if article increment fails
    }

    // Then log the download event
    const { error: eventError } = await supabase
      .from('download_events')
      .insert({
        document_id: documentId,
        document_type: documentType,
        file_name: `manual-increment-${documentId}.pdf`,
        status: 'success'
      });

    if (eventError) {
      logger.error('Error logging download event:', eventError);
      return false;
    }

    logger.log(`Successfully incremented download count for ${documentId}`);
    return true;
  } catch (error) {
    logger.error('Exception incrementing download count:', error);
    return false;
  }
};

/**
 * Test download tracking system
 * Creates a test download event and verifies it was recorded
 */
export const testDownloadTracking = async (): Promise<boolean> => {
  try {
    const testDocId = '00000000-0000-0000-0000-000000000001';
    const testFileName = `test-download-${Date.now()}.pdf`;
    
    // Insert a test event
    const { error } = await supabase
      .from('download_events')
      .insert({
        document_id: testDocId,
        document_type: DocumentType.Test,
        file_name: testFileName,
        status: 'success',
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`
      });
    
    if (error) {
      logger.error('Error inserting test download event:', error);
      return false;
    }
    
    // Verify the event was recorded
    const { data, error: verifyError } = await supabase
      .from('download_events')
      .select('*')
      .eq('document_id', testDocId)
      .eq('file_name', testFileName)
      .single();
    
    if (verifyError || !data) {
      logger.error('Error verifying test download event:', verifyError);
      return false;
    }
    
    logger.log('Download tracking test successful');
    return true;
  } catch (error) {
    logger.error('Exception testing download tracking:', error);
    return false;
  }
};
