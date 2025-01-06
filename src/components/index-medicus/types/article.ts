export type ArticleSource = "RHCA" | "IGM" | "ADC";

export interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  category: string;
  source: ArticleSource;
  abstract: string;
  tags: string[];
  imageUrl?: string;
  views?: number;
  citations?: number;
  pdfUrl?: string;
  downloads?: number;
}

export interface DatabaseArticle {
  id: string;
  title: string;
  authors: string[];
  publication_date: string;
  category: string;
  source: string;
  abstract: string;
  tags: string[] | null;
  image_url: string | null;
  views: number | null;
  citations: number | null;
  pdf_url: string | null;
  downloads: number | null;
  created_at: string | null;
  updated_at: string | null;
}