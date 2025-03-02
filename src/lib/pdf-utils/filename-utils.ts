
/**
 * Maps volume and issue to a cover image filename
 */
export const mapToCoverImageFileName = (volume: string, issue: string) => {
  try {
    const paddedVolume = String(volume).padStart(2, '0');
    const paddedIssue = String(issue).padStart(2, '0');
    return `RHCA_vol_${paddedVolume}_no_${paddedIssue}_cover.png`;
  } catch (error) {
    console.error('[PDFUtils] Error generating cover image filename:', error);
    return '';
  }
};

/**
 * Extracts volume and issue numbers from RHCA filename
 * Supports both old format: RHCA_vol_2_no_48_31-10-24.pdf
 * And new format: RHCA_vol_04_no_49_14_1_2025.pdf
 */
export const extractVolumeInfoFromFilename = (filename: string) => {
  try {
    // Match both old and new pattern: RHCA_vol_X_no_Y
    const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)/);
    
    if (match && match.length >= 3) {
      return {
        volume: match[1],
        issue: match[2]
      };
    }
    
    return null;
  } catch (error) {
    console.error('[PDFUtils] Error extracting volume info from filename:', error);
    return null;
  }
};
