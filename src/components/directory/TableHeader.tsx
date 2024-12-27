import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

type SortField = 'id' | 'name';
type SortDirection = 'asc' | 'desc';

interface TableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const TableHeader = ({ sortField, sortDirection, onSort }: TableHeaderProps) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <ShadcnTableHeader>
      <TableRow>
        <TableHead 
          className="w-[50px] cursor-pointer"
          onClick={() => onSort('id')}
        >
          <div className="flex items-center">
            No.
            <SortIcon field="id" />
          </div>
        </TableHead>
        <TableHead className="w-[120px]">Photo</TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('name')}
        >
          <div className="flex items-center">
            Nom
            <SortIcon field="name" />
          </div>
        </TableHead>
        <TableHead className="w-[200px]">Téléphone</TableHead>
        <TableHead className="w-[300px]">Email</TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};