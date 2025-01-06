import type { Issue } from "../types";

export const sortByDate = (a: Issue, b: Issue) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  
  if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
    return dateB.getTime() - dateA.getTime();
  }
  
  console.error('Invalid date encountered while sorting');
  return 0;
};

export const sortByYear = (a: Issue, b: Issue) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  
  if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
    console.error('Invalid date encountered while sorting by year');
    return 0;
  }

  const yearDiff = dateB.getFullYear() - dateA.getFullYear();
  if (yearDiff === 0) {
    // If same year, sort by month (newest first)
    return dateB.getMonth() - dateA.getMonth();
  }
  return yearDiff;
};

export const sortByDownloads = (a: Issue, b: Issue) => 
  (b.downloads || 0) - (a.downloads || 0);

export const sortByShares = (a: Issue, b: Issue) => 
  (b.shares || 0) - (a.shares || 0);

export const sortByArticleCount = (a: Issue, b: Issue) =>
  b.articleCount - a.articleCount;

export const getSortFunction = (sortBy: string) => {
  switch (sortBy) {
    case "latest":
      return sortByDate;
    case "year":
      return sortByYear;
    case "downloads":
      return sortByDownloads;
    case "shares":
      return sortByShares;
    case "articles":
      return sortByArticleCount;
    default:
      return sortByDate;
  }
};