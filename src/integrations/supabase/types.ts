// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Article related types
interface ArticleBase {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publication_date: string | null;
  source: string;
  category: string;
  tags: string[] | null;
  pdf_url: string | null;
  image_url: string | null;
}

interface ArticleMetrics {
  views: number | null;
  citations: number | null;
  downloads: number | null;
  shares: number | null;
}

interface ArticleTimestamps {
  created_at: string | null;
  updated_at: string | null;
}

export interface Article extends ArticleBase, ArticleMetrics, ArticleTimestamps {}

// Article submission types
interface SubmissionBase {
  id: number;
  publication_type: string;
  title: string;
  authors: string;
  institution: string;
  keywords: string;
  abstract: string;
}

interface SubmissionContact {
  corresponding_author_name: string;
  corresponding_author_email: string;
  corresponding_author_phone: string;
  corresponding_author_address: string;
}

interface SubmissionDeclarations {
  ethics_approval: boolean;
  no_conflict: boolean;
  original_work: boolean;
}

interface SubmissionStatus {
  status: string;
  pdf_url: string | null;
  article_files_urls: string[] | null;
  image_annexes_urls: string[] | null;
}

interface SubmissionTimestamps {
  created_at: string;
  updated_at: string;
}

export interface ArticleSubmission extends 
  SubmissionBase, 
  SubmissionContact, 
  SubmissionDeclarations, 
  SubmissionStatus,
  SubmissionTimestamps {}

// Member types
export interface Member {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  titre: string | null;
}

// Newsletter subscription types
export interface NewsletterSubscription {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subscribed_at: string;
  is_active: boolean;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article;
        Insert: Partial<Article>;
        Update: Partial<Article>;
      };
      article_submissions: {
        Row: ArticleSubmission;
        Insert: Partial<ArticleSubmission>;
        Update: Partial<ArticleSubmission>;
      };
      members: {
        Row: Member;
        Insert: Partial<Member>;
        Update: Partial<Member>;
      };
      newsletter_subscriptions: {
        Row: NewsletterSubscription;
        Insert: Omit<NewsletterSubscription, 'id'>;
        Update: Partial<NewsletterSubscription>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}