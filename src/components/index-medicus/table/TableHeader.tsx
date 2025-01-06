import { TableHead, TableHeader as TableHeaderBase, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <TableHeaderBase>
      <TableRow className="bg-muted/50">
        <TableHead className="w-[400px]">Titre</TableHead>
        <TableHead>Année</TableHead>
        <TableHead>Auteurs</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Catégorie</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeaderBase>
  );
};