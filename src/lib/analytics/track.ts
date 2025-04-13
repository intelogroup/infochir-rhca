
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "./download/statistics/types";

const logger = createLogger('AnalyticsTracking');

/**
 * Track a view event
 */
export const trackView = async (documentId: string, documentType: DocumentType): Promise<boolean> => {
  try {
    // Use the RPC function to track the view
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'view',
      p_document_id: documentId,
      p_document_type: documentType,
      p_event_data: {
        page_url: window.location.href
      }
    });
    
    if (error) {
      logger.error('Error tracking view:', error);
      
      // Fallback: try to increment the count directly
      try {
        await supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'views',
          row_id: documentId
        });
      } catch (incrementError) {
        logger.error('Error incrementing view count:', incrementError);
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception tracking view:', error);
    return false;
  }
};

/**
 * Track a share event
 */
export const trackShare = async (
  documentId: string, 
  documentType: DocumentType,
  shareMethod: 'social' | 'email' | 'clipboard' | 'other' = 'other'
): Promise<boolean> => {
  try {
    // Use the RPC function to track the share
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'share',
      p_document_id: documentId,
      p_document_type: documentType,
      p_event_data: {
        share_method: shareMethod,
        page_url: window.location.href
      }
    });
    
    if (error) {
      logger.error('Error tracking share:', error);
      
      // Fallback: try to increment the count directly
      try {
        await supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'shares',
          row_id: documentId
        });
      } catch (incrementError) {
        logger.error('Error incrementing share count:', incrementError);
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception tracking share:', error);
    return false;
  }
};

/**
 * Track a download event
 */
export const trackDownload = async (
  documentId: string,
  documentType: DocumentType,
  fileName: string,
  success: boolean = true
): Promise<boolean> => {
  try {
    // Use the RPC function to track the download
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'download',
      p_document_id: documentId,
      p_document_type: documentType,
      p_event_data: {
        fileName,
        status: success ? 'success' : 'failed',
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      }
    });
    
    if (error) {
      logger.error('Error tracking download:', error);
      
      // Try direct insert as fallback
      try {
        await supabase.from('download_events').insert({
          document_id: documentId,
          document_type: documentType,
          file_name: fileName,
          status: success ? 'success' : 'failed',
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer
        });
      } catch (insertError) {
        logger.error('Error inserting download event:', insertError);
      }
      
      // Fallback: try to increment the count directly if successful
      if (success) {
        try {
          await supabase.rpc('increment_count', {
            table_name: 'articles',
            column_name: 'downloads',
            row_id: documentId
          });
        } catch (incrementError) {
          logger.error('Error incrementing download count:', incrementError);
        }
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception tracking download:', error);
    return false;
  }
};

/**
 * Track a search event
 */
export const trackSearch = async (
  query: string,
  resultsCount: number,
  filters?: Record<string, any>
): Promise<boolean> => {
  try {
    // Use the RPC function to track the search
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'search',
      p_event_data: {
        query,
        results_count: resultsCount,
        filters: filters ? JSON.stringify(filters) : null,
        page_url: window.location.href
      }
    });
    
    if (error) {
      logger.error('Error tracking search:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception tracking search:', error);
    return false;
  }
};
