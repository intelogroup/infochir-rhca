import { useState, useEffect } from "react";
import { SearchAndSort } from "./issues/SearchAndSort";
import { YearGroup } from "./issues/YearGroup";
import type { Issue } from "./issues/types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Sample Article 1",
    volume: "Volume 1",
    issue: "Issue 1",
    date: new Date().toISOString(),
    abstract: "This is a sample abstract for testing purposes",
    pdfUrl: "https://example.com/sample1.pdf",
    articleCount: 1,
  },
  {
    id: "2",
    title: "Sample Article 2",
    volume: "Volume 1",
    issue: "Issue 2",
    date: new Date(2023, 1, 1).toISOString(),
    abstract: "Another sample abstract for testing",
    pdfUrl: "https://example.com/sample2.pdf",
    articleCount: 1,
  },
];

export const IssuesGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(mockIssues);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockIssues.filter(issue =>
      issue.title.toLowerCase().includes(value.toLowerCase()) ||
      issue.abstract.toLowerCase().includes(value.toLowerCase())
    );
    sortIssues(filtered, sortBy);
  };

  const sortIssues = (issues: Issue[], sortType: string) => {
    let sorted = [...issues];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "year":
        sorted.sort((a, b) => 
          new Date(b.date).getFullYear() - new Date(a.date).getFullYear()
        );
        break;
      case "month":
        sorted.sort((a, b) => 
          new Date(b.date).getMonth() - new Date(a.date).getMonth()
        );
        break;
      default:
        break;
    }
    setFilteredIssues(sorted);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    sortIssues(filteredIssues, value);
  };

  // Group issues by year
  const issuesByYear = filteredIssues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (isLoading) {
    return <div className="p-4">Chargement des articles...</div>;
  }

  return (
    <div className="space-y-4 px-4">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={handleSearch}
        onSort={handleSort}
      />

      <div className="space-y-4">
        {sortedYears.map((year) => (
          <YearGroup 
            key={year}
            year={year}
            issues={issuesByYear[year]}
          />
        ))}
      </div>
    </div>
  );
};