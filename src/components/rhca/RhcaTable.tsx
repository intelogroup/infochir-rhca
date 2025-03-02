
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RhcaArticle } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RhcaTableProps {
  articles: RhcaArticle[];
}

export const RhcaTable: React.FC<RhcaTableProps> = ({ articles }) => {
  const columns: ColumnDef<RhcaArticle>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate font-medium">
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'volume',
      header: 'Volume',
      cell: ({ row }) => (
        <div>
          {row.original.volume ? `Volume ${row.original.volume}` : 'Volume -'} • {row.original.issue ? `No. ${row.original.issue}` : 'No. -'}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.date), 'dd MMMM yyyy', { locale: fr });
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Date invalide';
        }
      },
    },
    {
      accessorKey: 'specialty',
      header: 'Specialty',
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
    },
    {
      accessorKey: 'shares',
      header: 'Shares',
    },
  ];

  const table = useReactTable({
    data: articles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
