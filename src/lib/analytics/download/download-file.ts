
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "./statistics/types";

const logger = createLogger("downloadFile");

/**
 * Downloads a file from a URL to the user's device
 */
export const downloadFile = async (
  url: string,
  fileName: string,
  documentType: DocumentType = DocumentType.Article
): Promise<boolean> => {
  try {
    logger.log(`Downloading file: ${fileName} from ${url}`);
    
    // Fetch the file from the provided URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: HTTP ${response.status}`);
    }
    
    // Get the file as a blob
    const blob = await response.blob();
    
    // Create an object URL for the blob
    const objectUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    
    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    window.URL.revokeObjectURL(objectUrl);
    
    logger.log(`Successfully downloaded file: ${fileName}`);
    return true;
  } catch (error) {
    logger.error(`Error downloading file:`, error);
    return false;
  }
};
