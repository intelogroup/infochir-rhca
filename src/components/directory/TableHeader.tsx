import { TableHead, TableHeader as TableHeaderBase, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  sortField: 'id' | 'name' | 'email';
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'id' | 'name' | 'email') => void;
}

export const TableHeader = ({ sortField, sortDirection, onSort }: TableHeaderProps) => {
  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-primary" /> : 
      <ChevronDown className="h-4 w-4 text-primary" />;
  };

  const headerClasses = (field: typeof sortField) => 
    cn("transition-colors hover:bg-gray-50/80 cursor-pointer select-none", {
      "text-primary": sortField === field
    });

  return (
    <TableHeaderBase>
      <TableRow className="border-b border-gray-200">
        <TableHead 
          onClick={() => onSort('id')}
          className={headerClasses('id')}
        >
          <div className="flex items-center gap-2">
            <span>ID</span>
            <SortIcon field="id" />
          </div>
        </TableHead>
        <TableHead className="w-20">Photo</TableHead>
        <TableHead 
          onClick={() => onSort('name')}
          className={headerClasses('name')}
        >
          <div className="flex items-center gap-2">
            <span>Nom</span>
            <SortIcon field="name" />
          </div>
        </TableHead>
        <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
        <TableHead 
          onClick={() => onSort('email')}
          className={cn("hidden md:table-cell", headerClasses('email'))}
        >
          <div className="flex items-center gap-2">
            <span>Email</span>
            <SortIcon field="email" />
          </div>
        </TableHead>
      </TableRow>
    </TableHeaderBase>
  );
};