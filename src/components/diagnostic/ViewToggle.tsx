import { LayoutGrid, Table } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: "grid" | "table";
  setView: (view: "grid" | "table") => void;
}

export const ViewToggle = ({ view, setView }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as "grid" | "table")}>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};