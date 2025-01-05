export interface RhcaArticle {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationDate?: string;
  pdfUrl?: string;
  imageUrl?: string;
  views?: number;
  downloads?: number;
  shares?: number;
}