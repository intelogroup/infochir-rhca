export interface RhcaArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  date: string;
  pageNumber: number;
  pdfUrl?: string;
  coverImage?: string;
  views?: number;
  citations?: number;
  downloads?: number;
  tags: string[];
}

export interface RhcaIssue {
  id: string;
  title: string;
  volume: string;
  issueNumber: string;
  date: string;
  description?: string;
  articles: RhcaArticle[];
}