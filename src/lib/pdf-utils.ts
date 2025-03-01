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
    console.error(`[Storage:ERROR] No filename provided to check`);
    return false;
  }

  try {
    console.log(`[Storage:INFO] Checking if file exists: ${fileName} in bucket: ${bucketName}`);
    
    // First attempt: direct path check
    try {
      console.log(`[Storage:DEBUG] Attempting direct download check for: ${fileName}`);
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from(bucketName)
        .download(fileName);
        
      if (fileData) {
        console.log(`[Storage:SUCCESS] File exists (direct check): ${fileName}`);
        return true;
      }
      
      if (fileError) {
        console.error(`[Storage:ERROR] Direct download check failed: ${fileError.message}`, fileError);
      }
    } catch (e) {
      console.error(`[Storage:ERROR] Exception during direct download check:`, e);
      console.error(`Error details: ${e instanceof Error ? e.message : String(e)}`);
    }
    
    // If direct check fails, try listing files with search
    try {
      console.log(`[Storage:DEBUG] Attempting list search for: ${fileName}`);
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .list('', {
          search: fileName
        });

      if (error) {
        console.error(`[Storage:ERROR] Error during list search:`, error);
        console.error(`Error details: ${error.message}`);
        return false;
      }

      if (!data || data.length === 0) {
        console.log(`[Storage:INFO] No files found matching: ${fileName}`);
        return false;
      }

      // If we found the file in the list, it exists
      const fileExists = data.some(file => file.name === fileName);
      console.log(`[Storage:${fileExists ? 'SUCCESS' : 'INFO'}] File exists (list check): ${fileExists} for ${fileName}`);
      
      if (fileExists) {
        console.log(`[Storage:DEBUG] Found matching file in bucket: ${data.find(file => file.name === fileName)?.name}`);
      } else {
        console.log(`[Storage:DEBUG] Available files in bucket:`, data.map(file => file.name));
      }
      
      return fileExists;
    } catch (e) {
      console.error(`[Storage:ERROR] Exception during list check:`, e);
      console.error(`Error details: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  } catch (err) {
    console.error(`[Storage:ERROR] Failed to check file existence:`, err);
    console.error(`Error details: ${err instanceof Error ? err.message : String(err)}`);
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
    console.error(`[Storage:ERROR] No filename provided to get public URL`);
    return null;
  }
  
  try {
    console.log(`[Storage:DEBUG] Generating public URL for ${fileName} in bucket ${bucketName}`);
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    if (!data || !data.publicUrl) {
      console.error(`[Storage:ERROR] Failed to generate public URL for ${fileName}`);
      return null;
    }
    
    console.log(`[Storage:SUCCESS] Generated public URL for ${fileName}: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (e) {
    console.error(`[Storage:ERROR] Exception generating public URL:`, e);
    console.error(`Error details: ${e instanceof Error ? e.message : String(e)}`);
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
    console.error(`[Storage:ERROR] Download attempted with no filename`);
    toast.error("Fichier non disponible");
    return;
  }

  try {
    console.log(`[Storage:INFO] Attempting to download file: ${fileName} from bucket: ${bucketName}`);
    
    // Check if file exists first
    console.log(`[Storage:DEBUG] Verifying file existence before download`);
    const fileExists = await checkFileExistsInBucket(bucketName, fileName);
    
    if (!fileExists) {
      console.error(`[Storage:ERROR] File does not exist in storage: ${fileName}`);
      toast.error("Le fichier n'existe pas dans notre stockage");
      return;
    }
    
    // Get the public URL
    console.log(`[Storage:DEBUG] Getting public URL for download`);
    const publicUrl = getFilePublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      console.error(`[Storage:ERROR] Failed to get public URL for ${fileName}`);
      toast.error("Impossible d'obtenir l'URL du fichier");
      return;
    }
    
    // Fetch the file using the public URL
    console.log(`[Storage:DEBUG] Fetching file from URL: ${publicUrl}`);
    const response = await fetch(publicUrl);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[Storage:ERROR] HTTP error fetching file! Status: ${response.status}`, {
        statusText: response.statusText,
        errorText,
        url: publicUrl
      });
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    console.log(`[Storage:DEBUG] File fetched successfully, creating blob`);
    const blob = await response.blob();
    
    // Create URL and trigger download
    console.log(`[Storage:DEBUG] Creating object URL for blob (size: ${blob.size} bytes)`);
    const url = window.URL.createObjectURL(blob);
    
    console.log(`[Storage:DEBUG] Triggering download via link click`);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    console.log(`[Storage:DEBUG] Cleaning up after download`);
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    // Update download count
    console.log(`[Storage:DEBUG] Updating download counter for article ${articleId}`);
    try {
      await counterFunction(articleId, 'downloads');
      console.log(`[Storage:SUCCESS] Download counter updated for article ${articleId}`);
    } catch (countError) {
      console.error(`[Storage:ERROR] Failed to update download counter:`, countError);
      // Don't fail the download if counter update fails
    }

    console.log(`[Storage:SUCCESS] Download completed successfully for ${fileName}`);
    toast.success("Téléchargement réussi");
  } catch (error) {
    console.error('[Storage:ERROR] Download failed:', error);
    console.error(`Error details: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`Error stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
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
    console.error(`[Storage:ERROR] Open in new tab attempted with no filename`);
    toast.error("Fichier non disponible");
    return;
  }

  try {
    console.log(`[Storage:INFO] Attempting to open file: ${fileName} from bucket: ${bucketName}`);
    
    // Check if file exists first
    console.log(`[Storage:DEBUG] Verifying file existence before opening`);
    const fileExists = await checkFileExistsInBucket(bucketName, fileName);
    
    if (!fileExists) {
      console.error(`[Storage:ERROR] File does not exist in storage: ${fileName}`);
      toast.error("Le fichier n'existe pas dans notre stockage");
      return;
    }
    
    // Get the public URL
    console.log(`[Storage:DEBUG] Getting public URL for opening in new tab`);
    const publicUrl = getFilePublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      console.error(`[Storage:ERROR] Failed to get public URL for ${fileName}`);
      toast.error("Impossible d'obtenir l'URL du fichier");
      return;
    }
    
    // Open in new tab
    console.log(`[Storage:DEBUG] Opening URL in new tab: ${publicUrl}`);
    window.open(publicUrl, '_blank');
    
    // Increment view counter
    console.log(`[Storage:DEBUG] Updating view counter for article ${articleId}`);
    try {
      await counterFunction(articleId, 'views');
      console.log(`[Storage:SUCCESS] View counter updated for article ${articleId}`);
    } catch (countError) {
      console.error(`[Storage:ERROR] Failed to update view counter:`, countError);
      // Don't fail the file opening if counter update fails
    }
    
    console.log(`[Storage:SUCCESS] File opened successfully in new tab: ${fileName}`);
    toast.success("Fichier ouvert dans un nouvel onglet");
  } catch (error) {
    console.error('[Storage:ERROR] Error opening file:', error);
    console.error(`Error details: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`Error stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
    toast.error("Erreur lors de l'ouverture du fichier");
  }
};

/**
 * Extract filename from a URL or path
 */
export const extractFilenameFromUrl = (url: string | undefined): string | undefined => {
  if (!url) {
    console.log(`[Storage:DEBUG] No URL provided to extract filename`);
    return undefined;
  }
  const filename = url.split('/').pop();
  console.log(`[Storage:DEBUG] Extracted filename from URL: ${filename}`);
  return filename;
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
  const filename = volumeIssueMap[key];
  
  if (!filename) {
    console.log(`[Storage:DEBUG] No cover image mapping found for volume:issue ${key}`);
  } else {
    console.log(`[Storage:DEBUG] Mapped ${key} to cover image: ${filename}`);
  }
  
  return filename;
};

/**
 * Debug function to check database table structure and data
 */
export const debugDatabaseTables = async (): Promise<void> => {
  try {
    console.log('[Database:DEBUG] Checking database tables and views structure');
    
    // Check the view definition
    const { data: viewInfo, error: viewError } = await supabase
      .rpc('get_view_definition', { view_name: 'rhca_articles_view' });
      
    if (viewError) {
      console.error('[Database:ERROR] Error fetching view definition:', viewError);
    } else {
      console.log('[Database:INFO] View definition:', viewInfo);
    }
    
    // Check direct table data
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, volume, issue, pdf_filename')
      .eq('source', 'RHCA')
      .limit(5);
      
    if (articlesError) {
      console.error('[Database:ERROR] Error fetching articles table data:', articlesError);
    } else {
      console.log('[Database:INFO] Sample articles table data:', articlesData);
    }
    
    // Check view data
    const { data: viewData, error: viewDataError } = await supabase
      .from('rhca_articles_view')
      .select('id, title, volume, issue, pdf_filename')
      .limit(5);
      
    if (viewDataError) {
      console.error('[Database:ERROR] Error fetching rhca_articles_view data:', viewDataError);
    } else {
      console.log('[Database:INFO] Sample rhca_articles_view data:', viewData);
    }
    
    toast.info('Database debug information logged to console');
  } catch (error) {
    console.error('[Database:ERROR] Exception during database debugging:', error);
    toast.error('Error debugging database information');
  }
};

// Add a function to directly update the database
export const updatePdfFilenames = async (): Promise<void> => {
  try {
    console.log('[Database:INFO] Attempting to update PDF filenames directly');
    
    const updates = [
      { volume: '2', issue: '47', filename: 'RHCA_vol_02_no_47_19_7_2024.pdf' },
      { volume: '3', issue: '48', filename: 'RHCA_vol_03_no_48_18_10_2024.pdf' },
      { volume: '4', issue: '49', filename: 'RHCA_vol_04_no_49_11_1_2025.pdf' }
    ];
    
    for (const update of updates) {
      const { error } = await supabase
        .from('articles')
        .update({ pdf_filename: update.filename })
        .eq('source', 'RHCA')
        .eq('volume', update.volume)
        .eq('issue', update.issue);
        
      if (error) {
        console.error(`[Database:ERROR] Error updating volume ${update.volume}, issue ${update.issue}:`, error);
        toast.error(`Failed to update PDF filename for volume ${update.volume}, issue ${update.issue}`);
      } else {
        console.log(`[Database:SUCCESS] Updated volume ${update.volume}, issue ${update.issue} with filename ${update.filename}`);
      }
    }
    
    toast.success('PDF filenames updated in database');
  } catch (error) {
    console.error('[Database:ERROR] Exception during PDF filename updates:', error);
    toast.error('Error updating PDF filenames');
  }
};
