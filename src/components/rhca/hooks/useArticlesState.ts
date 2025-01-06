import { useState, useMemo } from "react";
import type { RhcaArticle } from "../types";
import type { SortOption } from "@/types/sortOptions";

export const useArticlesState = (articles: RhcaArticle[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("year");

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    
    const searchLower = searchTerm.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.abstract.toLowerCase().includes(searchLower) ||
      article.authors.some(author => 
        author.toLowerCase().includes(searchLower)
      ) ||
      article.tags?.some(tag =>
        tag.toLowerCase().includes(searchLower)
      )
    );
  }, [articles, searchTerm]);

  const sortedArticles = useMemo(() => {
    const sorted = [...filteredArticles];
    
    switch (sortBy) {
      case "year":
        return sorted.sort((a, b) => {
          const yearDiff = new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
          if (yearDiff === 0) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return yearDiff;
        });
      case "latest":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "downloads":
        return sorted.sort((a, b) => Number(b.downloads || "0") - Number(a.downloads || "0"));
      case "shares":
        return sorted.sort((a, b) => Number(b.shares || "0") - Number(a.shares || "0"));
      default:
        return sorted;
    }
  }, [filteredArticles, sortBy]);

  const articlesByYear = useMemo(() => {
    return sortedArticles.reduce((acc, article) => {
      const year = new Date(article.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(article);
      return acc;
    }, {} as Record<number, RhcaArticle[]>);
  }, [sortedArticles]);

  const years = useMemo(() => {
    return Object.keys(articlesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [articlesByYear]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortedArticles,
    articlesByYear,
    years
  };
};