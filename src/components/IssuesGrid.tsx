import { useState, useEffect } from "react";
import { SearchAndSort } from "./issues/SearchAndSort";
import { YearGroup } from "./issues/YearGroup";
import { IssuesTable } from "./issues/IssuesTable";
import type { Issue } from "./issues/types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Nouvelles approches en chirurgie laparoscopique",
    volume: "Volume 1",
    issue: "Issue 1",
    date: new Date().toISOString(),
    abstract: "Une étude approfondie des techniques modernes en chirurgie mini-invasive",
    pdfUrl: "https://example.com/sample1.pdf",
    articleCount: 1,
  },
  {
    id: "2",
    title: "L'anesthésie régionale dans la chirurgie orthopédique",
    volume: "Volume 1",
    issue: "Issue 2",
    date: new Date(2023, 11, 15).toISOString(),
    abstract: "Analyse comparative des protocoles d'anesthésie en orthopédie",
    pdfUrl: "https://example.com/sample2.pdf",
    articleCount: 1,
  },
  {
    id: "3",
    title: "Gestion de la douleur post-opératoire",
    volume: "Volume 1",
    issue: "Issue 3",
    date: new Date(2023, 10, 1).toISOString(),
    abstract: "Nouvelles stratégies pour le contrôle de la douleur après une intervention chirurgicale",
    pdfUrl: "https://example.com/sample3.pdf",
    articleCount: 1,
  },
  {
    id: "4",
    title: "Innovations en chirurgie cardiaque",
    volume: "Volume 1",
    issue: "Issue 4",
    date: new Date(2023, 9, 15).toISOString(),
    abstract: "Les dernières avancées en chirurgie cardiovasculaire",
    pdfUrl: "https://example.com/sample4.pdf",
    articleCount: 1,
  },
  {
    id: "5",
    title: "Techniques d'urgence en traumatologie",
    volume: "Volume 2",
    issue: "Issue 1",
    date: new Date(2023, 8, 1).toISOString(),
    abstract: "Protocoles actualisés pour la prise en charge des traumatismes",
    pdfUrl: "https://example.com/sample5.pdf",
    articleCount: 1,
  },
  {
    id: "6",
    title: "L'impact de l'IA en chirurgie",
    volume: "Volume 2",
    issue: "Issue 2",
    date: new Date(2023, 7, 15).toISOString(),
    abstract: "Applications pratiques de l'intelligence artificielle en chirurgie",
    pdfUrl: "https://example.com/sample6.pdf",
    articleCount: 1,
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