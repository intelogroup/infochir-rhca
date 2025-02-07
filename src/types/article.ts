
export interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  category: string;
  tags: string[];
  shares?: number;  // Added shares as optional property
}

export type SortOption = "latest" | "title" | "author" | "category";
