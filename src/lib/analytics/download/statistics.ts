
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import type { DownloadEvent } from "./track-downloads";

const logger = createLogger('DownloadStats');

/**
 * Get download statistics for a specific document
 */
export const getDocumentDownloadStats = async (documentId: string): Promise<{
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  lastDownloadTime: string | null;
} | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_document_download_stats', { doc_id: documentId });
      
    if (error) {
      logger.error(error, { action: 'getDocumentDownloadStats', documentId });
      return null;
    }
    
    if (!data || data.length === 0) {
      return {
        totalDownloads: 0,
        successfulDownloads: 0,
        failedDownloads: 0,
        lastDownloadTime: null
      };
    }
    
    return {
      totalDownloads: Number(data[0].total_downloads),
      successfulDownloads: Number(data[0].successful_downloads),
      failedDownloads: Number(data[0].failed_downloads),
      lastDownloadTime: data[0].last_download_time
    };
  } catch (error) {
    logger.error(error, { action: 'getDocumentDownloadStats', documentId });
    return null;
  }
};

/**
 * Get download statistics for a document type (igm, rhca, etc)
 */
export const getDownloadStatsByType = async (documentType: DownloadEvent['document_type']): Promise<{
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  uniqueDocuments: number;
} | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_download_stats_by_type', { doc_type: documentType });
      
    if (error) {
      logger.error(error, { action: 'getDownloadStatsByType', documentType });
      return null;
    }
    
    if (!data || data.length === 0) {
      return {
        totalDownloads: 0,
        successfulDownloads: 0,
        failedDownloads: 0,
        uniqueDocuments: 0
      };
    }
    
    return {
      totalDownloads: Number(data[0].total_downloads),
      successfulDownloads: Number(data[0].successful_downloads),
      failedDownloads: Number(data[0].failed_downloads),
      uniqueDocuments: Number(data[0].unique_documents)
    };
  } catch (error) {
    logger.error(error, { action: 'getDownloadStatsByType', documentType });
    return null;
  }
};
