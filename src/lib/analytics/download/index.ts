
// Export main download function
export { downloadPDF } from './download-file';

// Export tracking functionality
export { trackDownload } from './track-downloads';
export type { DownloadEvent } from './track-downloads';

// Export storage utilities
export { 
  checkFileExists, 
  getDownloadCount, 
  getTotalDownloadCount,
  getDownloadCountByType
} from './storage-utils';

// Export statistics utilities
export {
  getDownloadStatsByType,
  getDocumentDownloadStats,
  getDailyDownloadStats,
  getOverallDownloadStats
} from './statistics';
