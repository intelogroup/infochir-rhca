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
  citations?: number;
  pageNumber: number;
  volume: string | number;
  date: string;
  tags?: string[];
}

export interface RhcaVolume {
  id: string;
  title?: string;  // Added title property as optional
  volume: number;
  date: string;
  description?: string;
  articleCount: number;
  downloadCount?: number;
  shareCount?: number;
  coverImage?: string;
  articles: RhcaArticle[];
}