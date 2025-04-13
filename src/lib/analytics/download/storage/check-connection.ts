
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('downloadStats');

export const subscribeToDownloadStats = (callback: () => void) => {
  logger.log('Setting up download stats subscription');
  
  // Subscribe to changes in the download_events table
  const channel = supabase
    .channel('download-events')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'download_events',
      },
      () => {
        logger.log('Download event detected, triggering callback');
        callback();
      }
    )
    .subscribe();
  
  // Return an unsubscribe function
  return () => {
    logger.log('Unsubscribing from download stats');
    supabase.removeChannel(channel);
  };
};

export const getDownloadStatistics = async () => {
  try {
    // Query our view to get download statistics
    const { data, error } = await supabase
      .from('overall_download_stats_view')
      .select('*')
      .single();
    
    if (error) {
      logger.error('Error fetching download statistics:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getDownloadStatistics:', error);
    return { total_downloads: 0 };
  }
};

export const checkDownloadEventsConnection = async () => {
  try {
    // Check connection to download_events table
    const { data, error, count } = await supabase
      .from('download_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      logger.error('Error checking download events connection:', error);
      return {
        connected: false,
        count: 0,
        recentEvents: [],
        error: error.message
      };
    }
    
    return {
      connected: true,
      count: count || 0,
      recentEvents: data || []
    };
  } catch (error) {
    logger.error('Exception checking download events connection:', error);
    return {
      connected: false,
      count: 0,
      recentEvents: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export const getDownloadTypeStats = async () => {
  try {
    // Get download stats by document type
    const { data, error } = await supabase
      .from('document_type_download_stats')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Convert to more usable format
    const documentTypes = data.map(item => ({
      type: item.document_type || 'unknown',
      count: item.total_downloads || 0,
      successful: item.successful_downloads || 0,
      failed: item.failed_downloads || 0
    }));
    
    return {
      documentTypes,
      error: null
    };
  } catch (error) {
    logger.error('Error fetching download type stats:', error);
    return {
      documentTypes: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export const verifyTrackingSystem = async () => {
  try {
    // Basic checks to verify the tracking system
    const { data: tableExists } = await supabase
      .rpc('check_table_exists', { table_name: 'download_events' });
    
    const connectionStatus = await checkDownloadEventsConnection();
    
    if (!tableExists) {
      return {
        isWorking: false,
        message: "La table de suivi des téléchargements n'existe pas",
        details: { tableExists }
      };
    }
    
    if (!connectionStatus.connected) {
      return {
        isWorking: false,
        message: "Connexion à la table de suivi impossible",
        details: connectionStatus
      };
    }
    
    // All checks passed
    return {
      isWorking: true,
      message: "Le système de suivi fonctionne correctement",
      details: {
        tableExists,
        connectionStatus
      }
    };
  } catch (error) {
    logger.error('Error verifying tracking system:', error);
    return {
      isWorking: false,
      message: `Erreur lors de la vérification: ${error instanceof Error ? error.message : String(error)}`,
      details: { error }
    };
  }
};
