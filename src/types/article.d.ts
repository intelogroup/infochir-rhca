
export interface Article {
  id?: string;
  title: string;
  abstract: string;
  publication_type?: "RHCA" | "IGM" | "ADC";
  source?: string;
  article_files?: string[];
  image_url?: string;
  status?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleFormData {
  title: string;
  abstract: string;
  publicationType: "RHCA" | "IGM" | "ADC";
}
