
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
      logger.error(new Error(errorMessage));
      
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
    logger.error(error);
    
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
