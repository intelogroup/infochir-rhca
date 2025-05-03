
import { TableHead, TableHeader as TableHeaderBase, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

export const TableHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <TableHeaderBase>
      <TableRow className="bg-muted/50">
        <TableHead className="w-[300px] sm:w-[400px]">Article</TableHead>
        <TableHead className="w-[80px]">Année</TableHead>
        <TableHead className="hidden sm:table-cell">Source</TableHead>
        <TableHead className="hidden md:table-cell">Catégorie</TableHead>
        <TableHead className="hidden md:table-cell">Tags</TableHead>
        <TableHead className="text-right w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeaderBase>
  );
};
