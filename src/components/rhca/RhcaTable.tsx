
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { RhcaArticle } from "./types";
import { useRhcaTableColumns } from "./table/RhcaTableColumns";

interface RhcaTableProps {
  articles: RhcaArticle[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const RhcaTable: React.FC<RhcaTableProps> = ({
  articles,
  searchQuery,
  onSearchChange,
}) => {
  const columns = useRhcaTableColumns();
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des articles..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} style={column.size ? { width: column.size } : undefined}>
                  {typeof column.header === 'function' ? column.header() : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun article trouvé.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  {columns.map((column) => (
                    <TableCell key={`${article.id}-${column.id}`}>
                      {column.cell({ row: { original: article } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
