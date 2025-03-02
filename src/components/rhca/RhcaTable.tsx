
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RhcaArticle } from "./types";
import { useRhcaTableColumns } from "./table/RhcaTableColumns";

interface RhcaTableProps {
  articles: RhcaArticle[];
}

export const RhcaTable: React.FC<RhcaTableProps> = ({ articles }) => {
  const columns = useRhcaTableColumns();
  
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} style={{ width: `${column.size}px` }}>
                {typeof column.header === 'function' 
                  ? column.header({} as any) 
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.cell({ row: { original: article } } as any)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
