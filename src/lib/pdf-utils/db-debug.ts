
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to debug database tables relevant to PDF processing
 */
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

    // Check if the rhca_volumes view or table exists
    try {
      const { data: rhcaVolumes, error: rhcaVolumesError } = await supabase
        .from('articles')
        .select('*')
        .eq('source', 'RHCA')
        .limit(5);
  
      if (rhcaVolumesError) {
        console.error('[PDFUtils] Error fetching RHCA volumes:', rhcaVolumesError);
      } else {
        console.log('[PDFUtils] RHCA volumes sample:', rhcaVolumes);
      }
    } catch (error) {
      console.error('[PDFUtils] Error accessing RHCA volumes:', error);
    }

    console.log('[PDFUtils] Database debug complete.');
  } catch (error) {
    console.error('[PDFUtils] Error during database debug:', error);
  }
};
