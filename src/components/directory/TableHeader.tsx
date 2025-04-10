
import { TableHead, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = 'id' | 'name' | 'email';

interface TableHeaderProps {
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export const TableHeader = ({ sortField, sortDirection, onSort }: TableHeaderProps) => {
  const headerClasses = (field: SortField) => 
    cn(
      "transition-colors hover:bg-primary/5 cursor-pointer select-none",
      sortField === field && "bg-primary/10"
    );

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown 
      className={cn(
        "h-4 w-4 transition-colors",
        sortField === field ? "text-primary" : "text-gray-400"
      )}
    />
  );

  return (
    <TableRow className="border-b border-gray-200 bg-gray-50/80">
      <TableHead 
        onClick={() => onSort('id')}
        className={cn("w-20", headerClasses('id'))}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">ID</span>
          <SortIcon field="id" />
        </div>
      </TableHead>
      
      <TableHead className="w-24 font-semibold">Photo</TableHead>
      
      <TableHead 
        onClick={() => onSort('name')}
        className={cn("w-1/3", headerClasses('name'))}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">Nom</span>
          <SortIcon field="name" />
        </div>
      </TableHead>
      
      <TableHead className="hidden sm:table-cell w-1/4 font-semibold">Téléphone</TableHead>
      
      <TableHead 
        onClick={() => onSort('email')}
        className={cn("hidden md:table-cell w-1/3", headerClasses('email'))}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">Email</span>
          <SortIcon field="email" />
        </div>
      </TableHead>
    </TableRow>
  );
};
