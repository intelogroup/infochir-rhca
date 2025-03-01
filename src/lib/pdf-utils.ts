
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Check if a file exists in a Supabase storage bucket
 */
export const checkFileExistsInBucket = async (
  bucketName: string,
  fileName: string
): Promise<boolean> => {
  if (!fileName) {
    console.log(`[Storage] No filename provided to check`);
    return false;
  }

  try {
    console.log(`[Storage] Checking if file exists: ${fileName} in bucket: ${bucketName}`);
    
    // First attempt: direct path check
    try {
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from(bucketName)
        .download(fileName);
        
      if (fileData) {
        console.log(`[Storage] File exists (direct check): ${fileName}`);
        return true;
      }
      
      if (fileError) {
        console.log(`[Storage] Direct download check failed: ${fileError.message}`);
      }
    } catch (e) {
      console.log(`[Storage] Error during direct download check: ${e instanceof Error ? e.message : String(e)}`);
    }
    
    // If direct check fails, try listing files with search
    try {
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .list('', {
          search: fileName
        });

      if (error) {
        console.error(`[Storage] Error checking file existence:`, error);
        return false;
      }

      // If we found the file in the list, it exists
      const fileExists = data && data.some(file => file.name === fileName);
      console.log(`[Storage] File exists (list check): ${fileExists} for ${fileName}`);
      
      return fileExists;
    } catch (e) {
      console.log(`[Storage] Error during list check: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  } catch (err) {
    console.error(`[Storage] Failed to check file existence:`, err);
    return false;
  }
};

/**
 * Get the public URL for a file in Supabase storage
 */
export const getFilePublicUrl = (
  bucketName: string,
  fileName: string
): string | null => {
  if (!fileName) {
    console.log(`[Storage] No filename provided to get public URL`);
    return null;
  }
  
  try {
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    console.log(`[Storage] Generated public URL for ${fileName}: ${data?.publicUrl || 'null'}`);
    return data?.publicUrl || null;
  } catch (e) {
    console.error(`[Storage] Error generating public URL: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
};

/**
 * Handle downloading a file from Supabase storage
 */
export const downloadFileFromStorage = async (
  bucketName: string,
  fileName: string,
  articleId: string,
  counterFunction: (articleId: string, type: 'downloads' | 'views') => Promise<void>
): Promise<void> => {
  if (!fileName) {
    toast.error("Fichier non disponible");
    return;
  }

  try {
    console.log(`[Storage] Attempting to download file: ${fileName} from bucket: ${bucketName}`);
    
    // Check if file exists first
    const fileExists = await checkFileExistsInBucket(bucketName, fileName);
    
    if (!fileExists) {
      toast.error("Le fichier n'existe pas dans notre stockage");
      return;
    }
    
    // Get the public URL
    const publicUrl = getFilePublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      toast.error("Impossible d'obtenir l'URL du fichier");
      return;
    }
    
    // Fetch the file using the public URL
    const response = await fetch(publicUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create URL and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    // Update download count
    await counterFunction(articleId, 'downloads');

    toast.success("Téléchargement réussi");
  } catch (error) {
    console.error('[Storage] Download error:', error);
    toast.error("Une erreur est survenue lors du téléchargement");
  }
};

/**
 * Open a file from Supabase storage in a new tab
 */
export const openFileInNewTab = async (
  bucketName: string,
  fileName: string,
  articleId: string,
  counterFunction: (articleId: string, type: 'downloads' | 'views') => Promise<void>
): Promise<void> => {
  if (!fileName) {
    toast.error("Fichier non disponible");
    return;
  }

  try {
    console.log(`[Storage] Attempting to open file: ${fileName} from bucket: ${bucketName}`);
    
    // Check if file exists first
    const fileExists = await checkFileExistsInBucket(bucketName, fileName);
    
    if (!fileExists) {
      toast.error("Le fichier n'existe pas dans notre stockage");
      return;
    }
    
    // Get the public URL
    const publicUrl = getFilePublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      toast.error("Impossible d'obtenir l'URL du fichier");
      return;
    }
    
    // Open in new tab
    window.open(publicUrl, '_blank');
    
    // Increment view counter
    await counterFunction(articleId, 'views');
    
    toast.success("Fichier ouvert dans un nouvel onglet");
  } catch (error) {
    console.error('[Storage] Error opening file:', error);
    toast.error("Erreur lors de l'ouverture du fichier");
  }
};

/**
 * Extract filename from a URL or path
 */
export const extractFilenameFromUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  return url.split('/').pop();
};

/**
 * Map volume/issue to actual existing image files
 */
export const mapToCoverImageFileName = (volume: string, issue: string): string | undefined => {
  // This mapping matches the actual files in storage to the article records
  const volumeIssueMap: Record<string, string> = {
    "2:47": "RHCA_vol_02_no_47_cover.jpg",
    "3:48": "RHCA_vol_03_no_48_cover.jpg", 
    "4:49": "RHCA_vol_04_no_49_cover.jpg"
  };
  
  const key = `${volume}:${issue}`;
  return volumeIssueMap[key];
};
