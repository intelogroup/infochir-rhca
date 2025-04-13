
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";
import { trackDownload, type DownloadEvent } from "./track-downloads";

const logger = createLogger('DownloadFile');

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
  logger.log(`Starting download for: ${fileName} from ${url}`);
  
  try {
    // Show loading toast
    const toastId = toast.loading(`Préparation du téléchargement...`);
    
    // Validate URL
    if (!url) {
      toast.error("Le fichier PDF n'est pas disponible", {
        id: toastId,
        description: "Impossible de télécharger ce document."
      });
      
      // We no longer track failed downloads
      return false;
    }
    
    // Try to fetch the file with timeout and retry logic
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        response = await fetch(url, { 
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) break;
        
        logger.warn(`Retry ${retryCount + 1}/${maxRetries} for download, status: ${response.status}`);
        retryCount++;
        
        if (retryCount <= maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      } catch (fetchError) {
        logger.error('Fetch error:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          logger.warn('Download request timed out');
        }
        
        retryCount++;
        
        if (retryCount > maxRetries) {
          throw fetchError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      }
    }
    
    if (!response || !response.ok) {
      const errorMessage = response ? `HTTP error! status: ${response.status}` : 'Network error';
      logger.error(new Error(errorMessage));
      
      toast.error("Échec du téléchargement", {
        id: toastId,
        description: `Impossible d'accéder au fichier ${response ? `(${response.status})` : ''}`
      });
      
      // We no longer track failed downloads
      return false;
    }
    
    // Get the file content
    const blob = await response.blob();
    
    // Check if the blob is valid
    if (!blob || blob.size === 0) {
      logger.error('Downloaded blob is empty or invalid');
      
      toast.error("Fichier invalide", {
        id: toastId,
        description: "Le fichier téléchargé est vide ou corrompu."
      });
      
      // We no longer track failed downloads
      return false;
    }
    
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
    logger.error('Download error:', error);
    
    toast.error("Échec du téléchargement", {
      description: "Une erreur inattendue est survenue"
    });
    
    // We no longer track failed downloads
    return false;
  }
};
