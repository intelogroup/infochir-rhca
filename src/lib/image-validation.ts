import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ImageValidation');

export interface ImageValidationResult {
  isValid: boolean;
  url: string;
  error?: string;
}

/**
 * Validates if an image URL exists and is accessible
 */
export const validateImageUrl = async (url: string): Promise<ImageValidationResult> => {
  if (!url) {
    return { isValid: false, url, error: 'No URL provided' };
  }

  try {
    // Use HEAD request to check if image exists without downloading it
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors'
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        logger.log(`[validateImageUrl] Valid image found: ${url}`);
        return { isValid: true, url };
      } else {
        logger.warn(`[validateImageUrl] URL exists but not an image: ${url}, content-type: ${contentType}`);
        return { isValid: false, url, error: 'Not an image file' };
      }
    } else {
      logger.warn(`[validateImageUrl] Image not found: ${url}, status: ${response.status}`);
      return { isValid: false, url, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    logger.error(`[validateImageUrl] Error validating image: ${url}`, error);
    return { isValid: false, url, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Generates alternative URLs for atlas images by trying different naming patterns
 */
export const generateAtlasImageAlternatives = (filename: string): string[] => {
  if (!filename) return [];

  const baseUrl = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public';
  const cleanFilename = filename.replace(/^.*[\\/]/, '').trim();
  
  const alternatives = [
    // Try atlas_covers bucket
    `${baseUrl}/atlas_covers/${cleanFilename}`,
    // Try with different extensions
    `${baseUrl}/atlas_covers/${cleanFilename.replace(/\.[^.]+$/, '.jpg')}`,
    `${baseUrl}/atlas_covers/${cleanFilename.replace(/\.[^.]+$/, '.png')}`,
    `${baseUrl}/atlas_covers/${cleanFilename.replace(/\.[^.]+$/, '.webp')}`,
    // Try article_covers bucket as fallback
    `${baseUrl}/article_covers/${cleanFilename}`,
    // Try with lowercase filename
    `${baseUrl}/atlas_covers/${cleanFilename.toLowerCase()}`,
    // Try without special characters
    `${baseUrl}/atlas_covers/${cleanFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
  ];

  return [...new Set(alternatives)]; // Remove duplicates
};

/**
 * Finds the first working image URL from a list of alternatives
 */
export const findWorkingImageUrl = async (alternatives: string[]): Promise<string | null> => {
  for (const url of alternatives) {
    const result = await validateImageUrl(url);
    if (result.isValid) {
      return url;
    }
  }
  return null;
};