
import { createLogger } from "@/lib/error-logger";
import { 
  trackDownload as trackDownloadEvent
} from "@/lib/analytics/track";

// Export the track-downloads functionality
export * from "./track-downloads";

const logger = createLogger("downloadService");

// Re-export storage functions
export * from "./storage/check-connection";

// Types for the download function
export interface DownloadPDFOptions {
  url: string;
  fileName: string;
  documentId: string;
  documentType: 'igm' | 'rhca' | 'adc' | 'index-medicus' | 'other' | 'test';
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
      const analyticDocType = documentType === 'index-medicus' ? 'article' : 
                            (documentType === 'test' ? 'other' : documentType);
      
      await trackDownloadEvent(
        documentId,
        analyticDocType as any,
        fileName,
        true
      );
    }
    
    logger.log(`Successfully downloaded: ${fileName}`);
    return true;
  } catch (error) {
    logger.error(`Error downloading ${fileName}:`, error);
    
    // Track the failed download if tracking is enabled
    if (trackingEnabled) {
      // Map to standard document type
      const analyticDocType = documentType === 'index-medicus' ? 'article' : 
                            (documentType === 'test' ? 'other' : documentType);
      
      await trackDownloadEvent(
        documentId,
        analyticDocType as any,
        fileName,
        false,
        error instanceof Error ? error.message : String(error)
      );
    }
    
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
