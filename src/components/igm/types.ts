
import { Article as IndexArticle } from "../index-medicus/types";

export interface Issue {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract?: string;
  pdfUrl?: string;
  coverImage?: string;
  articleCount?: number;
  downloads?: number;
  shares?: number;
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
