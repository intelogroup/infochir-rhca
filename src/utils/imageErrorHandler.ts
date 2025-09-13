/**
 * Enhanced image error handling and fallback utility
 */

import { createLogger } from '@/lib/error-logger';

const logger = createLogger('ImageErrorHandler');

/**
 * Track failed images to avoid excessive retries
 */
const failedImages = new Set<string>();

/**
 * Check if an image has already failed multiple times
 */
export const hasImageFailed = (src: string): boolean => {
  return failedImages.has(src);
};

/**
 * Mark an image as failed
 */
export const markImageAsFailed = (src: string): void => {
  failedImages.add(src);
  logger.warn(`Marked image as failed: ${src}`);
};

/**
 * Clear failed image cache
 */
export const clearFailedImages = (): void => {
  failedImages.clear();
};

/**
 * Generate alternative URLs for missing atlas/RHCA images
 */
export const generateImageAlternatives = (src: string): string[] => {
  const alternatives: string[] = [];
  
  if (!src) return alternatives;

  // Extract bucket and filename
  const bucketMatch = src.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
  if (!bucketMatch) return alternatives;

  const [, bucket, filename] = bucketMatch;
  const baseUrl = src.substring(0, src.indexOf('/storage'));

  // For atlas covers, try different bucket variations
  if (bucket === 'atlas_covers') {
    alternatives.push(
      `${baseUrl}/storage/v1/object/public/article_covers/${filename}`,
      `${baseUrl}/storage/v1/object/public/atlas-covers/${filename}`,
      // Try different file extensions
      `${baseUrl}/storage/v1/object/public/atlas_covers/${filename.replace('.png', '.jpg')}`,
      `${baseUrl}/storage/v1/object/public/atlas_covers/${filename.replace('.png', '.webp')}`
    );
  }

  // For RHCA covers, try different bucket variations
  if (bucket === 'rhca_covers') {
    alternatives.push(
      `${baseUrl}/storage/v1/object/public/rhca-covers/${filename}`,
      `${baseUrl}/storage/v1/object/public/article_covers/${filename}`,
      // Try lowercase filename
      `${baseUrl}/storage/v1/object/public/rhca_covers/${filename.toLowerCase()}`
    );
  }

  return alternatives;
};