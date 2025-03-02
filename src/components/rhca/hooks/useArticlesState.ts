
import { useMemo } from 'react';
import type { RhcaArticle } from '../types';

export const useArticlesState = (articles: RhcaArticle[]) => {
  // Group articles by year
  const articlesByYear = useMemo(() => {
    const byYear: Record<number, RhcaArticle[]> = {};
    
    articles.forEach(article => {
      const date = new Date(article.publicationDate);
      if (isNaN(date.getTime())) return;
      
      const year = date.getFullYear();
      if (!byYear[year]) {
        byYear[year] = [];
      }
      
      byYear[year].push(article);
    });

    // Sort articles within each year by date, most recent first
    Object.keys(byYear).forEach(year => {
      byYear[Number(year)].sort((a, b) => {
        return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      });
    });
    
    return byYear;
  }, [articles]);

  // Get sorted years (descending order)
  const years = useMemo(() => {
    return Object.keys(articlesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [articlesByYear]);

  return {
    articlesByYear,
    years
  };
};
