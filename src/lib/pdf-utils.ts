import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatRHCACoverImageFilename } from "@/lib/utils";

/**
 * Validates if a PDF filename follows the RHCA naming convention
 * Expected format: RHCA_vol_XX_no_YY.pdf or RHCA_vol_XX_no_YY_DD_MM_YYYY.pdf
 */
export const validateRHCAPdfFilename = (filename: string): boolean => {
  if (!filename) return false;
  
  // Check basic format with or without date
  const basicFormatRegex = /^RHCA_vol_\d+_no_\d+(_\d+_\d+_\d+)?\.pdf$/i;
  return basicFormatRegex.test(filename);
};

/**
 * Checks if a file exists in the specified Supabase storage bucket
 */
export const checkFileExistsInBucket = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    console.log(`[Storage:DEBUG] Checking if file exists in bucket: ${bucketName}, path: ${filePath}`);
    
    if (!filePath) {
      console.warn(`[Storage:WARN] Empty file path provided for bucket ${bucketName}`);
      return false;
    }
    
    // Validate RHCA PDF filename if it's a PDF in the rhca-pdfs bucket
    if (bucketName === 'rhca-pdfs' && filePath.toLowerCase().endsWith('.pdf')) {
      const isValid = validateRHCAPdfFilename(filePath);
      if (!isValid) {
        console.warn(`[Storage:WARN] Invalid RHCA PDF filename format: ${filePath}`);
        // We'll still try to look for the file, but log the warning
      }
    }
    
    // First attempt: direct download check (doesn't count as a download)
    const { data: headData, error: headError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 1);
      
    if (!headError && headData) {
      console.log(`[Storage:INFO] File ${filePath} exists in bucket ${bucketName} (verified via signed URL)`);
      return true;
    }
    
    // Alternative check: list files in the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { search: filePath });

    if (error) {
      console.error(`[Storage:ERROR] Error checking file existence in ${bucketName}:`, error);
      if (error.message.includes('Permission denied')) {
        console.warn(`[Storage:WARN] Permission denied when checking file existence. Check bucket policies.`);
      }
      return false;
    }

    const fileExists = data.some(file => file.name === filePath);
    console.log(`[Storage:INFO] File ${filePath} exists in bucket ${bucketName}: ${fileExists} (verified via list)`);
    
    if (!fileExists) {
      console.warn(`[Storage:WARN] File ${filePath} not found in bucket ${bucketName}`);
    }
    
    return fileExists;
  } catch (err) {
    console.error(`[Storage:ERROR] Exception checking file existence in ${bucketName}:`, err);
    return false;
  }
};

/**
 * Gets the public URL for a file in a Supabase storage bucket
 */
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

/**
 * Opens a file from Supabase storage in a new browser tab
 */
export const openFileInNewTab = async (bucketName: string, filePath: string): Promise<void> => {
  try {
    console.log(`[Storage:DEBUG] Opening file in new tab: ${filePath} from bucket: ${bucketName}`);
    
    if (!filePath) {
      console.warn('[Storage:WARN] No file path provided for opening in new tab');
      toast.error("Fichier non disponible", {
        description: "Aucun chemin de fichier fourni"
      });
      return;
    }
    
    // For RHCA PDFs, validate the filename format
    if (bucketName === 'rhca-pdfs' && filePath.toLowerCase().endsWith('.pdf')) {
      const isValid = validateRHCAPdfFilename(filePath);
      if (!isValid) {
        console.warn(`[Storage:WARN] Invalid RHCA PDF filename format: ${filePath}`);
        toast.warning("Format de nom de fichier non standard", {
          description: "Le fichier pourrait ne pas s'ouvrir correctement"
        });
      }
    }
    
    // Check if file exists before attempting to open
    const fileExists = await checkFileExistsInBucket(bucketName, filePath);
    
    if (!fileExists) {
      console.error(`[Storage:ERROR] File ${filePath} not found in bucket ${bucketName}`);
      toast.error("Fichier introuvable", {
        description: "Le fichier demandé n'existe pas dans la bibliothèque"
      });
      return;
    }
    
    const publicUrl = getFilePublicUrl(bucketName, filePath);
    
    if (!publicUrl) {
      console.error(`[Storage:ERROR] Failed to get public URL for ${filePath}`);
      toast.error("URL de fichier invalide", {
        description: "Impossible de récupérer l'URL du fichier"
      });
      return;
    }
    
    window.open(publicUrl, '_blank');
    console.log(`[Storage:INFO] Successfully opened file in new tab: ${filePath}`);
    
  } catch (err) {
    console.error(`[Storage:ERROR] Error opening file in new tab:`, err);
    toast.error(`Erreur d'ouverture du fichier`, {
      description: err instanceof Error ? err.message : String(err)
    });
  }
};

/**
 * Downloads a file from Supabase storage to the user's device
 */
export const downloadFileFromStorage = async (bucketName: string, filePath: string): Promise<void> => {
  try {
    console.log(`[Storage:DEBUG] Downloading file: ${filePath} from bucket: ${bucketName}`);
    
    if (!filePath) {
      console.warn('[Storage:WARN] No file path provided for download');
      toast.error("Téléchargement impossible", {
        description: "Aucun fichier spécifié"
      });
      return;
    }
    
    // For RHCA PDFs, validate the filename format
    if (bucketName === 'rhca-pdfs' && filePath.toLowerCase().endsWith('.pdf')) {
      const isValid = validateRHCAPdfFilename(filePath);
      if (!isValid) {
        console.warn(`[Storage:WARN] Invalid RHCA PDF filename format: ${filePath}`);
        toast.warning("Format de nom de fichier non standard", {
          description: "Le téléchargement pourrait échouer"
        });
      }
    }
    
    // Check if file exists before attempting download
    const fileExists = await checkFileExistsInBucket(bucketName, filePath);
    
    if (!fileExists) {
      console.error(`[Storage:ERROR] File ${filePath} not found in bucket ${bucketName}`);
      toast.error("Fichier introuvable", {
        description: "Le fichier demandé n'existe pas dans la bibliothèque"
      });
      return;
    }
    
    // Create a signed URL that expires in 60 seconds
    toast.loading("Préparation du téléchargement...");
    
    // Get the file download URL (signed URL for better security)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 60);
    
    if (error || !data) {
      console.error(`[Storage:ERROR] Failed to create signed URL for ${filePath}:`, error);
      toast.dismiss();
      toast.error(`Erreur de création du lien de téléchargement`, {
        description: error?.message || 'Erreur inconnue'
      });
      return;
    }
    
    console.log(`[Storage:INFO] Created signed URL for ${filePath}: ${data.signedUrl}`);
    
    // Fetch the file using the signed URL
    const response = await fetch(data.signedUrl);
    
    if (!response.ok) {
      console.error(`[Storage:ERROR] HTTP error downloading file: ${response.status} ${response.statusText}`);
      toast.dismiss();
      toast.error(`Erreur de téléchargement`, {
        description: `Erreur HTTP ${response.status}: ${response.statusText}`
      });
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
    toast.dismiss();
    toast.success('Téléchargement réussi', {
      description: `Le fichier ${filePath.split('/').pop()} a été téléchargé`
    });
    
    // Attempt to increment download count in the database (would be handled better server-side)
    try {
      if (bucketName === 'rhca-pdfs') {
        // This is a client-side approach, ideally this would be handled by a secure server function
        const { volume, issue } = extractVolumeAndIssueFromFilename(filePath);
        if (volume && issue) {
          console.log(`[Storage:INFO] Attempting to increment download count for RHCA vol ${volume} issue ${issue}`);
          
          // This approach has race conditions and should be implemented server-side
          // for demonstration purposes only
          const { error: updateError } = await supabase.rpc(
            'increment_count',
            { 
              table_name: 'articles',
              column_name: 'downloads',
              row_id: '00000000-0000-0000-0000-000000000000' // This is a placeholder, should be actual article ID
            }
          );
          
          if (updateError) {
            console.error('[Storage:ERROR] Error incrementing download count:', updateError);
          }
        }
      }
    } catch (countErr) {
      console.error('[Storage:ERROR] Error tracking download:', countErr);
      // Don't show this error to the user since the download was successful
    }
    
  } catch (err) {
    console.error(`[Storage:ERROR] Error downloading file:`, err);
    toast.dismiss();
    toast.error(`Erreur de téléchargement`, {
      description: err instanceof Error ? err.message : String(err)
    });
  }
};

/**
 * Extracts volume and issue numbers from an RHCA PDF filename
 */
export const extractVolumeAndIssueFromFilename = (filename: string): { volume: string | null; issue: string | null } => {
  if (!filename) {
    return { volume: null, issue: null };
  }
  
  // Match pattern: RHCA_vol_X_no_Y or RHCA_vol_XX_no_YY_DD_MM_YYYY.pdf
  const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)/i);
  
  if (match && match.length >= 3) {
    return {
      volume: match[1],
      issue: match[2]
    };
  }
  
  return { volume: null, issue: null };
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
    
    // First, try to get the specific pdf_filename from the database to extract info
    const { data, error } = await supabase
      .from('rhca_articles_view')
      .select('volume, issue, pdf_filename')
      .eq('volume', volume)
      .eq('issue', issue)
      .maybeSingle();
      
    if (error) {
      console.error('[DB:ERROR] Error getting article info:', error);
      return null;
    }
    
    // Generate a standard filename using the current date
    const now = new Date();
    const fallbackName = formatRHCACoverImageFilename(volume, issue, now);
    console.log(`[DB:INFO] Using fallback cover image filename: ${fallbackName}`);
    return fallbackName;
    
  } catch (err) {
    console.error('[DB:ERROR] Error mapping to cover image filename:', err);
    return null;
  }
};

// Add a new function to update cover image filenames
export const updateCoverImageFilenames = async () => {
  try {
    console.log('[DB:INFO] Starting cover image filename update process');
    
    // Fetch all articles from articles table with RHCA source
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, volume, issue')
      .eq('source', 'RHCA');

    if (articlesError) {
      console.error('[DB:ERROR] Error fetching articles for cover image filename update:', articlesError);
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('[DB:INFO] No articles found to update cover image filenames.');
      return;
    }

    console.log(`[DB:INFO] Found ${articles.length} articles to update cover image filenames`);

    // Iterate through each article and update the cover_image_filename
    for (const article of articles) {
      if (article.volume && article.issue) {
        // Get the current date to use in the filename
        const now = new Date();
        const coverImageFileName = formatRHCACoverImageFilename(article.volume, article.issue, now);
        console.log(`[DB:DEBUG] Updating article ${article.id} with cover image filename: ${coverImageFileName}`);

        // Update the article in the database with the cover_image_filename
        const { error: updateError } = await supabase
          .from('articles')
          .update({ cover_image_filename: coverImageFileName })
          .eq('id', article.id);

        if (updateError) {
          console.error(`[DB:ERROR] Error updating article ${article.id} cover image:`, updateError);
        } else {
          console.log(`[DB:SUCCESS] Updated cover image filename for article ${article.id} to ${coverImageFileName}`);
        }
      } else {
        console.warn(`[DB:WARN] Skipping article ${article.id} due to missing volume or issue.`);
      }
    }

    console.log('[DB:SUCCESS] Cover image filenames updated successfully!');
    toast.success('Cover image filenames updated successfully!');
  } catch (err) {
    console.error('[DB:ERROR] Exception updating cover image filenames:', err);
    toast.error('Error updating cover image filenames.');
  }
};
