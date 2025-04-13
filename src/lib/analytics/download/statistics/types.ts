
/**
 * Types of documents that can be downloaded
 */
export enum DocumentType {
  Article = 'article',
  RHCA = 'rhca',
  IGM = 'igm',
  ADC = 'adc',
  IndexMedicus = 'index-medicus'
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
 * Overall download statistics
 */
export interface OverallDownloadStats {
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  documentTypesStats: Record<string, number>;
}
