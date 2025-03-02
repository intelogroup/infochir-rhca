
import { useMemo } from "react";
import type { RhcaArticle } from "../types";

export const useArticlesState = (articles: RhcaArticle[]) => {
  const articlesByYear = useMemo(() => {
    return articles.reduce((acc, article) => {
      // Extract year from publication date
      const date = article.publicationDate ? new Date(article.publicationDate) : null;
      const year = date && !isNaN(date.getTime()) 
        ? date.getFullYear() 
        : 'Unknown';
        
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(article);
      return acc;
    }, {} as Record<string | number, RhcaArticle[]>);
  }, [articles]);

  const years = useMemo(() => {
    return Object.keys(articlesByYear)
      .filter(year => year !== 'Unknown')
      .map(year => parseInt(year, 10))
      .sort((a, b) => b - a);
  }, [articlesByYear]);

  return {
    articlesByYear,
    years,
    unknownYearArticles: articlesByYear['Unknown'] || []
  };
};
