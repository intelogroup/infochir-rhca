import { supabase } from "@/integrations/supabase/client";

export const checkFileExistsInBucket = async (bucketName: string, fileName: string) => {
  try {
    console.log(`[PDFUtils] Checking if ${fileName} exists in ${bucketName}`);
    
    // Get public URL but don't throw if file doesn't exist
    const { data, error } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    if (error) {
      console.error(`[PDFUtils] Error checking file ${fileName} in ${bucketName}:`, error);
      return false;
    }
    
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

export const debugDatabaseTables = async () => {
  try {
    console.log('[PDFUtils] Starting database debug...');

    // Debugging articles table
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*');

    if (articlesError) {
      console.error('[PDFUtils] Error fetching articles:', articlesError);
    } else {
      console.log('[PDFUtils] Articles table:', articles);
    }

    // Debugging rhca_volumes table
    const { data: rhcaVolumes, error: rhcaVolumesError } = await supabase
      .from('rhca_volumes')
      .select('*');

    if (rhcaVolumesError) {
      console.error('[PDFUtils] Error fetching rhca_volumes:', rhcaVolumesError);
    } else {
      console.log('[PDFUtils] rhca_volumes table:', rhcaVolumes);
    }

    console.log('[PDFUtils] Database debug complete.');
  } catch (error) {
    console.error('[PDFUtils] Error during database debug:', error);
  }
};

export const updatePdfFilenames = async () => {
  try {
    console.log('[PDFUtils] Starting PDF filename update...');

    // Fetch all articles with volume and issue
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, volume, issue')
      .not('volume', 'is', null)
      .not('issue', 'is', null);

    if (articlesError) {
      console.error('[PDFUtils] Error fetching articles:', articlesError);
      return;
    }

    console.log(`[PDFUtils] Found ${articles.length} articles to update`);

    // Update each article with the corresponding PDF filename
    for (const article of articles) {
      if (article.volume && article.issue) {
        const pdfFileName = `RHCA_vol_${String(article.volume).padStart(2, '0')}_no_${article.issue}.pdf`;

        const { data: updateData, error: updateError } = await supabase
          .from('articles')
          .update({ pdf_filename: pdfFileName })
          .eq('id', article.id);

        if (updateError) {
          console.error(`[PDFUtils] Error updating article ${article.id}:`, updateError);
        } else {
          console.log(`[PDFUtils] Updated article ${article.id} with pdf_filename: ${pdfFileName}`);
        }
      }
    }

    console.log('[PDFUtils] PDF filename update complete.');
  } catch (error) {
    console.error('[PDFUtils] Error during PDF filename update:', error);
  }
};

export const updateCoverImageFilenames = async () => {
  try {
    console.log('[PDFUtils] Starting cover image filename update...');

    // Fetch all articles with volume and issue
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, volume, issue')
      .not('volume', 'is', null)
      .not('issue', 'is', null);

    if (articlesError) {
      console.error('[PDFUtils] Error fetching articles:', articlesError);
      return;
    }

    console.log(`[PDFUtils] Found ${articles.length} articles to update`);

    // Update each article with the corresponding cover image filename
    for (const article of articles) {
      if (article.volume && article.issue) {
        const coverImageFileName = `RHCA_vol_${String(article.volume).padStart(2, '0')}_no_${article.issue}_cover.png`;

        const { data: updateData, error: updateError } = await supabase
          .from('articles')
          .update({ cover_image_filename: coverImageFileName })
          .eq('id', article.id);

        if (updateError) {
          console.error(`[PDFUtils] Error updating article ${article.id}:`, updateError);
        } else {
          console.log(`[PDFUtils] Updated article ${article.id} with cover_image_filename: ${coverImageFileName}`);
        }
      }
    }

    console.log('[PDFUtils] Cover image filename update complete.');
  } catch (error) {
    console.error('[PDFUtils] Error during cover image filename update:', error);
  }
};

export const mapToCoverImageFileName = (volume: string, issue: string) => {
  try {
    const paddedVolume = String(volume).padStart(2, '0');
    const paddedIssue = String(issue).padStart(2, '0');
    return `RHCA_vol_${paddedVolume}_no_${paddedIssue}_cover.png`;
  } catch (error) {
    console.error('[PDFUtils] Error generating cover image filename:', error);
    return '';
  }
};
