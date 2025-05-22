
import { checkFileExists } from './storage';
import { trackDownload } from './track-downloads';
import { DocumentType } from './statistics/types';

export { checkFileExists } from './storage';

/**
 * Download a PDF file and track the download
 */
export const downloadPDF = async ({
  url,
  fileName,
  documentId,
  documentType = DocumentType.Article,
  trackingEnabled = true
}: {
  url: string;
  fileName: string;
  documentId: string;
  documentType?: DocumentType;
  trackingEnabled?: boolean;
}): Promise<boolean> => {
  try {
    // Determine if this is a Supabase storage URL or external URL
    const isSupabaseURL = url.includes('supabase') || 
                          url.includes('llxzstqejdrplmxdjxlu') ||
                          !url.startsWith('http');
    
    let actualUrl = url;
    
    // Handle different storage buckets based on document type
    if (isSupabaseURL) {
      const bucketMap: Record<DocumentType, string> = {
        [DocumentType.Article]: 'article-pdfs',
        [DocumentType.RHCA]: 'rhca-pdfs',
        [DocumentType.IGM]: 'article-pdfs',
        [DocumentType.ADC]: 'article-pdfs',
        [DocumentType.INDEX]: 'indexmedicus_pdfs',
      };
      
      const bucket = bucketMap[documentType] || 'article-pdfs';
      const fileNameFromUrl = url.split('/').pop() || fileName;
      
      // For Supabase URLs, we might need to reconstruct the URL to ensure it works
      if (!url.includes('storage/v1/object/public')) {
        actualUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/${bucket}/${fileNameFromUrl}`;
      }
    }
    
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = actualUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track the download if tracking is enabled
    if (trackingEnabled) {
      await trackDownload({
        status: 'success',
        documentId,
        documentType,
        fileName
      });
    }
    
    return true;
  } catch (error) {
    console.error('[downloadPDF] Error:', error);
    
    if (trackingEnabled) {
      await trackDownload({
        status: 'failed',
        documentId,
        documentType,
        fileName,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    return false;
  }
};
