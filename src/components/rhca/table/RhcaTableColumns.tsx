
import React from 'react';
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PdfStatusIndicator } from "@/components/shared/PdfStatusIndicator";
import { RhcaTableActions } from "./RhcaTableActions";
import type { RhcaArticle } from "../types";

// Define a column type that closely matches what RhcaTable expects
export type RhcaTableColumn = {
  id: string;
  header: string | React.ReactNode | (() => React.ReactNode);
  cell: (props: { row: { original: RhcaArticle } }) => React.ReactNode;
  size?: number;
};

export const useRhcaTableColumns = (): RhcaTableColumn[] => {
  return [
    {
      id: "title",
      header: "Titre",
      cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
      size: 300
    },
    {
      id: "publication_date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center text-muted-foreground">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span>
            {row.original.publicationDate 
              ? new Date(row.original.publicationDate).toLocaleDateString('fr-FR') 
              : '-'}
          </span>
        </div>
      ),
      size: 120
    },
    {
      id: "authors",
      header: "Auteurs",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.authors && row.original.authors.length > 0
            ? row.original.authors.slice(0, 2).join(", ") + 
              (row.original.authors.length > 2 ? ", et al." : "")
            : "Auteur inconnu"}
        </div>
      ),
      size: 200
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags && row.original.tags.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="outline" className="px-1.5 py-0 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ),
      size: 150
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RhcaTableActions article={row.original} />,
      size: 80
    }
  ];
};
