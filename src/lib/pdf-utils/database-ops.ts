
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates PDF filenames in the database based on volume and issue
 */
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

/**
 * Updates cover image filenames in the database based on volume and issue
 */
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
