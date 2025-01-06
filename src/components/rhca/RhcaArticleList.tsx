import { useState } from "react";
import { RhcaGrid } from "./RhcaGrid";
import { RhcaTable } from "./RhcaTable";
import type { SortOption } from "@/types/sortOptions";

interface RhcaArticleListProps {
  viewMode: "grid" | "table";
}

export const RhcaArticleList = ({ viewMode }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  return (
    <div className="space-y-6">
      {viewMode === "grid" ? (
        <RhcaGrid />
      ) : (
        <RhcaTable />
      )}
    </div>
  );
};