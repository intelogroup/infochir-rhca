
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if a PDF file exists in Supabase storage
 * @param pdfUrl The URL or filename of the PDF
 * @returns A promise that resolves to a boolean indicating if the file exists
 */
export const verifyPdfExists = async (pdfUrl?: string): Promise<boolean> => {
  if (!pdfUrl) {
    return false;
  }

  try {
    // Determine which bucket and filename to check
    let bucketName = 'rhca-pdfs'; // Default bucket
    let fileName = '';

    if (pdfUrl.includes('rhca-pdfs')) {
      bucketName = 'rhca-pdfs';
      fileName = pdfUrl.split('/').pop() || '';
    } else if (pdfUrl.includes('article-pdfs')) {
      bucketName = 'article-pdfs';
      fileName = pdfUrl.split('/').pop() || '';
    } else if (!pdfUrl.startsWith('http')) {
      // If it's just a filename without a path
      fileName = pdfUrl;
    } else {
      // External URL - try a HEAD request
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        return response.ok;
      } catch {
        return false;
      }
    }

    if (!fileName) {
      return false;
    }

    // Check if file exists in the bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        search: fileName
      });

    if (error) {
      console.error('Error checking file existence:', error);
      return false;
    }

    return data && data.some(file => file.name === fileName);
  } catch (err) {
    console.error('Failed to verify PDF existence:', err);
    return false;
  }
};

/**
 * Gets the download URL for a PDF file
 * @param pdfFileName The filename of the PDF
 * @param bucket The bucket name where the PDF is stored
 * @returns A promise that resolves to the download URL
 */
export const getPdfDownloadUrl = async (pdfFileName: string, bucket: string = 'rhca-pdfs'): Promise<string | null> => {
  try {
    // First verify if the file exists
    const fileExists = await verifyPdfExists(pdfFileName);
    
    if (!fileExists) {
      throw new Error(`File does not exist: ${pdfFileName}`);
    }
    
    // Try to get a signed URL with 10-minute expiration
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(pdfFileName, 600);
      
    if (error) {
      console.error('Error getting signed URL:', error);
      
      // Fallback to public URL
      const { data: publicUrlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(pdfFileName);
        
      return publicUrlData?.publicUrl || null;
    }
    
    return data.signedUrl;
  } catch (err) {
    console.error('Failed to get PDF download URL:', err);
    return null;
  }
};

/**
 * Downloads a PDF file and saves it to the user's device
 * @param pdfUrl The URL or filename of the PDF
 * @param fileName The name to save the file as
 * @returns A promise that resolves when the download is complete
 */
export const downloadPdf = async (pdfUrl: string, fileName: string): Promise<void> => {
  let downloadUrl = pdfUrl;
  
  // If it's just a filename, get the download URL
  if (!pdfUrl.startsWith('http')) {
    const bucketName = pdfUrl.includes('-') ? 
      (pdfUrl.startsWith('RHCA') ? 'rhca-pdfs' : 'article-pdfs') : 
      'rhca-pdfs';
      
    const url = await getPdfDownloadUrl(pdfUrl, bucketName);
    if (!url) {
      throw new Error(`Could not get download URL for ${pdfUrl}`);
    }
    downloadUrl = url;
  }
  
  // Download the file
  const response = await fetch(downloadUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const blob = await response.blob();
  
  // Create URL and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
