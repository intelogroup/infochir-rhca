
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { trackDownload } from "./track-downloads";
import { DocumentType } from "./statistics/types";

const logger = createLogger('DownloadTestTrack');

/**
 * Test the download tracking system
 */
export const verifyTrackingSystem = async () => {
  try {
    const testDocId = '00000000-0000-0000-0000-000000000000';
    const testFileName = `test-download-${Date.now()}.pdf`;
    
    // 1. Test direct download tracking
    logger.log('Testing direct download tracking...');
    
    const trackingResult = await trackDownload({
      document_id: testDocId,
      document_type: DocumentType.Test,
      file_name: testFileName,
      status: 'success'
    });
    
    if (!trackingResult) {
      return {
        isWorking: false,
        message: "Échec de l'enregistrement du téléchargement via la fonction trackDownload",
        details: "La fonction n'a pas retourné un succès"
      };
    }
    
    // 2. Verify the event was recorded in the database
    logger.log('Verifying download event in database...');
    
    const { data, error } = await supabase
      .from('download_events')
      .select('*')
      .eq('document_id', testDocId)
      .eq('file_name', testFileName)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error || !data || data.length === 0) {
      return {
        isWorking: false,
        message: "L'événement a été enregistré mais n'est pas visible dans la base de données",
        details: error ? error.message : "Aucune données trouvée"
      };
    }
    
    // 3. Check download monitoring table for updates
    logger.log('Checking download stats monitoring...');
    
    const { data: statsData, error: statsError } = await supabase
      .from('download_stats_monitoring')
      .select('*')
      .eq('document_type', DocumentType.Test)
      .eq('status', 'success')
      .single();
      
    if (statsError) {
      logger.error('Error checking stats monitoring:', statsError);
      return {
        isWorking: false,
        message: "Le téléchargement est enregistré, mais les statistiques ne sont pas mises à jour",
        details: statsError.message
      };
    }
    
    // 4. Check overall stats for the test downloads
    logger.log('Checking overall download stats...');
    
    const { data: overallData, error: overallError } = await supabase
      .from('overall_download_stats_view')
      .select('*')
      .single();
      
    if (overallError) {
      logger.error('Error checking overall stats:', overallError);
      return {
        isWorking: true,
        message: "Le système fonctionne mais la vue des statistiques globales a rencontré une erreur",
        details: overallError.message
      };
    }
    
    return {
      isWorking: true,
      message: "Le système de suivi des téléchargements fonctionne correctement",
      details: {
        eventLog: data[0],
        statsMonitoring: statsData,
        overallStats: overallData
      }
    };
  } catch (error) {
    logger.error('Exception in verifyTrackingSystem:', error);
    return {
      isWorking: false,
      message: "Une erreur s'est produite lors de la vérification du système",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Create a test download event
 */
export const testDownloadTracking = async (): Promise<boolean> => {
  try {
    const testDocId = '00000000-0000-0000-0000-000000000001';
    const testFileName = `test-download-${Date.now()}.pdf`;
    
    // Insert a test event directly (bypassing the tracking function)
    const { error } = await supabase
      .from('download_events')
      .insert({
        document_id: testDocId,
        document_type: DocumentType.Test,
        file_name: testFileName,
        status: 'success',
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`
      });
    
    if (error) {
      logger.error('Error inserting test download event:', error);
      return false;
    }
    
    logger.log('Test download event created successfully');
    return true;
  } catch (error) {
    logger.error('Exception creating test download event:', error);
    return false;
  }
};
