
/**
 * Type statistics interface
 */
export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Document type statistics interface
 */
export interface DocumentTypeStats {
  [key: string]: number;
}

/**
 * Overall download statistics interface
 */
export interface OverallDownloadStats {
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
  document_types_stats: DocumentTypeStats;
}

/**
 * Daily download statistics interface
 */
export interface DailyDownloadStat {
  date: string;
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
}

/**
 * Document type enum for consistent type handling
 */
export enum DocumentType {
  IGM = 'igm',
  RHCA = 'rhca',
  Article = 'article',
  IndexMedicus = 'index-medicus',
  ADC = 'adc',
  Other = 'other',
  Test = 'test'
}
