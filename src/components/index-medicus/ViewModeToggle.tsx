import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const ViewModeToggle = ({ viewMode, setViewMode }: ViewModeToggleProps) => {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        onClick={() => setViewMode('grid')}
        size="sm"
      >
        <Grid className="h-4 w-4 mr-2" />
        Grille
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        onClick={() => setViewMode('table')}
        size="sm"
      >
        <List className="h-4 w-4 mr-2" />
        Tableau
      </Button>
    </div>
  );
};