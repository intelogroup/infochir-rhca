
/**
 * Generates a standardized RHCA filename based on volume and issue
 * @param originalName Original file name
 * @param volumeInfo Volume and issue information
 * @param bucket Target storage bucket
 * @param type File type (document or image)
 * @returns Formatted filename
 */
export const generateStandardizedFilename = (
  originalName: string,
  volumeInfo?: { volume: string; issue: string },
  bucket?: string,
  type: 'document' | 'image' = 'document'
): string => {
  // If no volume info or not a relevant bucket, return the original name with timestamp
  if (!volumeInfo || (bucket !== 'rhca-pdfs' && 
                      bucket !== 'rhca_covers' &&
                      bucket !== 'indexmedicus_pdfs' &&
                      bucket !== 'indexmedicus_covers')) {
    return `${Date.now()}_${originalName}`;
  }

  const now = new Date();
  const fileExt = originalName.split('.').pop() || (type === 'document' ? 'pdf' : 'png');
  
  if (bucket.includes('covers')) {
    // For cover images: RHCA_vol_XX_no_XX_DD_MM_YYYY.png
    const paddedVolume = volumeInfo.volume.padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const prefix = bucket.includes('rhca') ? 'RHCA' : 'INDEX';
    return `${prefix}_vol_${paddedVolume}_no_${volumeInfo.issue}_${day}_${month}_${year}.${fileExt}`;
  } else {
    // For PDF documents
    const dateFormatted = formatDateForFilename(now);
    const paddedVolume = volumeInfo.volume.padStart(2, '0');
    
    const prefix = bucket.includes('rhca') ? 'RHCA' : 'INDEX';
    return `${prefix}_vol_${paddedVolume}_no_${volumeInfo.issue}_${dateFormatted}.${fileExt}`;
  }
};

/**
 * Formats a date for use in filenames
 */
export const formatDateForFilename = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  
  return `${day}-${month}-${year.slice(2)}`;
};

/**
 * Formats RHCA cover image filename
 */
export const formatRHCACoverImageFilename = (volume: string, issue: string): string => {
  const paddedVolume = String(volume).padStart(2, '0');
  const paddedIssue = String(issue).padStart(2, '0');
  return `RHCA_vol_${paddedVolume}_no_${paddedIssue}_cover.png`;
};

/**
 * Sanitizes filenames for storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^\x00-\x7F]/g, '_');
};
