
import { 
  getIndexMedicusCoverUrl as getIndexMedicusCoverUrlBase,
  getIndexMedicusPdfUrl as getIndexMedicusPdfUrlBase,
  checkIndexMedicusFileExists as checkIndexMedicusFileExistsBase,
  generateIndexMedicusFilename
} from "@/lib/analytics/download/storage";

/**
 * Gets a public URL for an Index Medicus cover image from the Supabase storage
 * @param filename The filename in the indexmedicus_covers bucket
 * @returns Public URL for the cover image
 */
export const getIndexMedicusCoverUrl = getIndexMedicusCoverUrlBase;

/**
 * Gets a public URL for an Index Medicus PDF from the Supabase storage
 * @param filename The filename in the indexmedicus_pdfs bucket
 * @returns Public URL for the PDF file
 */
export const getIndexMedicusPdfUrl = getIndexMedicusPdfUrlBase;

/**
 * Checks if a file exists in the Index Medicus PDF bucket
 * @param fileName Name of the file to check
 * @returns Promise<boolean> True if file exists
 */
export const checkIndexMedicusFileExists = checkIndexMedicusFileExistsBase;

/**
 * Generates a standardized Index Medicus PDF filename based on article info
 * @param title Article title (will be sanitized)
 * @param date Publication date
 * @returns Standardized PDF filename
 */
export const generateIndexMedicusPdfFilename = generateIndexMedicusFilename;
