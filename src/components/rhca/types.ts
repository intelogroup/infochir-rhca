export interface RhcaArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  date: string;
  pageNumber: number;
  pdfUrl?: string;
  views?: number;
  citations?: number;
  tags?: string[];
}