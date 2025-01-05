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
    date: new Date(2020, 8, 15).toISOString(),
    abstract: "Numéro spécial sur les avancées en chirurgie mini-invasive",
    pdfUrl: "https://example.com/sample1.pdf",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=700&fit=crop",
    articleCount: 8,
    articles: [
      {
        id: "1-1",
        title: "Les nouvelles techniques en chirurgie mini-invasive",
        authors: ["Dr. Marie Laurent", "Dr. Pierre Dubois"],
        pageNumber: 1,
        abstract: "Une revue des dernières avancées en chirurgie mini-invasive",
        tags: ["Chirurgie mini-invasive", "Innovation"]
      }
    ]
  },
  {
    id: "2",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 31",
    date: new Date(2020, 5, 15).toISOString(),
    abstract: "Focus sur l'anesthésie en chirurgie pédiatrique",
    pdfUrl: "https://example.com/sample2.pdf",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=700&fit=crop",
    articleCount: 6,
    articles: [
      {
        id: "2-1",
        title: "Spécificités de l'anesthésie pédiatrique",
        authors: ["Dr. Anne Dupont"],
        pageNumber: 1,
        tags: ["Anesthésie", "Pédiatrie"]
      }
    ]
  },
  {
    id: "3",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 30",
    date: new Date(2020, 2, 1).toISOString(),
    abstract: "Les dernières innovations en chirurgie orthopédique",
    pdfUrl: "https://example.com/sample3.pdf",
    coverImage: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=500&h=700&fit=crop",
    articleCount: 7,
    articles: [
      {
        id: "3-1",
        title: "Innovations en chirurgie orthopédique",
        authors: ["Dr. Jean Martin"],
        pageNumber: 1,
        tags: ["Orthopédie", "Innovation"]
      }
    ]
  },
  {
    id: "4",
    title: "Info CHIR",
    volume: "Volume 6",
    issue: "No 29",
    date: new Date(2019, 11, 15).toISOString(),
    abstract: "Progrès en chirurgie cardiovasculaire",
    pdfUrl: "https://example.com/sample4.pdf",
    coverImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=700&fit=crop",
    articleCount: 9,
    articles: [
      {
        id: "4-1",
        title: "Avancées en chirurgie cardiovasculaire",
        authors: ["Dr. Sophie Richard"],
        pageNumber: 1,
        tags: ["Cardiovasculaire", "Innovation"]
      }
    ]
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
