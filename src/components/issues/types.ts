export interface Issue {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract: string;
  description?: string;  // Added this field and made it optional with ?
  pdfUrl?: string;
  coverImage?: string;
  articleCount?: number;
  views?: number;  // Added this field as optional since it's used in IssuesTable
}