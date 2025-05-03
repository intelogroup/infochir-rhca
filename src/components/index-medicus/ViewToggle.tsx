
import React from 'react';
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Table as TableIcon } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "table" | "list";
  toggleViewMode: () => void;
  isMobile?: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, toggleViewMode, isMobile }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleViewMode}
      aria-label={
        isMobile 
          ? (viewMode === "list" ? "Switch to grid view" : "Switch to list view")
          : (viewMode === "grid" ? "Switch to table view" : viewMode === "table" ? "Switch to grid view" : "Switch to table view")
      }
      className="h-9 px-2.5 py-1.5 border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {viewMode === "list" ? (
        <Grid2X2 className="h-4 w-4 text-gray-600" />
      ) : viewMode === "grid" ? (
        <TableIcon className="h-4 w-4 text-gray-600" />
      ) : (
        <List className="h-4 w-4 text-gray-600" />
      )}
    </Button>
  );
};
