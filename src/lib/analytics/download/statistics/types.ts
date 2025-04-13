
/**
 * Types for download statistics
 */

export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

export interface DocumentTypeStats {
  [key: string]: number;
}

export interface OverallDownloadStats {
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
  document_types_stats: DocumentTypeStats;
}

export interface DailyDownloadStat {
  date: string;
  total_downloads: number;
  successful_downloads: number;
  failed_downloads: number;
}

export interface DocumentStats {
  document_id: string;
  document_type: string;
  downloads: number;
  last_download: string;
}
