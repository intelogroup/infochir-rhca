
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a file exists in a Supabase Storage bucket
 */
export const checkFileExistsInBucket = async (bucketName: string, fileName: string) => {
  try {
    console.log(`[PDFUtils] Checking if ${fileName} exists in ${bucketName}`);
    
    // Get public URL but don't throw if file doesn't exist
    const { data } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    // Try to fetch the file to verify it exists
    try {
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      const exists = response.ok;
      console.log(`[PDFUtils] File ${fileName} in ${bucketName} exists: ${exists}`);
      return exists;
    } catch (fetchError) {
      console.error(`[PDFUtils] Error fetching file ${fileName}:`, fetchError);
      return false;
    }
  } catch (error) {
    console.error(`[PDFUtils] Unexpected error checking file ${fileName}:`, error);
    return false;
  }
};

/**
 * Get a file's public URL from Supabase storage
 */
export const getFilePublicUrl = (bucketName: string, fileName: string) => {
  if (!fileName) return null;
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};

/**
 * Download a file from Supabase storage
 */
export const downloadFileFromStorage = async (bucketName: string, fileName: string, articleId?: string) => {
  try {
    if (!fileName) {
      throw new Error("Filename is required");
    }
    
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    window.open(data.publicUrl, '_blank');
    
    // Track download if articleId is provided
    if (articleId) {
      try {
        await supabase.rpc('increment_count', { 
          table_name: 'articles', 
          column_name: 'downloads', 
          row_id: articleId 
        });
      } catch (error) {
        console.error('[PDFUtils] Error incrementing download count:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('[PDFUtils] Error downloading file:', error);
    return false;
  }
};
