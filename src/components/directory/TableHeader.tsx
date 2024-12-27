import { TableHead, TableHeader as TableHeaderBase, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  sortField: 'id' | 'name';
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'id' | 'name') => void;
}

export const TableHeader = ({ sortField, sortDirection, onSort }: TableHeaderProps) => {
  return (
    <TableHeaderBase>
      <TableRow className="border-b border-gray-200">
        <TableHead 
          onClick={() => onSort('id')}
          className="w-20 cursor-pointer hover:text-primary transition-colors"
        >
          <div className="flex items-center space-x-1">
            <span>ID</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="w-24">Photo</TableHead>
        <TableHead 
          onClick={() => onSort('name')}
          className="cursor-pointer hover:text-primary transition-colors"
        >
          <div className="flex items-center space-x-1">
            <span>Nom</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
        <TableHead className="hidden md:table-cell">Email</TableHead>
      </TableRow>
    </TableHeaderBase>
  );
};