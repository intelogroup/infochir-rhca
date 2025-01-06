import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import type { Article } from "../types";

export const useArticlesState = (articles: Article[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map(article => article.category));
    return Array.from(uniqueCategories);
  }, [articles]);

  const sources = useMemo(() => {
    const uniqueSources = new Set(articles.map(article => article.source));
    return Array.from(uniqueSources);
  }, [articles]);

  const availableTags = useMemo(() => {
    const uniqueTags = new Set(articles.flatMap(article => article.tags || []));
    return Array.from(uniqueTags);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.some(author => 
          author.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesSource = !selectedSource || article.source === selectedSource;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => article.tags?.includes(tag));

      const matchesDate = !date?.from || !date?.to || 
        (new Date(article.date) >= date.from && new Date(article.date) <= date.to);

      return matchesSearch && matchesCategory && matchesSource && matchesTags && matchesDate;
    });
  }, [articles, searchTerm, selectedCategory, selectedSource, selectedTags, date]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    selectedTags,
    setSelectedTags,
    date,
    setDate,
    filteredArticles,
    isLoading,
    categories,
    sources,
    availableTags,
  };
};