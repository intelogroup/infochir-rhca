import { useState, useEffect } from "react";
import { SearchAndSort } from "./issues/SearchAndSort";
import { YearGroup } from "./issues/YearGroup";
import { IssuesTable } from "./issues/IssuesTable";
import type { Issue } from "./igm/types";
import { IGM_SORT_OPTIONS, type IGMSortOption } from "@/types/sort";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "IGM Volume 7 - No 32",
    volume: "Volume 7",
    issue: "No 32",
    date: new Date(2020, 8, 15).toISOString(),
    abstract: "Numéro spécial sur les avancées en chirurgie mini-invasive",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample1.pdf",
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=700&fit=crop",
    articleCount: 8,
    downloads: 125,
    shares: 45,
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
    title: "IGM Volume 7 - No 31",
    volume: "Volume 7",
    issue: "No 31",
    date: new Date(2020, 5, 15).toISOString(),
    abstract: "Focus sur l'anesthésie en chirurgie pédiatrique",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample2.pdf",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=700&fit=crop",
    articleCount: 6,
    downloads: 98,
    shares: 32,
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
    title: "IGM Volume 7 - No 30",
    volume: "Volume 7",
    issue: "No 30",
    date: new Date(2020, 2, 1).toISOString(),
    abstract: "Les dernières innovations en chirurgie orthopédique",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample3.pdf",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=700&fit=crop",
    articleCount: 7,
    downloads: 156,
    shares: 67,
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
    title: "IGM Volume 6 - No 29",
    volume: "Volume 6",
    issue: "No 29",
    date: new Date(2019, 11, 15).toISOString(),
    abstract: "Progrès en chirurgie cardiovasculaire",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample4.pdf",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=700&fit=crop",
    articleCount: 9,
    downloads: 178,
    shares: 89,
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
  {
    id: "5",
    title: "IGM Volume 6 - No 28",
    volume: "Volume 6",
    issue: "No 28",
    date: new Date(2019, 8, 15).toISOString(),
    abstract: "Actualités en médecine interne",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample5.pdf",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=700&fit=crop",
    articleCount: 7,
    downloads: 134,
    shares: 56,
    articles: [
      {
        id: "5-1",
        title: "Nouvelles approches en médecine interne",
        authors: ["Dr. Marie Dubois"],
        pageNumber: 1,
        tags: ["Médecine interne", "Innovation"]
      }
    ]
  }
];

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<IGMSortOption["value"]>("latest");
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

  const sortIssues = (issues: Issue[], sortType: IGMSortOption["value"]) => {
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
      case "downloads":
        sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "shares":
        sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
        break;
      default:
        break;
    }
    setFilteredIssues(sorted);
  };

  const handleSort = (value: IGMSortOption["value"]) => {
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
      <SearchAndSort<IGMSortOption>
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={handleSearch}
        onSort={handleSort}
        sortOptions={IGM_SORT_OPTIONS}
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