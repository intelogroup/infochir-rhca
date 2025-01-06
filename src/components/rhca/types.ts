export interface RhcaArticle {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationDate: string;
  specialty: string;
  category?: string;
  pdfUrl?: string;
  volume: string;
  pageNumber: string;
}