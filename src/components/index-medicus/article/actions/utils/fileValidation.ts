
import { createLogger } from "@/lib/error-logger";
import { checkFileExists } from "@/lib/analytics/download";
import { BUCKET_ID_PDF } from "@/lib/analytics/download/storage/index-medicus";

const logger = createLogger('FileValidation');

/**
 * Validates if a file exists in storage
 * @param pdfUrl URL of the PDF to validate
 * @returns Promise<boolean> true if file exists
 */
export const validateFileExists = async (pdfUrl?: string): Promise<boolean> => {
  if (!pdfUrl) {
    return false;
  }

  try {
    if (pdfUrl.includes('article-pdfs') || pdfUrl.includes('rhca-pdfs') || 
        pdfUrl.includes('indexmedicuspdf') || pdfUrl.includes(BUCKET_ID_PDF)) {
      // Extract bucket name and file name from URL
      const bucketName = pdfUrl.includes('article-pdfs') 
        ? 'article-pdfs' 
        : pdfUrl.includes('rhca-pdfs') 
          ? 'rhca-pdfs'
          : pdfUrl.includes('indexmedicuspdf')
            ? 'indexmedicuspdf'
            : BUCKET_ID_PDF;
      
      const fileName = pdfUrl.split('/').pop();
      if (!fileName) {
        return false;
      }
      
      const exists = await checkFileExists(bucketName, fileName);
      return exists;
    } else {
      // For external URLs, do a HEAD request
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      return response.ok;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};
