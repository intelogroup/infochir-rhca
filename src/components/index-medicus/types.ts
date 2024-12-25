import type { Article, ArticleWithRelations } from "@/types/article";

export type { Article, ArticleWithRelations };

// Additional IndexMedicus specific types can be added here
export interface IndexMedicusFilters {
  source?: Article['source'];
  category?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}