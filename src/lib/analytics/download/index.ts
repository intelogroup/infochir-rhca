
import { checkFileExists } from './storage';
import { trackDownload } from './track-downloads';
import { DocumentType } from './statistics/types';

export { checkFileExists } from './storage';
export { trackDownload } from './track-downloads';

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
    console.log('downloadPDF called with:', { url, fileName, documentId, documentType });
    
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
        [DocumentType.IGM]: 'igm-pdfs',
        [DocumentType.ADC]: 'article-pdfs',
        [DocumentType.INDEX]: 'indexmedicuspdf', // Use the correct bucket for INDEX
        [DocumentType.Test]: 'article-pdfs'
      };
      
      const bucket = bucketMap[documentType] || 'article-pdfs';
      const fileNameFromUrl = url.split('/').pop() || fileName;
      
      // For Supabase URLs, ensure proper format
      if (!url.includes('storage/v1/object/public')) {
        actualUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/${bucket}/${fileNameFromUrl}`;
      }
    }
    
    console.log('Final download URL:', actualUrl);
    
    // Try to fetch the file first to check if it exists
    const response = await fetch(actualUrl, { method: 'HEAD' });
    if (!response.ok) {
      console.error('File not accessible:', response.status, response.statusText);
      throw new Error(`File not accessible: ${response.status}`);
    }
    
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = actualUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Download triggered successfully');
    
    // Track the download if tracking is enabled
    if (trackingEnabled) {
      await trackDownload({
        document_id: documentId,
        document_type: documentType,
        file_name: fileName,
        status: 'success'
      });
    }
    
    return true;
  } catch (error) {
    console.error('[downloadPDF] Error:', error);
    
    if (trackingEnabled) {
      await trackDownload({
        document_id: documentId,
        document_type: documentType,
        file_name: fileName,
        status: 'failed',
        error_details: error instanceof Error ? error.message : String(error)
      });
    }
    
    return false;
  }
};
