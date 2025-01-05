import type { Issue } from "../types";

export const filterIssues = (issues: Issue[], searchTerm: string) => {
  if (!searchTerm) return issues;
  
  return issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );
};