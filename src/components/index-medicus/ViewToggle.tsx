import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, BookOpen, Newspaper } from "lucide-react";

interface ViewToggleProps {
  view: string;
  setView: (view: string) => void;
}

export const ViewToggle = ({ view, setView }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={view} onValueChange={setView} className="justify-center">
      <ToggleGroupItem value="atlas" aria-label="Toggle atlas view" className="gap-2">
        <Grid className="h-4 w-4" />
        Atlas
      </ToggleGroupItem>
      <ToggleGroupItem value="revue" aria-label="Toggle revue view" className="gap-2">
        <BookOpen className="h-4 w-4" />
        Revue
      </ToggleGroupItem>
      <ToggleGroupItem value="gazette" aria-label="Toggle gazette view" className="gap-2">
        <Newspaper className="h-4 w-4" />
        Gazette
      </ToggleGroupItem>
    </ToggleGroup>
  );
};