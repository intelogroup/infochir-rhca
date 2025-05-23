
export interface Article {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  publicationDate: string;
  date?: string; // Legacy field
  source: string;
  pdfUrl?: string;
  imageUrl?: string;
  volume?: string;
  issue?: string;
  pageNumber?: string;
  specialty?: string;
  institution?: string;
  category?: string;
  tags: string[];
  views?: number;
  shares?: number;
  downloads?: number;
  citations?: number;
}
