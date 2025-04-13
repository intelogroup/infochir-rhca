
import { createLogger } from "@/lib/error-logger";
import { trackDownload } from "@/lib/analytics/track";

const logger = createLogger('TestDownloadTracking');

/**
 * Test the download tracking system by sending a test event
 */
export const testDownloadTracking = async (): Promise<boolean> => {
  try {
    logger.log('Testing download tracking...');
    
    // Generate a random id for the test document
    const testId = crypto.randomUUID();
    
    // Track a test download
    const success = await trackDownload(
      testId,
      'test',
      'test-file.pdf',
      true
    );
    
    if (!success) {
      logger.error('Failed to track test download');
      return false;
    }
    
    logger.log('Test download tracked successfully');
    return true;
  } catch (error) {
    logger.error('Exception testing download tracking:', error);
    return false;
  }
};
