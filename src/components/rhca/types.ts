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
  downloads?: number;
  tags?: string[];
  volume: string;
}

export interface RhcaVolume {
  id: string;
  volume: string;
  date: string;
  description?: string;
  coverImage?: string;
  articleCount: number;
  articles: RhcaArticle[];
}