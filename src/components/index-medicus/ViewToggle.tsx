
import React from 'react';
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewToggleProps {
  viewMode: "grid" | "table";
  toggleViewMode: () => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, toggleViewMode }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null; // Hide on mobile as we auto-switch to grid view
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleViewMode}
      aria-label={viewMode === "grid" ? "Switch to table view" : "Switch to grid view"}
      className="h-9 px-2.5 py-1.5 border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {viewMode === "grid" ? (
        <List className="h-4 w-4 text-gray-600" />
      ) : (
        <Grid2X2 className="h-4 w-4 text-gray-600" />
      )}
    </Button>
  );
};
