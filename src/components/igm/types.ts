
import { DateRange } from "react-day-picker";

export interface IgmArticle {
  id: string;
  title: string;
  authors: string[];
  pageNumber: number;
  abstract?: string;
  tags?: string[];
}

export interface Issue {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract: string;
  pdfUrl?: string;
  coverImage?: string;
  articleCount: number;
  downloads: number;
  shares: number;
  articles: IgmArticle[];
  categories?: string[];
}

export interface DatabaseIssue {
  id: string;
  title: string;
  publication_date: Date | string;
  abstract: string;
  volume: string;
  issue: string;
  cover_image: string | null;
  article_count: number;
  downloads: number;
  shares: number;
  articles: any[];
  category?: string;
}

export interface IssuesStateOptions {
  searchTerm: string;
  sortBy: SortOption;
  dateRange?: DateRange;
  selectedCategories?: string[];
}

export type SortOption = "latest" | "year" | "downloads" | "shares";

export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const mapDatabaseIssueToIssue = (dbIssue: DatabaseIssue): Issue => {
  let dateString: string;

  if (dbIssue.publication_date instanceof Date) {
    dateString = dbIssue.publication_date.toISOString();
  } else {
    const parsedDate = new Date(dbIssue.publication_date);
    if (isValidDate(parsedDate)) {
      dateString = parsedDate.toISOString();
    } else {
      console.error(`Invalid date format for issue ${dbIssue.id}`);
      dateString = new Date().toISOString();
    }
  }

  return {
    id: dbIssue.id,
    title: dbIssue.title,
    volume: dbIssue.volume,
    issue: dbIssue.issue,
    date: dateString,
    abstract: dbIssue.abstract,
    coverImage: dbIssue.cover_image || undefined,
    articleCount: dbIssue.article_count,
    downloads: dbIssue.downloads,
    shares: dbIssue.shares,
    articles: dbIssue.articles.map(article => ({
      id: article.id,
      title: article.title,
      authors: article.authors,
      pageNumber: Number(article.pageNumber) || 0,
      abstract: article.abstract,
      tags: article.tags
    })),
    categories: dbIssue.category ? [dbIssue.category] : []
  };
};

export const formatIssueDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    console.error('Invalid date provided to formatIssueDate');
    return 'Date invalide';
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });
};
