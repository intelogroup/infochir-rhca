import { useState, useMemo } from "react";
import type { Issue, SortOption } from "../types";

export const useIssuesState = (initialIssues: Issue[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isLoading, setIsLoading] = useState(true);

  const filteredIssues = useMemo(() => {
    if (!searchTerm) return initialIssues;
    
    return initialIssues.filter(issue =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.abstract.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialIssues, searchTerm]);

  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues];
    switch (sortBy) {
      case "latest":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "year":
        return sorted.sort((a, b) => new Date(b.date).getFullYear() - new Date(a.date).getFullYear());
      case "downloads":
        return sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "shares":
        return sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
      default:
        return sorted;
    }
  }, [filteredIssues, sortBy]);

  const issuesByYear = useMemo(() => {
    return sortedIssues.reduce((acc, issue) => {
      const year = new Date(issue.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(issue);
      return acc;
    }, {} as Record<number, Issue[]>);
  }, [sortedIssues]);

  const sortedYears = useMemo(() => {
    return Object.keys(issuesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [issuesByYear]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    isLoading,
    setIsLoading,
    sortedIssues,
    issuesByYear,
    sortedYears,
  };
};