
export interface Issue {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract: string;
  description?: string;
  articleCount?: number;
  downloadCount?: number;
  shareCount?: number;
  pdfUrl?: string;
  coverImage?: string;
}

export interface IssuesState {
  searchTerm: string;
  selectedYear: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'table';
}

export interface FilterOptions {
  years: string[];
  searchTerm: string;
  selectedYear: string | null;
}
