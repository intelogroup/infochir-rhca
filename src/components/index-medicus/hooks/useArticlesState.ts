
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import type { Article } from "../types";

export const useArticlesState = (articles: Article[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map(article => article.category));
    return Array.from(uniqueCategories).sort();
  }, [articles]);

  const sources = useMemo(() => {
    const uniqueSources = new Set(articles.map(article => article.source));
    return Array.from(uniqueSources).sort();
  }, [articles]);

  const availableTags = useMemo(() => {
    const uniqueTags = new Set(articles.flatMap(article => article.tags || []));
    return Array.from(uniqueTags).sort();
  }, [articles]);

  const availableAuthors = useMemo(() => {
    const uniqueAuthors = new Set(articles.flatMap(article => article.authors || []));
    return Array.from(uniqueAuthors).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    console.log('Filtering articles with:', { 
      searchTerm, 
      selectedCategory, 
      selectedSource, 
      selectedTags, 
      selectedAuthors,
      titleFilter,
      date 
    });
    
    return articles.filter(article => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchLower) ||
        article.abstract.toLowerCase().includes(searchLower) ||
        article.authors.some(author => 
          author.toLowerCase().includes(searchLower)
        ) ||
        article.category.toLowerCase().includes(searchLower) ||
        article.tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );

      // Title filter
      const matchesTitle = !titleFilter || 
        article.title.toLowerCase().includes(titleFilter.toLowerCase());

      // Author filter
      const matchesAuthors = selectedAuthors.length === 0 || 
        selectedAuthors.every(author => 
          article.authors.includes(author)
        );

      // Category filter
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      
      // Source filter
      const matchesSource = !selectedSource || article.source === selectedSource;
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => article.tags?.includes(tag));

      // Date range filter
      const matchesDate = !date?.from || !date?.to || 
        (new Date(article.date) >= date.from && new Date(article.date) <= date.to);

      return matchesSearch && matchesTitle && matchesAuthors && 
             matchesCategory && matchesSource && matchesTags && matchesDate;
    });
  }, [articles, searchTerm, titleFilter, selectedAuthors, selectedCategory, selectedSource, selectedTags, date]);

  const articleStats = useMemo(() => {
    return {
      total: articles.length,
      filtered: filteredArticles.length,
      sources: Object.fromEntries(
        sources.map(source => [
          source,
          articles.filter(a => a.source === source).length
        ])
      ),
      categories: Object.fromEntries(
        categories.map(category => [
          category,
          articles.filter(a => a.category === category).length
        ])
      ),
      authors: Object.fromEntries(
        availableAuthors.map(author => [
          author,
          articles.filter(a => a.authors.includes(author)).length
        ])
      )
    };
  }, [articles, filteredArticles, sources, categories, availableAuthors]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    selectedTags,
    setSelectedTags,
    selectedAuthors,
    setSelectedAuthors,
    titleFilter,
    setTitleFilter,
    date,
    setDate,
    filteredArticles,
    isLoading,
    categories,
    sources,
    availableTags,
    availableAuthors,
    articleStats
  };
};
