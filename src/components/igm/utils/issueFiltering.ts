
import { Issue } from "../types";
import { isValidDate } from "../types";

// Filter issues by search term
export const filterBySearchTerm = (issues: Issue[], searchTerm: string): Issue[] => {
  if (!searchTerm) return issues;
  
  const searchLower = searchTerm.toLowerCase();
  const searchTerms = searchLower.split(' ').filter(Boolean);
  
  return issues.filter(issue => {
    // Check main fields
    const mainFieldsMatch = 
      issue.title.toLowerCase().includes(searchLower) ||
      (issue.abstract?.toLowerCase().includes(searchLower) || false);
    
    if (mainFieldsMatch) return true;
    
    // Check articles
    return issue.articles?.some(article => 
      searchTerms.every(term => 
        article.title.toLowerCase().includes(term) ||
        article.authors.some(author => author.toLowerCase().includes(term)) ||
        (article.abstract?.toLowerCase().includes(term) || false)
      )
    ) || false;
  });
};

// Filter issues by date range
export const filterByDateRange = (issues: Issue[], dateFrom?: Date, dateTo?: Date): Issue[] => {
  if (!dateFrom && !dateTo) return issues;
  
  const validIssues = issues.filter(issue => {
    try {
      // First verify the date is valid
      if (!issue.date) {
        console.warn("Issue without date:", issue.id);
        return false;
      }
      
      const issueDate = new Date(issue.date);
      
      // Skip invalid dates
      if (!isValidDate(issueDate)) {
        console.warn("Invalid date in issue:", issue.id, issue.date);
        return false;
      }

      const isAfterStart = !dateFrom || issueDate >= dateFrom;
      const isBeforeEnd = !dateTo || issueDate <= dateTo;
      
      return isAfterStart && isBeforeEnd;
    } catch (error) {
      console.error("Error filtering date for issue", issue.id, error);
      return false;
    }
  });
  
  return validIssues;
};

// Filter issues by category
export const filterByCategories = (issues: Issue[], selectedCategories: string[]): Issue[] => {
  if (!selectedCategories?.length) return issues;
  
  return issues.filter(issue => 
    selectedCategories.every(category => 
      issue.categories?.includes(category)
    )
  );
};

// Filter issues by year
export const filterByYear = (issues: Issue[], year: number): Issue[] => {
  if (!year) return issues;
  
  return issues.filter(issue => {
    if (!issue.date) {
      return false;
    }
    
    try {
      const issueDate = new Date(issue.date);
      if (!isValidDate(issueDate)) {
        return false;
      }
      
      const issueYear = issueDate.getFullYear();
      return issueYear === year;
    } catch (error) {
      console.error(`Error filtering by year for issue ${issue.id}:`, error);
      return false;
    }
  });
};
