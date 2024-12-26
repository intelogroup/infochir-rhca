import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssuesTable } from "@/components/issues/IssuesTable";

const mockIssues = [
  {
    id: "1",
    title: "Volume 1, Numéro 1",
    description: "Premier numéro de l'Info Gazette Médicale",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    date: "2024-01",
    pdfUrl: "#",
  },
  {
    id: "2",
    title: "Volume 1, Numéro 2",
    description: "Deuxième numéro de l'Info Gazette Médicale",
    coverImage: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    date: "2024-02",
    pdfUrl: "#",
  },
];

export const IssuesGrid = ({ viewMode = "grid" }: { viewMode?: "grid" | "table" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredIssues = mockIssues.filter((issue) =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
      />
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              title={issue.title}
              description={issue.description}
              coverImage={issue.coverImage}
              date={issue.date}
              pdfUrl={issue.pdfUrl}
              className="bg-white"
            />
          ))}
        </div>
      ) : (
        <IssuesTable issues={filteredIssues} />
      )}
    </div>
  );
};