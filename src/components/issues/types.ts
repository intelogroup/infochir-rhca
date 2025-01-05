export type SortOption = "latest" | "year" | "downloads" | "shares";

export type SortOptionType = {
  value: SortOption;
  label: string;
};

export interface Issue {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract: string;
  description?: string;
  pdfUrl?: string;
  coverImage?: string;
  articleCount: number;
  downloads?: number;
  shares?: number;
  articles: {
    id: string;
    title: string;
    authors: string[];
    pageNumber: number;
    abstract?: string;
    tags?: string[];
  }[];
}