
/**
 * Format a date to DD-MM-YY format for filenames
 */
export function formatDateToSimple(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  return `${day}-${month}-${year}`;
}

/**
 * Extracts volume and issue numbers from RHCA filename
 * Example: RHCA_vol_2_no_48_31-10-24.pdf -> { volume: '2', issue: '48' }
 */
export function extractVolumeInfoFromFilename(filename: string): { volume: string; issue: string } | null {
  // Match the pattern RHCA_vol_X_no_Y
  const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)/);
  
  if (match && match.length >= 3) {
    return {
      volume: match[1],
      issue: match[2]
    };
  }
  
  return null;
}
