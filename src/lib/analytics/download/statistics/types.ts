
/**
 * Types of documents that can be downloaded
 */
export enum DocumentType {
  Article = 'article',
  RHCA = 'rhca',
  IGM = 'igm',
  ADC = 'adc',
  IndexMedicus = 'index-medicus',
  Test = 'test' // Adding Test type for testing purposes
}

/**
 * Interface for download statistics by document type
 */
export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Interface for document types statistics
 */
export interface DocumentTypeStats {
  [key: string]: number;
}

/**
 * Document download stats
 */
export interface DocumentDownloadStats {
  documentId: string;
  documentType: DocumentType;
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  lastDownloadTime?: string;
}

/**
 * Daily download statistics
 */
export interface DailyDownloadStats {
  date: string;
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
}

/**
 * Single day download stat (for API responses)
 */
export interface DailyDownloadStat {
  date: string;
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
}

/**
 * Overall download statistics
 */
export interface OverallDownloadStats {
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  documentTypesStats: Record<string, number>;
}
