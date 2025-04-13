
/**
 * Type of document being downloaded
 */
export enum DocumentType {
  Article = "article",
  IGM = "igm",
  RHCA = "rhca",
  ADC = "adc",
  IndexMedicus = "index-medicus",
  Test = "test"
}

/**
 * Stats for a document type
 */
export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Stats by document type (key is document type, value is stats)
 */
export interface DocumentTypeStats {
  [key: string]: number;
}

/**
 * Overall download statistics
 */
export interface OverallDownloadStats {
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
  document_types_stats: DocumentTypeStats;
}

/**
 * Daily download statistics
 */
export interface DailyDownloadStat {
  date: string;
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
}
