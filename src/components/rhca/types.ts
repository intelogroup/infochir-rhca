export type { SortOption, SortOptionType } from "@/types/sortOptions";

export interface RhcaArticle {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  views: number;
  citations: number;
  downloads: number;
  shares: number;
  pageNumber: number;
  volume: number;
  pdfUrl: string;
  tags: string[];
}

export interface RhcaVolume {
  id: string;
  volume: number;
  date: string;
  description?: string;
  coverImage?: string;
  articleCount: number;
  downloadCount?: number;
  shareCount?: number;
  articles: RhcaArticle[];
}