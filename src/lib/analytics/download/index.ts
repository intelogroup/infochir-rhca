
// Export main download function
export { downloadPDF } from './download-file';

// Export tracking functionality
export { trackDownload } from './track-downloads';
export type { DownloadEvent } from './track-downloads';

// Export storage utilities (updated path)
export { 
  checkFileExists, 
  getDownloadCount, 
  getTotalDownloadCount,
  getDownloadCountByType,
  getDownloadStatistics
} from './storage';

// Export statistics utilities (updated path)
export {
  getDownloadStatsByType,
  getDocumentDownloadStats,
  getDailyDownloadStats,
  getOverallDownloadStats,
  subscribeToDownloadStats,
  type TypeStats,
  type DocumentTypeStats
} from './statistics';
