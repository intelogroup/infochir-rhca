
export interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  category: string;
  tags: string[];
  shares?: number;
  downloads?: number;
  date?: Date;
  source?: string;
  pdfUrl?: string;
  imageUrl?: string;
  coverImage?: string; // Added this field to fix ArticleModal error
}

export type SortOption = "latest" | "title" | "author" | "category";

