
export type SortOption = "latest" | "year" | "downloads" | "shares";

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
  downloads?: number;
  shares?: number;
  pdfUrl?: string;
  coverImage?: string;
  articles?: IssueArticle[];
  categories?: string[];
  pageCount?: number;
}

export interface IssueArticle {
  id: string;
  title: string;
  authors: string[];
  pageNumber?: string;
  abstract?: string;
  tags?: string[];
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

// Helper function to check if a date is valid
export function isValidDate(d: any): boolean {
  // First check - is it a Date object?
  if (!(d instanceof Date)) {
    console.warn("Not a Date object:", d);
    return false;
  }
  
  // Second check - is it a valid date (not NaN)?
  if (isNaN(d.getTime())) {
    console.warn("Invalid Date (NaN):", d);
    return false;
  }
  
  // Third check - is it a reasonable year? (between 1900 and current year + 1)
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear + 1) {
    console.warn(`Unusual year (${year}) outside of expected range:`, d);
    // We'll still return true here, just warning
  }
  
  return true;
}
