
import type { Article } from "../index-medicus/types";

export interface RhcaArticle extends Article {
  pdfFileName?: string;
  coverImageFileName?: string;
}
