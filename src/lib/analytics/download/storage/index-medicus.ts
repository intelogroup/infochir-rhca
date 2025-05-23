
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { checkFileExists } from './file-operations';

const logger = createLogger('IndexMedicusStorage');

// Define constants for bucket IDs - using the new bucket name you created
export const BUCKET_ID_PDF = 'indexmedicuspdf';
export const BUCKET_ID_COVERS = 'indexmedicuspdf'; // Using same bucket for covers temporarily

/**
 * Check if a file exists in the IndexMedicus PDF bucket
 * @param fileName File name to check
 * @returns Boolean indicating if file exists
 */
export const checkIndexMedicusFileExists = async (fileName: string): Promise<boolean> => {
  try {
    if (!fileName) return false;
    
    // Extract just the filename if it's a URL
    const fileNameOnly = fileName.includes('/') 
      ? fileName.split('/').pop() 
      : fileName;
      
    if (!fileNameOnly) return false;
    
    return checkFileExists(BUCKET_ID_PDF, fileNameOnly);
  } catch (err) {
    logger.error('Exception checking if file exists:', err);
    return false;
  }
};

/**
 * Get public URL for an IndexMedicus PDF file
 * @param fileName File name in the indexmedicuspdf bucket
 * @returns Public URL for the file
 */
export const getIndexMedicusPdfUrl = (fileName: string): string => {
  if (!fileName) return '';
  
  // If it's already a URL, return it
  if (fileName.startsWith('http')) return fileName;
  
  // Get public URL from Supabase
  const { data } = supabase.storage
    .from(BUCKET_ID_PDF)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};

/**
 * Get public URL for an IndexMedicus cover image
 * @param fileName File name in the indexmedicuspdf bucket
 * @returns Public URL for the image
 */
export const getIndexMedicusCoverUrl = (fileName: string): string => {
  if (!fileName) return '';
  
  // If it's already a URL, return it
  if (fileName.startsWith('http')) return fileName;
  
  // Get public URL from Supabase
  const { data } = supabase.storage
    .from(BUCKET_ID_COVERS)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};

/**
 * Generate standardized filename for Index Medicus PDFs
 * @param title Article title or identifier
 * @param date Publication date
 * @returns Formatted filename
 */
export const generateIndexMedicusFilename = (title: string, date?: Date): string => {
  const now = date || new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Convert title to safe filename by removing special characters and spaces
  const safeTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50); // Limit length
    
  return `index_medicus_${safeTitle}_${formattedDate}.pdf`;
};
