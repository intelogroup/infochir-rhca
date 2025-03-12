
import { downloadPDF } from './download-file';
import { checkDownloadEventsConnection } from './storage/check-connection';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('TestDownloadTracking');

/**
 * Tests the download tracking system end-to-end
 * This function is for testing and debugging purposes only
 */
export const testDownloadTracking = async (): Promise<boolean> => {
  logger.log('Starting E2E test of download tracking system');
  
  // 1. Check if the download_events table is accessible and get current count
  const initialConnection = await checkDownloadEventsConnection();
  const initialCount = initialConnection.count;
  
  if (!initialConnection.connected) {
    logger.error('Cannot connect to download_events table, test failed');
    return false;
  }
  
  logger.log(`Initial download events count: ${initialCount}`);
  
  // 2. Attempt to download a test file
  const testFileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  
  try {
    // 3. Track a test download
    const downloadSuccess = await downloadPDF({
      url: testFileUrl,
      fileName: 'test-download.pdf',
      documentId: 'test-document-id',
      documentType: 'test',
      trackingEnabled: true
    });
    
    if (!downloadSuccess) {
      logger.error('Download failed');
      return false;
    }
    
    // 4. Wait a moment for the tracking to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. Check if a new event was recorded
    const finalConnection = await checkDownloadEventsConnection();
    const finalCount = finalConnection.count;
    
    logger.log(`Final download events count: ${finalCount}`);
    
    const success = finalCount > initialCount;
    
    if (success) {
      logger.log('Download tracking test passed successfully!');
    } else {
      logger.error('Download tracking test failed: No new event recorded');
    }
    
    return success;
  } catch (error) {
    logger.error('Error during download tracking test:', error);
    return false;
  }
};
