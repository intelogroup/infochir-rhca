
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
        viewMode === "grid" 
          ? "Switch to table view" 
          : viewMode === "table" 
            ? "Switch to list view" 
            : "Switch to grid view"
      }
      className="h-9 px-2.5 py-1.5 border-border hover:bg-muted transition-colors"
    >
      {viewMode === "grid" ? (
        <TableIcon className="h-4 w-4 text-muted-foreground" />
      ) : viewMode === "table" ? (
        <List className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Grid2X2 className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};
