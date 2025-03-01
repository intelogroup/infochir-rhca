
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
    
    // Check if cover_image_filename exists in the data
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
