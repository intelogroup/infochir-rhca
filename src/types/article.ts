export interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  category: string;
  tags: string[];
}

export type SortOption = "latest" | "title" | "author" | "category";