export interface IgmArticle {
  id: string;
  title: string;
  authors: string[];
  pageNumber: number;
  abstract?: string;
  tags?: string[];
}

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
  articles: IgmArticle[];
}