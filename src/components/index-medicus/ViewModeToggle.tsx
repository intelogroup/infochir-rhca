import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewModeToggleProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  className?: string;
}

export const ViewModeToggle = ({ viewMode, setViewMode, className }: ViewModeToggleProps) => {
  return (
    <div className={cn("flex justify-end gap-2", className)}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        onClick={() => setViewMode('grid')}
        size="sm"
        className="gap-2"
      >
        <Grid className="h-4 w-4" />
        Grille
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        onClick={() => setViewMode('table')}
        size="sm"
        className="gap-2"
      >
        <List className="h-4 w-4" />
        Tableau
      </Button>
    </div>
  );
};