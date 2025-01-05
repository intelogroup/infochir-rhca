export type SortOption = "latest" | "year" | "downloads" | "shares";

export type SortOptionType = {
  value: SortOption;
  label: string;
};

export interface RhcaArticle {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  views?: number;
  citations?: number;
  downloads?: number;
  pageNumber: number;
  volume: number;
  pdfUrl?: string;
  tags?: string[];
}

export interface RhcaVolume {
  id: string;
  volume: string;
  date: string;
  description?: string;
  coverImage?: string;
  articleCount: number;
  downloadCount?: number;
  shareCount?: number;
  articles: RhcaArticle[];
}