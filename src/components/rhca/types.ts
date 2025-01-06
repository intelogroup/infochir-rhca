export interface RhcaArticle {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationDate: string;
  specialty: string;
  category?: string;
  volume: string;
  pageNumber: string;
  date: string;
  views?: string;
  downloads?: string;
  shares?: string;
  citations?: string;
  tags?: string[];
  imageUrl?: string;
  pdfUrl?: string;
}

export interface RhcaVolume {
  id: string;
  volume: number;
  date: string;
  description: string;
  articleCount: number;
  downloadCount: number;
  shareCount: number;
  articles: RhcaArticle[];
  coverImage?: string;
}