
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
        [DocumentType.INDEX]: 'indexmedicuspdf',
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
    
    // Enhanced desktop download logic with blob handling
    try {
      // Fetch the file as a blob for better desktop handling
      const response = await fetch(actualUrl);
      if (!response.ok) {
        throw new Error(`File not accessible: ${response.status}`);
      }
      
      // Get the file as a blob with proper MIME type
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || 'application/pdf';
      
      // Create a proper blob with PDF MIME type
      const pdfBlob = new Blob([blob], { type: contentType });
      
      // Create object URL for the blob
      const objectUrl = URL.createObjectURL(pdfBlob);
      
      // Create download link with proper attributes for desktop saving
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName; // This forces download instead of opening in browser
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
      
      console.log('Desktop download triggered successfully for:', fileName);
      
    } catch (fetchError) {
      console.warn('Blob download failed, falling back to direct link method:', fetchError);
      
      // Fallback to direct link method
      const link = document.createElement('a');
      link.href = actualUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Force download attribute for desktop
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
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
