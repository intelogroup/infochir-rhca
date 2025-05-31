
export interface Article {
  id?: string;
  title: string;
  abstract: string;
  publication_type?: "RHCA" | "IGM" | "ADC" | "INDEX";
  source?: string;
  article_files?: string[];
  image_url?: string;
  status?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  authors?: string[];
  tags?: string[];
  institution?: string;
  keywords?: string[];
  volume?: string;
  issue?: string;
  page_number?: string;
  specialty?: string;
  primary_author?: string;
  co_authors?: string[];
  author_affiliations?: string[];
  pdf_url?: string;
  pdf_filename?: string;
  cover_image_filename?: string;
  publication_date?: string;
  views?: number;
  downloads?: number;
  shares?: number;
  citations?: number;
  supplementary_files?: string[];
  funding_source?: string;
  doi?: string;
  user_id?: string;
}

export interface ArticleFormData {
  title: string;
  abstract: string;
  publicationType: "RHCA" | "IGM" | "ADC" | "INDEX";
  authors: string[];
  category: string;
  tags: string[];
  institution: string;
  keywords: string[];
  volume: string;
  issue: string;
  pageNumber: string;
  specialty: string;
  primaryAuthor: string;
  coAuthors: string[];
  authorAffiliations: string[];
  fundingSource: string;
  doi: string;
}
