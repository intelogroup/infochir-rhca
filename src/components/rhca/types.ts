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
  pageNumber: number;
  volume: string | number;
  date: string;
  tags?: string[];
}

export interface RhcaVolume {
  id: string;
  volume: number;
  date: string;
  description?: string;
  articleCount: number;
  downloadCount?: number;
  shareCount?: number;
  coverImage?: string;
  articles: RhcaArticle[];
}