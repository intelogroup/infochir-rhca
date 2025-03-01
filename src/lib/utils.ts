
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
 * Formats a date to the new file naming convention: DD_MM_YYYY
 */
export function formatDateForFilename(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}_${month}_${year}`;
}

/**
 * Formats a date with the RHCA cover image naming convention: RHCA_vol_XX_no_XX_DD_MM_YYYY.png
 */
export function formatRHCACoverImageFilename(volume: string, issue: string, date: Date): string {
  const paddedVolume = String(volume).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `RHCA_vol_${paddedVolume}_no_${issue}_${day}_${month}_${year}.png`;
}

/**
 * Extracts volume and issue numbers from RHCA filename
 * Supports both old format: RHCA_vol_2_no_48_31-10-24.pdf
 * And new format: RHCA_vol_04_no_49_14_1_2025.pdf
 */
export function extractVolumeInfoFromFilename(filename: string): { volume: string; issue: string } | null {
  // Match both old and new pattern: RHCA_vol_X_no_Y
  const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)/);
  
  if (match && match.length >= 3) {
    return {
      volume: match[1],
      issue: match[2]
    };
  }
  
  return null;
}
