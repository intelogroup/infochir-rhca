
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from "@tanstack/react-table";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaArticle } from "../types";
import { RhcaTableActions } from "./RhcaTableActions";

const columnHelper = createColumnHelper<RhcaArticle>();

export const useRhcaTableColumns = () => {
  return [
    columnHelper.accessor('coverImageFileName', {
      header: '',
      cell: ({ row }) => {
        const article = row.original;
        if (article.coverImageFileName) {
          const { data } = supabase.storage
            .from('rhca_covers')
            .getPublicUrl(article.coverImageFileName);
          
          console.log('[RhcaTable:DEBUG] Cover image URL:', data.publicUrl);
          
          return (
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <ImageOptimizer
                src={data.publicUrl}
                alt={`Couverture du volume ${article.volume}, numéro ${article.issue}`}
                className="w-full h-full object-cover"
                width={48}
                height={48}
                fallbackText=""
              />
            </div>
          );
        } else if (article.image_url) {
          // Fallback to image_url if available
          return (
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <ImageOptimizer
                src={article.image_url}
                alt={`Couverture du volume ${article.volume}, numéro ${article.issue}`}
                className="w-full h-full object-cover"
                width={48}
                height={48}
                fallbackText=""
              />
            </div>
          );
        }
        
        return null;
      },
      size: 50,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="max-w-md">
            <p className="font-medium line-clamp-2">{article.title}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.tags && article.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="px-1.5 py-0 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        );
      },
      size: 300,
    }),
    columnHelper.accessor('authors', {
      header: 'Auteurs',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="max-w-[200px]">
            <p className="text-sm line-clamp-2">
              {article.authors?.join(', ') || 'Non spécifié'}
            </p>
          </div>
        );
      },
      size: 150,
    }),
    columnHelper.accessor('publicationDate', {
      header: 'Date',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="text-sm">
            {article.publicationDate 
              ? new Date(article.publicationDate).toLocaleDateString('fr-FR') 
              : 'Non spécifié'}
          </div>
        );
      },
      size: 100,
    }),
    columnHelper.accessor('volume', {
      header: 'Volume/Issue',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="text-sm">
            {article.volume ? `Vol ${article.volume}` : ''}
            {article.volume && article.issue ? ', ' : ''}
            {article.issue ? `No ${article.issue}` : ''}
          </div>
        );
      },
      size: 100,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => <RhcaTableActions article={row.original} />,
      size: 50,
    }),
  ];
};
