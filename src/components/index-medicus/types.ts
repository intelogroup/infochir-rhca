export interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  category: string;
  source: "RHCA" | "IGM" | "ADC";
  abstract: string;
  tags: string[];
  imageUrl?: string;
  views?: number;
  citations?: number;
  pdfUrl?: string;
  downloads?: number;
}

export interface SearchFilters {
  searchTerm: string;
  category: string;
  source: string;
  tags: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}