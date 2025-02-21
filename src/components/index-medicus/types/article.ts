
export type ArticleSource = "RHCA" | "IGM" | "ADC" | "INDEX";

export interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  publicationDate: string;
  category?: string;
  specialty?: string;
  source: ArticleSource;
  abstract: string;
  content?: string;
  tags: string[];
  imageUrl?: string;
  coverImage?: string;
  views?: number;
  citations?: number;
  pdfUrl?: string;
  downloads?: number;
  shares?: number;
  status?: "published" | "pending" | "draft";
  institution?: string;
  userId?: string;
  volume?: string;
  issue?: string;
  pageNumber?: string;
  articleType?: ArticleSource;
  lastUpdate?: string;
}

export interface DatabaseArticle {
  id: string;
  title: string;
  authors: string[];
  author_names?: string[];
  publication_date: string;
  category?: string;
  specialty?: string;
  source: string;
  abstract: string;
  content?: string;
  tags: string[] | null;
  image_url: string | null;
  cover_image: string | null;
  views: number | null;
  citations: number | null;
  pdf_url: string | null;
  downloads: number | null;
  shares: number | null;
  created_at?: string;
  updated_at?: string;
  status?: string;
  institution?: string;
  user_id?: string;
  volume?: string;
  issue?: string;
  page_number?: string;
  article_type?: string;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  articleCount: number;
  lastUpdate?: string;
  articles: Article[];
}

// Helper function to map database article to frontend article
export const mapDatabaseArticleToArticle = (dbArticle: DatabaseArticle): Article => {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    authors: dbArticle.authors || dbArticle.author_names || [],
    date: dbArticle.created_at || dbArticle.publication_date,
    publicationDate: dbArticle.publication_date,
    category: dbArticle.category,
    specialty: dbArticle.specialty,
    source: dbArticle.source as ArticleSource,
    abstract: dbArticle.abstract,
    content: dbArticle.content,
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    coverImage: dbArticle.cover_image || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: dbArticle.pdf_url || undefined,
    downloads: dbArticle.downloads || 0,
    shares: dbArticle.shares || 0,
    status: dbArticle.status as "published" | "pending" | "draft" | undefined,
    institution: dbArticle.institution,
    userId: dbArticle.user_id,
    volume: dbArticle.volume,
    issue: dbArticle.issue,
    pageNumber: dbArticle.page_number,
    articleType: dbArticle.article_type as ArticleSource | undefined,
    lastUpdate: dbArticle.updated_at
  };
};
