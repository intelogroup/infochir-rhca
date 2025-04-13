
/**
 * Type for download statistics
 */
export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Document type statistics
 */
export interface DocumentTypeStats {
  [key: string]: number;
}
