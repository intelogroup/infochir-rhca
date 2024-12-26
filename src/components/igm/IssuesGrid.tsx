import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssuesTable } from "@/components/issues/IssuesTable";
import type { Issue } from "@/components/issues/types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 41",
    date: new Date(2024, 8, 1).toISOString(), // September 2024
    abstract: "Édition spéciale sur les avancées en médecine tropicale. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 12,
  },
  {
    id: "2",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 40",
    date: new Date(2024, 5, 1).toISOString(), // June 2024
    abstract: "Focus sur les maladies infectieuses émergentes. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 8,
  },
  {
    id: "3",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 39",
    date: new Date(2024, 2, 1).toISOString(), // March 2024
    abstract: "Numéro sur la santé publique en Haïti. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 10,
  },
  {
    id: "4",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 38",
    date: new Date(2023, 11, 1).toISOString(), // December 2023
    abstract: "Recherches sur la médecine préventive. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 9,
  },
  {
    id: "5",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 37",
    date: new Date(2023, 8, 1).toISOString(), // September 2023
    abstract: "Innovations en cardiologie. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 11,
  },
  {
    id: "6",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 36",
    date: new Date(2023, 5, 1).toISOString(), // June 2023
    abstract: "Actualités en pédiatrie. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 7,
  },
  {
    id: "7",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 35",
    date: new Date(2022, 11, 1).toISOString(), // December 2022
    abstract: "Progrès en neurologie. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 10,
  },
  {
    id: "8",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 34",
    date: new Date(2022, 8, 1).toISOString(), // September 2022
    abstract: "Études sur la médecine tropicale. Édité par Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    articleCount: 8,
  },
];

export const IssuesGrid = ({ viewMode = "grid" }: { viewMode?: "grid" | "table" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredIssues = mockIssues.filter((issue) =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
      />
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6">
          {sortedIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              id={issue.id}
              title={issue.title}
              volume={issue.volume}
              issue={issue.issue}
              date={issue.date}
              articleCount={issue.articleCount}
              pdfUrl={issue.pdfUrl}
              coverImage={issue.coverImage}
            />
          ))}
        </div>
      ) : (
        <IssuesTable issues={sortedIssues} />
      )}
    </div>
  );
};