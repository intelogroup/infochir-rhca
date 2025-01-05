export interface RhcaArticle {
  id: string;
  title: string;
  authors: string[];
  pageNumber: number;
  section: string;
  abstract?: string;
  pdfUrl?: string;
}

export interface RhcaIssue {
  id: string;
  title: string;
  volume: string;
  issueNumber: string;
  date: string;
  articles: RhcaArticle[];
}