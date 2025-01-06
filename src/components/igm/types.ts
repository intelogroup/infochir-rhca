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
  date: string; // ISO date string
  abstract: string;
  description?: string;
  pdfUrl?: string;
  coverImage?: string;
  articleCount: number;
  downloads: number;
  shares: number;
  articles: IgmArticle[];
}

export interface DatabaseIssue extends Omit<Issue, 'date'> {
  date: Date | string;
}

// Utility function to ensure proper date handling
export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Convert database issue to frontend issue with proper date handling
export const mapDatabaseIssueToIssue = (dbIssue: DatabaseIssue): Issue => {
  let dateString: string;

  if (dbIssue.date instanceof Date) {
    dateString = dbIssue.date.toISOString();
  } else {
    // Try to parse the string date
    const parsedDate = new Date(dbIssue.date);
    if (isValidDate(parsedDate)) {
      dateString = parsedDate.toISOString();
    } else {
      console.error(`Invalid date format for issue ${dbIssue.id}`);
      // Fallback to current date if invalid
      dateString = new Date().toISOString();
    }
  }

  return {
    ...dbIssue,
    date: dateString,
    downloads: dbIssue.downloads || 0,
    shares: dbIssue.shares || 0,
  };
};

// Format date for display with proper validation
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