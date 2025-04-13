
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { trackDownload } from "./track-downloads";
import { DocumentType } from "./statistics/types";

const logger = createLogger('DownloadTracking');

/**
 * Runs a test download event to verify that tracking is working properly
 * @returns boolean indicating success or failure
 */
export const testDownloadTracking = async (): Promise<boolean> => {
  try {
    logger.log('Running test download event tracking...');
    
    const testId = crypto.randomUUID();
    const testFilename = `test-file-${Date.now()}.pdf`;
    
    // First track a download event
    const trackingResult = await trackDownload({
      document_id: testId,
      document_type: 'test',
      file_name: testFilename,
      status: 'success'
    });
    
    if (!trackingResult) {
      logger.error('Test download tracking failed at trackDownload step');
      return false;
    }
    
    // Now verify the event was recorded by querying the database
    const { data, error } = await supabase
      .from('download_events')
      .select('*')
      .eq('document_id', testId)
      .eq('file_name', testFilename)
      .limit(1);
      
    if (error) {
      logger.error('Error verifying test download event:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      logger.error('Test download event was not found in database');
      return false;
    }
    
    logger.log('Test download tracking successful! Event record:', data[0]);
    return true;
  } catch (error) {
    logger.error('Exception during test download tracking:', error);
    return false;
  }
};

/**
 * Utility to verify download statistics by document type
 */
export const verifyDownloadStatsForType = async (
  documentType: DocumentType
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('download_stats_monitoring')
      .select('*')
      .eq('document_type', documentType)
      .eq('status', 'success')
      .limit(1);
      
    if (error) {
      logger.error(`Error verifying stats for ${documentType}:`, error);
      return false;
    }
    
    if (!data || data.length === 0) {
      logger.warn(`No download statistics found for ${documentType}`);
      return false;
    }
    
    logger.log(`Download statistics for ${documentType}:`, data[0]);
    return true;
  } catch (error) {
    logger.error(`Exception verifying stats for ${documentType}:`, error);
    return false;
  }
};

/**
 * Comprehensive function to verify the download tracking system
 */
export const verifyTrackingSystem = async (): Promise<{
  isWorking: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // 1. Check connection to Supabase
    const connectionCheck = await supabase.from('download_events').select('id').limit(1);
    
    if (connectionCheck.error) {
      return {
        isWorking: false,
        message: "Impossible de se connecter à la base de données",
        details: connectionCheck.error
      };
    }
    
    // 2. Run a test download event
    const testResult = await testDownloadTracking();
    
    if (!testResult) {
      return {
        isWorking: false,
        message: "Le suivi des téléchargements ne fonctionne pas correctement",
        details: "Le test d'enregistrement a échoué"
      };
    }
    
    // 3. Verify download stats are being updated
    const statsCheck = await supabase.from('download_stats_monitoring').select('*').limit(1);
    
    if (statsCheck.error) {
      return {
        isWorking: false,
        message: "Problème d'accès aux statistiques de téléchargement",
        details: statsCheck.error
      };
    }
    
    return {
      isWorking: true,
      message: "Le système de suivi des téléchargements fonctionne correctement",
      details: {
        eventsCount: connectionCheck.data?.length || 0,
        statsCount: statsCheck.data?.length || 0,
        testPassed: testResult
      }
    };
  } catch (error) {
    return {
      isWorking: false,
      message: "Une erreur est survenue lors de la vérification du système",
      details: error
    };
  }
};
