
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger("analytics");

// Define types for the analytics system
export type EventType = 'download' | 'share' | 'view' | 'search' | 'click' | 'login' | 'logout' | 'register' | 'other';
export type DocumentType = 'igm' | 'rhca' | 'adc' | 'article' | 'other';

export interface TrackEventOptions {
  documentId?: string;
  documentType?: DocumentType;
  data?: Record<string, any>;
  sessionId?: string;
  pageUrl?: string;
}

// Session ID for anonymous tracking
let sessionId = '';

/**
 * Generate a simple unique ID without UUID dependency
 */
const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

/**
 * Initialize the analytics system
 */
export const initAnalytics = () => {
  // Create a session ID if not exists
  if (!sessionId) {
    // Try to get from localStorage
    const storedSessionId = window.localStorage.getItem('infochir_session_id');
    
    if (storedSessionId) {
      sessionId = storedSessionId;
    } else {
      // Create a new session ID
      sessionId = generateId();
      window.localStorage.setItem('infochir_session_id', sessionId);
    }
  }
  
  logger.log("Analytics initialized with session ID:", sessionId);
  
  // Record page view on initialization
  trackPageView();
  
  // Listen for page changes
  window.addEventListener('popstate', () => {
    trackPageView();
  });
};

/**
 * Get the current page URL
 */
const getCurrentPageUrl = (): string => {
  return window.location.href;
};

/**
 * Get the referrer URL
 */
const getReferrer = (): string => {
  return document.referrer || '';
};

/**
 * Get the user agent string
 */
const getUserAgent = (): string => {
  return navigator.userAgent || '';
};

/**
 * Get the screen size as a string
 */
const getScreenSize = (): string => {
  return `${window.innerWidth}x${window.innerHeight}`;
};

/**
 * Common method to track any user event
 */
export const trackEvent = async (
  eventType: EventType, 
  options: TrackEventOptions = {}
): Promise<boolean> => {
  try {
    logger.log(`Tracking ${eventType} event:`, options);
    
    const eventData = {
      ...options.data,
      screenSize: getScreenSize(),
      timestamp: new Date().toISOString()
    };
    
    const pageUrl = options.pageUrl || getCurrentPageUrl();
    
    const { data, error } = await supabase.rpc('track_user_event', {
      p_event_type: eventType,
      p_document_id: options.documentId,
      p_document_type: options.documentType,
      p_user_id: null, // We don't have authentication in this app yet
      p_event_data: eventData,
      p_session_id: options.sessionId || sessionId,
      p_user_agent: getUserAgent(),
      p_referrer: getReferrer(),
      p_page_url: pageUrl,
      p_ip_address: null // IP will be collected by Supabase
    });
    
    if (error) {
      logger.error(`Error tracking ${eventType} event:`, error);
      return false;
    }
    
    logger.log(`Successfully tracked ${eventType} event with ID:`, data);
    return true;
  } catch (error) {
    logger.error(`Exception tracking ${eventType} event:`, error);
    return false;
  }
};

/**
 * Track page views
 */
export const trackPageView = async (): Promise<boolean> => {
  const url = getCurrentPageUrl();
  const pathname = window.location.pathname;
  
  // Extract page/route information from pathname
  const segments = pathname.split('/').filter(s => s);
  const route = segments.length > 0 ? segments[0] : 'home';
  
  return trackEvent('view', {
    data: {
      route,
      path: pathname
    },
    pageUrl: url
  });
};

/**
 * Track document views
 */
export const trackDocumentView = async (
  documentId: string, 
  documentType: DocumentType,
  title?: string
): Promise<boolean> => {
  return trackEvent('view', {
    documentId,
    documentType,
    data: {
      title,
      action: 'view_document'
    }
  });
};

/**
 * Track document downloads
 */
export const trackDownload = async (
  documentId: string,
  documentType: DocumentType,
  fileName: string,
  success: boolean = true,
  error?: string
): Promise<boolean> => {
  return trackEvent('download', {
    documentId,
    documentType,
    data: {
      fileName,
      status: success ? 'success' : 'failed',
      error: error || null
    }
  });
};

/**
 * Track document shares
 */
export const trackShare = async (
  documentId: string,
  documentType: DocumentType,
  method: 'clipboard' | 'native' | 'direct' = 'clipboard',
): Promise<boolean> => {
  return trackEvent('share', {
    documentId,
    documentType,
    data: {
      method,
      action: 'share_document'
    }
  });
};

/**
 * Track search queries
 */
export const trackSearch = async (
  query: string,
  category?: string,
  resultCount?: number
): Promise<boolean> => {
  return trackEvent('search', {
    data: {
      query,
      category,
      resultCount,
      action: 'search'
    }
  });
};

/**
 * Track button clicks and other interactions
 */
export const trackClick = async (
  element: string,
  action?: string,
  documentId?: string,
  documentType?: DocumentType
): Promise<boolean> => {
  return trackEvent('click', {
    documentId,
    documentType,
    data: {
      element,
      action: action || 'click'
    }
  });
};
