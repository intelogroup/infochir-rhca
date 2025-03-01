
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkFileExistsInBucket = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    console.log(`[Storage:DEBUG] Checking if file exists in bucket: ${bucketName}, path: ${filePath}`);
    
    if (!filePath) {
      console.warn(`[Storage:WARN] Empty file path provided for bucket ${bucketName}`);
      return false;
    }
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { search: filePath });

    if (error) {
      console.error(`[Storage:ERROR] Error checking file existence in ${bucketName}:`, error);
      return false;
    }

    const fileExists = data.some(file => file.name === filePath);
    console.log(`[Storage:INFO] File ${filePath} exists in bucket ${bucketName}: ${fileExists}`);
    if (!fileExists) {
      console.warn(`[Storage:WARN] File ${filePath} not found in bucket ${bucketName}`);
    }
    
    return fileExists;
  } catch (err) {
    console.error(`[Storage:ERROR] Exception checking file existence in ${bucketName}:`, err);
    return false;
  }
};

export const getFilePublicUrl = (bucketName: string, filePath: string): string | null => {
  try {
    console.log(`[Storage:DEBUG] Getting public URL for file: ${filePath} in bucket: ${bucketName}`);
    
    if (!filePath) {
      console.warn(`[Storage:WARN] Empty file path provided for public URL in bucket ${bucketName}`);
      return null;
    }
    
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log(`[Storage:INFO] Public URL for ${filePath}: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (err) {
    console.error(`[Storage:ERROR] Error getting public URL for ${filePath} in ${bucketName}:`, err);
    return null;
  }
};

export const openFileInNewTab = async (bucketName: string, filePath: string): Promise<void> => {
  try {
    console.log(`[Storage:DEBUG] Opening file in new tab: ${filePath} from bucket: ${bucketName}`);
    
    if (!filePath) {
      console.warn('[Storage:WARN] No file path provided for opening in new tab');
      toast.error("File not available");
      return;
    }
    
    const publicUrl = getFilePublicUrl(bucketName, filePath);
    
    if (!publicUrl) {
      console.error(`[Storage:ERROR] Failed to get public URL for ${filePath}`);
      toast.error("Could not retrieve file URL");
      return;
    }
    
    window.open(publicUrl, '_blank');
    console.log(`[Storage:INFO] Successfully opened file in new tab: ${filePath}`);
    
  } catch (err) {
    console.error(`[Storage:ERROR] Error opening file in new tab:`, err);
    toast.error(`Error opening file: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const downloadFileFromStorage = async (bucketName: string, filePath: string): Promise<void> => {
  try {
    console.log(`[Storage:DEBUG] Downloading file: ${filePath} from bucket: ${bucketName}`);
    
    if (!filePath) {
      console.warn('[Storage:WARN] No file path provided for download');
      toast.error("File not available for download");
      return;
    }
    
    // Get the file download URL (signed URL for better security)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 60);
    
    if (error || !data) {
      console.error(`[Storage:ERROR] Failed to create signed URL for ${filePath}:`, error);
      toast.error(`Error creating download link: ${error?.message || 'Unknown error'}`);
      return;
    }
    
    console.log(`[Storage:INFO] Created signed URL for ${filePath}: ${data.signedUrl}`);
    
    // Fetch the file using the signed URL
    const response = await fetch(data.signedUrl);
    
    if (!response.ok) {
      console.error(`[Storage:ERROR] HTTP error downloading file: ${response.status} ${response.statusText}`);
      toast.error(`Download error: HTTP status ${response.status}`);
      return;
    }
    
    // Get the file as a blob
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create an invisible link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath.split('/').pop() || filePath; // Use the filename from the path
    
    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the blob URL
    window.URL.revokeObjectURL(url);
    
    console.log(`[Storage:SUCCESS] Successfully downloaded file: ${filePath}`);
    toast.success('Download successful');
    
  } catch (err) {
    console.error(`[Storage:ERROR] Error downloading file:`, err);
    toast.error(`Download error: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const debugDatabaseTables = async () => {
  try {
    // Fetch rhca_articles
    const { data: rhcaArticles, error: rhcaArticlesError } = await supabase
      .from('articles')
      .select('*')
      .eq('source', 'RHCA');

    if (rhcaArticlesError) {
      console.error('[DB:ERROR] Error fetching RHCA articles:', rhcaArticlesError);
    } else {
      console.log('[DB:INFO] RHCA articles:', rhcaArticles);
    }

    // Fetch rhca_articles_view
    const { data: rhcaArticlesView, error: rhcaArticlesViewError } = await supabase
      .from('rhca_articles_view')
      .select('*');

    if (rhcaArticlesViewError) {
      console.error('[DB:ERROR] Error fetching rhca_articles_view:', rhcaArticlesViewError);
    } else {
      console.log('[DB:INFO] rhca_articles_view:', rhcaArticlesView);
      
      // Log available columns
      if (rhcaArticlesView && rhcaArticlesView.length > 0) {
        console.log('[DB:DEBUG] Available columns in rhca_articles_view:', Object.keys(rhcaArticlesView[0]));
      } else {
        console.warn('[DB:WARN] No records found in rhca_articles_view to inspect columns');
      }
    }
  } catch (err) {
    console.error('[DB:ERROR] Error debugging database tables:', err);
  }
};

export const updatePdfFilenames = async () => {
  try {
    console.log('[DB:INFO] Starting PDF filename update process');
    
    // Fetch all articles from articles table with RHCA source
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, volume, issue')
      .eq('source', 'RHCA');

    if (articlesError) {
      console.error('[DB:ERROR] Error fetching articles for filename update:', articlesError);
      toast.error('Error fetching articles for filename update.');
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('[DB:INFO] No articles found to update filenames.');
      toast.info('No articles found to update.');
      return;
    }

    console.log(`[DB:INFO] Found ${articles.length} articles to update PDF filenames`);

    // Iterate through each article and update the pdf_filename
    for (const article of articles) {
      if (article.volume && article.issue) {
        const pdfFileName = `RHCA_vol_${String(article.volume).padStart(2, '0')}_no_${String(article.issue).padStart(2, '0')}.pdf`;
        console.log(`[DB:DEBUG] Updating article ${article.id} with PDF filename: ${pdfFileName}`);

        // Update the article in the database
        const { error: updateError } = await supabase
          .from('articles')
          .update({ pdf_filename: pdfFileName })
          .eq('id', article.id);

        if (updateError) {
          console.error(`[DB:ERROR] Error updating article ${article.id}:`, updateError);
          toast.error(`Error updating PDF filename for article ${article.id}.`);
        } else {
          console.log(`[DB:SUCCESS] Updated PDF filename for article ${article.id} to ${pdfFileName}`);
        }
      } else {
        console.warn(`[DB:WARN] Skipping article ${article.id} due to missing volume or issue.`);
      }
    }

    toast.success('PDF filenames updated successfully!');
  } catch (err) {
    console.error('[DB:ERROR] Exception updating PDF filenames:', err);
    toast.error('Error updating PDF filenames.');
  }
};

export const mapToCoverImageFileName = async (volume: string, issue: string): Promise<string | null> => {
  try {
    console.log(`[DB:DEBUG] Mapping cover image filename for volume:${volume}, issue:${issue}`);
    
    // First, try to get the specific cover_image_filename from the database
    const { data, error } = await supabase
      .from('rhca_articles_view')
      .select('*')
      .eq('volume', volume)
      .eq('issue', issue)
      .maybeSingle();
      
    if (error) {
      console.error('[DB:ERROR] Error getting cover image filename:', error);
      console.log('[DB:DEBUG] Available columns check:', data ? Object.keys(data) : 'No data');
      return null;
    }
    
    // Check if data exists and log all available fields for debugging
    if (data) {
      console.log('[DB:DEBUG] Data retrieved for cover image:', data);
      console.log('[DB:DEBUG] Available fields:', Object.keys(data));
      
      // Check for cover_image_filename field
      if ('cover_image_filename' in data && data.cover_image_filename) {
        console.log(`[DB:INFO] Found cover_image_filename in database: ${data.cover_image_filename}`);
        return data.cover_image_filename;
      } else {
        console.warn('[DB:WARN] cover_image_filename not found in data or is null');
      }
    } else {
      console.warn(`[DB:WARN] No data found for volume:${volume}, issue:${issue}`);
    }
    
    // Fallback name generation logic
    const fallbackName = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`;
    console.log(`[DB:INFO] Using fallback cover image filename: ${fallbackName}`);
    return fallbackName;
    
  } catch (err) {
    console.error('[DB:ERROR] Error mapping to cover image filename:', err);
    return null;
  }
};
