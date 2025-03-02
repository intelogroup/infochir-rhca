
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadAnalytics');

interface DownloadEvent {
  document_id: string;
  document_type: 'igm' | 'rhca' | 'article' | 'other';
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
      logger.error(new Error('Error logging download event'), { error, event });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error(error, { action: 'trackDownload', event });
    return false;
  }
};

/**
 * Enhanced PDF download function with proper error handling, analytics and user feedback
 */
export const downloadPDF = async ({
  url,
  fileName,
  documentId,
  documentType = 'other',
  trackingEnabled = true
}: {
  url: string;
  fileName: string;
  documentId: string;
  documentType?: DownloadEvent['document_type'];
  trackingEnabled?: boolean;
}): Promise<boolean> => {
  logger.log(`Starting download for: ${fileName}`);
  
  try {
    // Show loading toast
    const toastId = toast.loading(`Préparation du téléchargement...`);
    
    // Validate URL
    if (!url) {
      toast.error("Le fichier PDF n'est pas disponible", {
        id: toastId,
        description: "Impossible de télécharger ce document."
      });
      
      if (trackingEnabled) {
        await trackDownload({
          document_id: documentId,
          document_type: documentType,
          file_name: fileName,
          status: 'failed',
          error_details: 'Missing URL'
        });
      }
      
      return false;
    }
    
    // Try to fetch the file
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error(new Error(errorMessage), { url, status: response.status });
      
      toast.error("Échec du téléchargement", {
        id: toastId,
        description: `Impossible d'accéder au fichier (${response.status})`
      });
      
      if (trackingEnabled) {
        await trackDownload({
          document_id: documentId,
          document_type: documentType,
          file_name: fileName,
          status: 'failed',
          error_details: errorMessage
        });
      }
      
      return false;
    }
    
    // Get the file content
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    // Show success toast
    toast.success("Téléchargement réussi", {
      id: toastId,
      description: fileName
    });
    
    // Track successful download
    if (trackingEnabled) {
      await trackDownload({
        document_id: documentId,
        document_type: documentType,
        file_name: fileName,
        status: 'success'
      });
    }
    
    return true;
  } catch (error) {
    logger.error(error, { action: 'downloadPDF', documentId, url });
    
    toast.error("Échec du téléchargement", {
      description: "Une erreur inattendue est survenue"
    });
    
    if (trackingEnabled) {
      await trackDownload({
        document_id: documentId,
        document_type: documentType,
        file_name: fileName,
        status: 'failed',
        error_details: error instanceof Error ? error.message : String(error)
      });
    }
    
    return false;
  }
};

/**
 * Utility to check if a file exists in Supabase storage
 */
export const checkFileExists = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    logger.log(`Checking if file exists: ${bucketName}/${filePath}`);
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // Try a HEAD request to check if file exists
    const response = await fetch(data.publicUrl, { 
      method: 'HEAD',
      cache: 'no-store' 
    });
    
    const exists = response.ok;
    logger.log(`File ${filePath} exists: ${exists}`);
    return exists;
  } catch (error) {
    logger.error(error, { action: 'checkFileExists', bucketName, filePath });
    return false;
  }
};

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

/**
 * Get storage usage statistics
 */
export const getStorageStats = async (): Promise<{
  totalFiles: number;
  totalSize: number;
  bucketStats: Record<string, { files: number; size: number }>;
} | null> => {
  try {
    // Get list of buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      throw bucketsError;
    }
    
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      bucketStats: {} as Record<string, { files: number; size: number }>
    };
    
    // Get stats for each bucket
    for (const bucket of buckets) {
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucket.name)
        .list();
        
      if (filesError) {
        logger.error(filesError, { action: 'getStorageStats', bucket: bucket.name });
        continue;
      }
      
      const bucketSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      
      stats.totalFiles += files.length;
      stats.totalSize += bucketSize;
      stats.bucketStats[bucket.name] = {
        files: files.length,
        size: bucketSize
      };
    }
    
    logger.log(`Storage stats:`, stats);
    return stats;
  } catch (error) {
    logger.error(error, { action: 'getStorageStats' });
    return null;
  }
};
