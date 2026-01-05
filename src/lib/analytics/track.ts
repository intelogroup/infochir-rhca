
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "./download/statistics/types";
import { getClientInfo } from "./session";

const logger = createLogger('AnalyticsTracking');

/**
 * Track a view event
 */
export const trackView = async (documentId: string, documentType: DocumentType): Promise<boolean> => {
  try {
    // Validate inputs
    if (!documentId || !documentType) {
      logger.warn('Invalid parameters for trackView:', { documentId, documentType });
      return false;
    }

    const clientInfo = getClientInfo();

    // Use the RPC function to track the view
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'view',
      p_document_id: isValidUuid(documentId) ? documentId : null,
      p_document_type: documentType,
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        page_url: clientInfo.pageUrl,
        document_reference: !isValidUuid(documentId) ? documentId : null,
        screen_size: clientInfo.screenSize
      }
    });
    
    if (error) {
      // Only log detailed error in development
      if (import.meta.env.DEV) {
        logger.error('Error tracking view:', error);
      }
      return false;
    }
    
    return true;
  } catch (error) {
    // Only log detailed error in development
    if (import.meta.env.DEV) {
      logger.error('Exception tracking view:', error);
    }
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
    const clientInfo = getClientInfo();

    // Use the RPC function to track the share
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'share',
      p_document_id: isValidUuid(documentId) ? documentId : null,
      p_document_type: documentType,
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        share_method: shareMethod,
        page_url: clientInfo.pageUrl,
        document_reference: !isValidUuid(documentId) ? documentId : null
      }
    });
    
    if (error) {
      logger.error('Error tracking share:', error);
      
      // Fallback: try to increment the count directly
      try {
        if (isValidUuid(documentId)) {
          await supabase.rpc('increment_count', {
            table_name: 'articles',
            column_name: 'shares',
            row_id: documentId
          });
        }
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
    const clientInfo = getClientInfo();
    // Check if document ID is a valid UUID
    const isValidId = isValidUuid(documentId);
    
    // Use the RPC function to track the download
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'download',
      p_document_id: isValidId ? documentId : null,
      p_document_type: documentType,
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        fileName,
        status: success ? 'success' : 'failed',
        screenSize: clientInfo.screenSize,
        document_reference: !isValidId ? documentId : null
      }
    });
    
    if (error) {
      logger.error('Error tracking download:', error);
      
      // Try direct insert as fallback
      try {
        await supabase.from('download_events').insert({
          document_id: isValidId ? documentId : '00000000-0000-0000-0000-000000000000',
          document_type: documentType,
          file_name: fileName,
          status: success ? 'success' : 'failed',
          user_agent: clientInfo.userAgent,
          screen_size: clientInfo.screenSize,
          referrer: clientInfo.referrer
        });
      } catch (insertError) {
        logger.error('Error inserting download event:', insertError);
      }
      
      // Fallback: try to increment the count directly
      if (success && isValidId) {
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
  filters?: Record<string, unknown>
): Promise<boolean> => {
  try {
    const clientInfo = getClientInfo();

    // Use the RPC function to track the search
    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'search',
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        query,
        results_count: resultsCount,
        filters: filters ? JSON.stringify(filters) : null,
        page_url: clientInfo.pageUrl
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

/**
 * Track a page view event (for route changes)
 */
export const trackPageView = async (route: string): Promise<boolean> => {
  try {
    const clientInfo = getClientInfo();

    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'page_view',
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        route,
        screen_size: clientInfo.screenSize,
        timestamp: new Date().toISOString()
      }
    });

    if (error) {
      if (import.meta.env.DEV) {
        logger.error('Error tracking page view:', error);
      }
      return false;
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.error('Exception tracking page view:', error);
    }
    return false;
  }
};

/**
 * Track article/document click event
 */
export const trackClick = async (
  documentId: string,
  documentType: DocumentType,
  title?: string
): Promise<boolean> => {
  try {
    const clientInfo = getClientInfo();

    const { error } = await supabase.rpc('track_user_event', {
      p_event_type: 'click',
      p_document_id: isValidUuid(documentId) ? documentId : null,
      p_document_type: documentType,
      p_session_id: clientInfo.sessionId,
      p_user_agent: clientInfo.userAgent,
      p_referrer: clientInfo.referrer,
      p_page_url: clientInfo.pageUrl,
      p_event_data: {
        document_reference: !isValidUuid(documentId) ? documentId : null,
        title,
        screen_size: clientInfo.screenSize
      }
    });

    if (error) {
      if (import.meta.env.DEV) {
        logger.error('Error tracking click:', error);
      }
      return false;
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.error('Exception tracking click:', error);
    }
    return false;
  }
};

/**
 * Check if a string is a valid UUID
 */
export const isValidUuid = (str: string): boolean => {
  if (!str) return false;
  
  // UUID v4 regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
};
