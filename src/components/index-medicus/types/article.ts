
export type ArticleSource = "RHCA" | "IGM" | "ADC";

export interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  publicationDate: Date;
  category: string;
  source: ArticleSource;
  abstract: string;
  tags: string[];
  imageUrl?: string;
  views?: number;
  citations?: number;
  pdfUrl?: string;
  downloads?: number;
  shares?: number;
  status?: string;
  institution?: string;
  userId?: string;
  volume?: string;
  issue?: string;
  pageNumber?: string;
  specialty?: string;
  articleType?: ArticleSource;
}

export interface DatabaseArticle {
  id: string;
  title: string;
  authors: string[];
  author_names?: string[];
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
  status?: string;
  institution?: string;
  user_id?: string;
  volume?: string;
  issue?: string;
  page_number?: string;
  specialty?: string;
  article_type?: string;
}
