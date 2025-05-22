
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('IndexMedicusStorage');

/**
 * Gets a public URL for an Index Medicus cover image from the Supabase storage
 * @param filename The filename in the indexmedicus_covers bucket
 * @returns Public URL for the cover image
 */
export const getIndexMedicusCoverUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return it
  if (filename.startsWith('http')) return filename;
  
  const { data } = supabase.storage
    .from('indexmedicus_covers')
    .getPublicUrl(filename);
    
  return data.publicUrl;
};

/**
 * Gets a public URL for an Index Medicus PDF from the Supabase storage
 * @param filename The filename in the indexmedicus_pdfs bucket
 * @returns Public URL for the PDF file
 */
export const getIndexMedicusPdfUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return it
  if (filename.startsWith('http')) return filename;
  
  const { data } = supabase.storage
    .from('indexmedicus_pdfs')
    .getPublicUrl(filename);
    
  return data.publicUrl;
};

/**
 * Generates a standardized Index Medicus PDF filename based on article info
 * @param title Article title (will be sanitized)
 * @param date Publication date
 * @returns Standardized PDF filename
 */
export const generateIndexMedicusPdfFilename = (title: string, date?: Date): string => {
  const now = date || new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Sanitize the title for use in a filename
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
    
  return `index-medicus_${cleanTitle}_${dateStr}.pdf`;
};

/**
 * Checks if a file exists in the Index Medicus PDF bucket
 * @param fileName Name of the file to check
 * @returns Promise<boolean> True if file exists
 */
export const checkIndexMedicusFileExists = async (fileName: string): Promise<boolean> => {
  try {
    if (!fileName) return false;
    
    // Extract just the filename if it's a URL
    const fileNameOnly = fileName.includes('/') 
      ? fileName.split('/').pop() 
      : fileName;
      
    if (!fileNameOnly) return false;
    
    const { data, error } = await supabase.storage
      .from('indexmedicus_pdfs')
      .list('', { 
        limit: 1,
        search: fileNameOnly
      });
      
    if (error) {
      logger.error('Error checking if file exists:', error);
      return false;
    }
    
    return data.length > 0;
  } catch (err) {
    logger.error('Exception checking if file exists:', err);
    return false;
  }
};
