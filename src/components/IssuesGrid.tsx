import { useState, useEffect } from "react";
import { SearchAndSort } from "./issues/SearchAndSort";
import { YearGroup } from "./issues/YearGroup";
import { IssuesTable } from "./issues/IssuesTable";
import type { Issue } from "./issues/types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 32",
    date: new Date(2020, 8, 15).toISOString(), // September 2020
    abstract: "Numéro spécial sur les avancées en chirurgie mini-invasive",
    pdfUrl: "https://example.com/sample1.pdf",
    coverImage: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png",
    articleCount: 8,
  },
  {
    id: "2",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 31",
    date: new Date(2020, 5, 15).toISOString(), // June 2020
    abstract: "Focus sur l'anesthésie en chirurgie pédiatrique",
    pdfUrl: "https://example.com/sample2.pdf",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 6,
  },
  {
    id: "3",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 30",
    date: new Date(2020, 2, 1).toISOString(), // March 2020
    abstract: "Les dernières innovations en chirurgie orthopédique",
    pdfUrl: "https://example.com/sample3.pdf",
    coverImage: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png",
    articleCount: 7,
  },
  {
    id: "4",
    title: "Info CHIR",
    volume: "Volume 6",
    issue: "No 29",
    date: new Date(2019, 11, 15).toISOString(),
    abstract: "Progrès en chirurgie cardiovasculaire",
    pdfUrl: "https://example.com/sample4.pdf",
    coverImage: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png",
    articleCount: 9,
  },
];

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
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

      {viewMode === "grid" ? (
        <div className="space-y-4">
          {sortedYears.map((year) => (
            <YearGroup 
              key={year}
              year={year}
              issues={issuesByYear[year]}
            />
          ))}
        </div>
      ) : (
        <IssuesTable issues={filteredIssues} />
      )}
    </div>
  );
};
