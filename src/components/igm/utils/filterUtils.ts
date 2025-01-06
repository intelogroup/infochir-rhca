import type { Issue } from "../types";

export const filterIssuesBySearch = (issues: Issue[], searchTerm: string) => {
  if (!searchTerm) return issues;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return issues.filter(issue => {
    // Search in issue metadata
    const issueMatch = 
      issue.title.toLowerCase().includes(lowercaseSearch) ||
      issue.abstract.toLowerCase().includes(lowercaseSearch) ||
      issue.description?.toLowerCase().includes(lowercaseSearch) ||
      issue.volume.toLowerCase().includes(lowercaseSearch) ||
      issue.issue.toLowerCase().includes(lowercaseSearch);

    // Search in articles within the issue
    const articlesMatch = issue.articles.some(article => 
      article.title.toLowerCase().includes(lowercaseSearch) ||
      article.abstract?.toLowerCase().includes(lowercaseSearch) ||
      article.authors.some(author => 
        author.toLowerCase().includes(lowercaseSearch)
      ) ||
      article.tags?.some(tag => 
        tag.toLowerCase().includes(lowercaseSearch)
      )
    );

    return issueMatch || articlesMatch;
  });
};

export const filterIssuesByYear = (issues: Issue[], year: number) => {
  return issues.filter(issue => new Date(issue.date).getFullYear() === year);
};

export const filterIssuesByVolume = (issues: Issue[], volume: string) => {
  return issues.filter(issue => issue.volume === volume);
};