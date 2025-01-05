import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { YearGroup } from "@/components/issues/YearGroup";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { sortIssues, groupIssuesByYear, getSortedYears } from "./utils/issueSorting";
import { filterIssues } from "./utils/issueFiltering";
import type { Issue } from "./types";

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
    title: "IGM Volume 2 - No 38",
    volume: "Volume 2",
    issue: "No 38",
    date: new Date(2023, 11, 1).toISOString(),
    abstract: "Recherches sur la médecine préventive. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=700&fit=crop",
    articleCount: 9,
    downloads: 178,
    shares: 89,
    articles: []
  },
  {
    id: "3",
    title: "IGM Volume 2 - No 37",
    volume: "Volume 2",
    issue: "No 37",
    date: new Date(2023, 8, 1).toISOString(),
    abstract: "Innovations en cardiologie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=700&fit=crop",
    articleCount: 11,
    downloads: 134,
    shares: 56,
    articles: []
  }
];

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredIssues = useMemo(() => {
    return filterIssues(mockIssues, searchTerm);
  }, [searchTerm]);

  const sortedIssues = useMemo(() => {
    return sortIssues(filteredIssues, sortBy);
  }, [filteredIssues, sortBy]);

  const issuesByYear = useMemo(() => {
    return groupIssuesByYear(sortedIssues);
  }, [sortedIssues]);

  const sortedYears = useMemo(() => {
    return getSortedYears(issuesByYear);
  }, [issuesByYear]);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
          { value: "year", label: "Année" },
          { value: "downloads", label: "Téléchargements" },
          { value: "shares", label: "Partages" },
        ]}
      />
      
      {viewMode === "grid" ? (
        <div className="space-y-6">
          {sortedYears.map((year) => (
            <YearGroup
              key={year}
              year={year}
              issues={issuesByYear[year]}
            />
          ))}
        </div>
      ) : (
        <IssuesTable issues={sortedIssues} />
      )}
    </div>
  );
};
