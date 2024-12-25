export type ArticleSource = "RHCA" | "IGM" | "ATLAS" | "ADC";

export interface Article {
  id: string;
  title: string;
  abstract: string;
  date: string;
  volume?: string;
  issue_number?: number;
  article_count?: number;
  source: ArticleSource;
  pdf_url: string | null;
  image_url?: string | null;
  views?: number;
  citations?: number;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleWithRelations extends Article {
  category?: {
    name: string;
  };
  article_authors?: {
    author: {
      name: string;
    };
  }[];
  article_tags?: {
    tag: {
      name: string;
    };
  }[];
}