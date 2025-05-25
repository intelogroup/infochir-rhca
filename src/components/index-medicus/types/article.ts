
export type ArticleSource = "RHCA" | "IGM" | "ADC" | "INDEX";

export interface Article {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  publicationDate: string;
  date?: string; // Legacy field
  source: ArticleSource;
  pdfUrl?: string;
  pdf_url?: string; // Legacy field for backwards compatibility
  pdf_filename?: string; // Add missing property
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
  status?: "published" | "pending" | "draft";
}

// Add the missing mapping function
export const mapDatabaseArticleToArticle = (dbArticle: any): Article => {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    abstract: dbArticle.abstract,
    authors: Array.isArray(dbArticle.authors) ? dbArticle.authors : [],
    publicationDate: dbArticle.publication_date,
    date: dbArticle.date || dbArticle.publication_date,
    source: dbArticle.source as ArticleSource,
    pdfUrl: dbArticle.pdf_url,
    pdf_url: dbArticle.pdf_url, // Keep legacy field
    pdf_filename: dbArticle.pdf_filename,
    imageUrl: dbArticle.image_url,
    volume: dbArticle.volume,
    issue: dbArticle.issue,
    pageNumber: dbArticle.page_number,
    specialty: dbArticle.specialty,
    institution: dbArticle.institution,
    category: dbArticle.category,
    tags: Array.isArray(dbArticle.tags) ? dbArticle.tags : [],
    views: dbArticle.views || 0,
    shares: dbArticle.shares || 0,
    downloads: dbArticle.downloads || 0,
    citations: dbArticle.citations || 0,
    status: dbArticle.status || "published"
  };
};
