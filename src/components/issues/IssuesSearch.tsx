import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Issue } from "./types";

interface IssuesSearchProps {
  onSearch: (value: string) => void;
  filteredIssues: Issue[];
  setFilteredIssues: (issues: Issue[]) => void;
}

export const IssuesSearch = ({ onSearch, filteredIssues, setFilteredIssues }: IssuesSearchProps) => {
  const handleSearch = (value: string) => {
    const filtered = filteredIssues.filter(issue =>
      issue.title.toLowerCase().includes(value.toLowerCase()) ||
      issue.abstract?.toLowerCase().includes(value.toLowerCase()) ||
      issue.authors?.some(author => 
        author.toLowerCase().includes(value.toLowerCase())
      ) ||
      issue.tags?.some(tag => 
        tag.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredIssues(filtered);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Rechercher par titre, auteur, tag..."
        className="pl-10"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};