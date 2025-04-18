
import { createLogger } from "@/lib/error-logger";
import { 
  trackDownload as trackDownloadEvent
} from "@/lib/analytics/track";
// Import DocumentType from the correct path
import { DocumentType } from "./statistics/types";

// Export the track-downloads functionality
export * from "./track-downloads";

// Export statistics functionality but rename the conflicting function
export { 
  getDownloadStatsByType,
  getDocumentDownloadStats,
  getDailyDownloadStats,
  getOverallDownloadStats,
  // Rename the function to avoid conflict with storage/check-connection.ts
  subscribeToDownloadStats as subscribeToDownloadStatsChanges,
  // We don't need to export DocumentType here as we'll export it at the end of the file
} from "./statistics";

const logger = createLogger("downloadService");

// Re-export storage functions
export * from "./storage/check-connection";

// Types for the download function
export interface DownloadPDFOptions {
  url: string;
  fileName: string;
  documentId: string;
  documentType: DocumentType;
  trackingEnabled?: boolean;
}

/**
 * Downloads a PDF file and tracks the download event
 */
export const downloadPDF = async (options: DownloadPDFOptions): Promise<boolean> => {
  const { url, fileName, documentId, documentType, trackingEnabled = true } = options;
  
  logger.log(`Starting download of: ${fileName} from ${url}`);
  
  try {
    // Fetch the file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the file as a blob
    const blob = await response.blob();
    
    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create an invisible link to trigger download
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.download = fileName;
    
    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
    
    // Track the download if tracking is enabled
    if (trackingEnabled) {
      // Map to standard document type
      const analyticDocType = documentType === DocumentType.Article ? DocumentType.Article : documentType;
      
      await trackDownloadEvent(
        documentId,
        analyticDocType,
        fileName,
        true
      );
    }
    
    logger.log(`Successfully downloaded: ${fileName}`);
    return true;
  } catch (error) {
    logger.error(`Error downloading ${fileName}:`, error);
    
    // We no longer track failed downloads
    
    return false;
  }
};

/**
 * Check if a file exists in specified bucket
 */
export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const res = await fetch(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/${bucket}/${path}`, {
      method: 'HEAD'
    });
    return res.ok;
  } catch (error) {
    logger.error(`Error checking if file exists:`, error);
    return false;
  }
};

// Export DocumentType once at the end of the file
export { DocumentType };
