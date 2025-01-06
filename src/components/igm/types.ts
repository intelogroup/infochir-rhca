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
}

export interface DatabaseIssue extends Omit<Issue, 'date'> {
  date: Date | string;
}

export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const mapDatabaseIssueToIssue = (dbIssue: DatabaseIssue): Issue => {
  let dateString: string;

  if (dbIssue.date instanceof Date) {
    dateString = dbIssue.date.toISOString();
  } else {
    const parsedDate = new Date(dbIssue.date);
    if (isValidDate(parsedDate)) {
      dateString = parsedDate.toISOString();
    } else {
      console.error(`Invalid date format for issue ${dbIssue.id}`);
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