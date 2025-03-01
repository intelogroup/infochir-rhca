
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkFileExistsInBucket = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { search: filePath });

    if (error) {
      console.error(`[Storage:ERROR] Error checking file existence in ${bucketName}:`, error);
      return false;
    }

    const fileExists = data.some(file => file.name === filePath);
    return fileExists;
  } catch (err) {
    console.error(`[Storage:ERROR] Error checking file existence in ${bucketName}:`, err);
    return false;
  }
};

export const getFilePublicUrl = (bucketName: string, filePath: string): string | null => {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error(`[Storage:ERROR] Error getting public URL for ${filePath} in ${bucketName}:`, err);
    return null;
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
      console.error('Error fetching RHCA articles:', rhcaArticlesError);
    } else {
      console.log('RHCA articles:', rhcaArticles);
    }

    // Fetch rhca_articles_view
    const { data: rhcaArticlesView, error: rhcaArticlesViewError } = await supabase
      .from('rhca_articles_view')
      .select('*');

    if (rhcaArticlesViewError) {
      console.error('Error fetching rhca_articles_view:', rhcaArticlesViewError);
    } else {
      console.log('rhca_articles_view:', rhcaArticlesView);
    }
  } catch (err) {
    console.error('Error debugging database tables:', err);
  }
};

export const updatePdfFilenames = async () => {
  try {
    // Fetch all articles from articles table with RHCA source
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, volume, issue')
      .eq('source', 'RHCA');

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      toast.error('Error fetching articles for filename update.');
      return;
    }

    if (!articles) {
      console.log('No articles found to update.');
      toast.info('No articles found to update.');
      return;
    }

    // Iterate through each article and update the pdf_filename
    for (const article of articles) {
      if (article.volume && article.issue) {
        const pdfFileName = `RHCA_vol_${String(article.volume).padStart(2, '0')}_no_${String(article.issue).padStart(2, '0')}.pdf`;

        // Update the article in the database
        const { error: updateError } = await supabase
          .from('articles')
          .update({ pdf_filename: pdfFileName })
          .eq('id', article.id);

        if (updateError) {
          console.error(`Error updating article ${article.id}:`, updateError);
          toast.error(`Error updating PDF filename for article ${article.id}.`);
        } else {
          console.log(`Updated PDF filename for article ${article.id} to ${pdfFileName}`);
        }
      } else {
        console.warn(`Skipping article ${article.id} due to missing volume or issue.`);
      }
    }

    toast.success('PDF filenames updated successfully!');
  } catch (err) {
    console.error('Error updating PDF filenames:', err);
    toast.error('Error updating PDF filenames.');
  }
};

export const mapToCoverImageFileName = async (volume: string, issue: string): Promise<string | null> => {
  try {
    // Use Supabase query for the articles view
    const { data, error } = await supabase
      .from('rhca_articles_view')
      .select('cover_image_filename')
      .eq('volume', volume)
      .eq('issue', issue)
      .maybeSingle();
      
    if (error) {
      console.error('[Storage:ERROR] Error getting cover image filename:', error);
      return null;
    }
    
    if (data && data.cover_image_filename) {
      return data.cover_image_filename;
    }
    
    // Fallback name generation logic
    return `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`;
  } catch (err) {
    console.error('[Storage:ERROR] Error mapping to cover image filename:', err);
    return null;
  }
};

// Add the missing functions needed by ArticleActions.tsx

export const openFileInNewTab = async (
  bucketName: string, 
  filePath: string, 
  articleId: string,
  incrementCounterFn?: (id: string, countType: 'views' | 'downloads') => Promise<void>
): Promise<void> => {
  try {
    console.log(`[PDFUtils:INFO] Opening file ${filePath} from bucket ${bucketName} in new tab`);
    
    // Get the public URL for the file
    const publicUrl = getFilePublicUrl(bucketName, filePath);
    
    if (!publicUrl) {
      throw new Error(`Failed to get public URL for ${filePath}`);
    }
    
    // Open the file in a new tab
    window.open(publicUrl, '_blank');
    
    // Increment the view count if a counter function is provided
    if (incrementCounterFn) {
      await incrementCounterFn(articleId, 'views');
    }
    
    toast.success('PDF ouvert dans un nouvel onglet');
  } catch (err) {
    console.error(`[PDFUtils:ERROR] Error opening file in new tab:`, err);
    toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
};

export const downloadFileFromStorage = async (
  bucketName: string, 
  filePath: string, 
  articleId: string,
  incrementCounterFn?: (id: string, countType: 'views' | 'downloads') => Promise<void>
): Promise<void> => {
  try {
    console.log(`[PDFUtils:INFO] Downloading file ${filePath} from bucket ${bucketName}`);
    
    // Get the file download URL (signed URL for better security)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 60);
    
    if (error || !data) {
      throw error || new Error('Failed to create signed URL');
    }
    
    // Fetch the file using the signed URL
    const response = await fetch(data.signedUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the file as a blob
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create an invisible link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath; // Use the filename from the path
    
    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the blob URL
    window.URL.revokeObjectURL(url);
    
    // Increment the download count if a counter function is provided
    if (incrementCounterFn) {
      await incrementCounterFn(articleId, 'downloads');
    }
    
    toast.success('Téléchargement réussi');
  } catch (err) {
    console.error(`[PDFUtils:ERROR] Error downloading file:`, err);
    toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
};
