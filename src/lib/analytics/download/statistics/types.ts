
/**
 * Interface for download statistics by document type
 */
export interface TypeStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Interface for document types statistics returned by our function
 */
export interface DocumentTypeStats {
  [key: string]: number;
}
