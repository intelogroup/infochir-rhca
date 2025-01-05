import type { Issue } from "../types";

export const filterIssuesBySearch = (issues: Issue[], searchTerm: string) => {
  if (!searchTerm) return issues;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return issues.filter(issue =>
    issue.title.toLowerCase().includes(lowercaseSearch) ||
    issue.abstract.toLowerCase().includes(lowercaseSearch)
  );
};