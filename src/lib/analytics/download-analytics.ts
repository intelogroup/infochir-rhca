
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DownloadEvent {
  documentId: string;
  documentType: 'igm' | 'rhca' | 'article' | 'other';
  fileName: string;
  status: 'success' | 'failed';
  errorDetails?: string;
}

/**
 * Tracks document download events
 */
export const trackDownload = async (event: DownloadEvent): Promise<boolean> => {
  console.log(`[Analytics] Tracking download event:`, event);
  
  try {
    // First increment the download count in the database
    if (event.status === 'success') {
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'downloads',
        row_id: event.documentId
      });
      
      console.log(`[Analytics] Incremented download count for ${event.documentId}`);
    }
    
    // Log download event for analytics purposes
    const { error } = await supabase
      .from('download_events')
      .insert({
        document_id: event.documentId,
        document_type: event.documentType,
        file_name: event.fileName,
        status: event.status,
        error_details: event.errorDetails || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        screen_size: `${window.innerWidth}x${window.innerHeight}`
      });
      
    if (error) {
      console.error('[Analytics] Error logging download event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Analytics] Unexpected error tracking download:', error);
    return false;
  }
};

/**
 * Enhanced PDF download function with proper error handling, analytics and user feedback
 */
export const downloadPDF = async ({
  url,
  fileName,
  documentId,
  documentType = 'other',
  trackingEnabled = true
}: {
  url: string;
  fileName: string;
  documentId: string;
  documentType?: DownloadEvent['documentType'];
  trackingEnabled?: boolean;
}): Promise<boolean> => {
  console.log(`[PDF Download] Starting download for: ${fileName}`);
  
  try {
    // Show loading toast
    const toastId = toast.loading(`Préparation du téléchargement...`);
    
    // Validate URL
    if (!url) {
      toast.error("Le fichier PDF n'est pas disponible", {
        id: toastId,
        description: "Impossible de télécharger ce document."
      });
      
      if (trackingEnabled) {
        await trackDownload({
          documentId,
          documentType,
          fileName,
          status: 'failed',
          errorDetails: 'Missing URL'
        });
      }
      
      return false;
    }
    
    // Try to fetch the file
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      console.error(`[PDF Download] ${errorMessage}`);
      
      toast.error("Échec du téléchargement", {
        id: toastId,
        description: `Impossible d'accéder au fichier (${response.status})`
      });
      
      if (trackingEnabled) {
        await trackDownload({
          documentId,
          documentType,
          fileName,
          status: 'failed',
          errorDetails: errorMessage
        });
      }
      
      return false;
    }
    
    // Get the file content
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    // Show success toast
    toast.success("Téléchargement réussi", {
      id: toastId,
      description: fileName
    });
    
    // Track successful download
    if (trackingEnabled) {
      await trackDownload({
        documentId,
        documentType,
        fileName,
        status: 'success'
      });
    }
    
    return true;
  } catch (error) {
    console.error('[PDF Download] Error:', error);
    
    toast.error("Échec du téléchargement", {
      description: "Une erreur inattendue est survenue"
    });
    
    if (trackingEnabled) {
      await trackDownload({
        documentId,
        documentType,
        fileName,
        status: 'failed',
        errorDetails: error instanceof Error ? error.message : String(error)
      });
    }
    
    return false;
  }
};

/**
 * Utility to check if a file exists in Supabase storage
 */
export const checkFileExists = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    console.log(`[Storage] Checking if file exists: ${bucketName}/${filePath}`);
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // Try a HEAD request to check if file exists
    const response = await fetch(data.publicUrl, { 
      method: 'HEAD',
      cache: 'no-store' 
    });
    
    const exists = response.ok;
    console.log(`[Storage] File ${filePath} exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`[Storage] Error checking if file exists:`, error);
    return false;
  }
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = async (): Promise<{
  totalFiles: number;
  totalSize: number;
  bucketStats: Record<string, { files: number; size: number }>;
} | null> => {
  try {
    // Get list of buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      throw bucketsError;
    }
    
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      bucketStats: {} as Record<string, { files: number; size: number }>
    };
    
    // Get stats for each bucket
    for (const bucket of buckets) {
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucket.name)
        .list();
        
      if (filesError) {
        console.error(`[Storage] Error listing files in bucket ${bucket.name}:`, filesError);
        continue;
      }
      
      const bucketSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      
      stats.totalFiles += files.length;
      stats.totalSize += bucketSize;
      stats.bucketStats[bucket.name] = {
        files: files.length,
        size: bucketSize
      };
    }
    
    console.log(`[Storage] Stats:`, stats);
    return stats;
  } catch (error) {
    console.error(`[Storage] Error getting storage stats:`, error);
    return null;
  }
};
