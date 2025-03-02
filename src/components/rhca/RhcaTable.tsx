
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RhcaArticle } from "./types";
import { createColumnHelper } from "@tanstack/react-table";
import { ImageOptimizer } from "../shared/ImageOptimizer";

interface RhcaTableProps {
  articles: RhcaArticle[];
}

export const RhcaTable: React.FC<RhcaTableProps> = ({ articles }) => {
  const columnHelper = createColumnHelper<RhcaArticle>();
  
  // For simplicity, just define a handleDownload function here without tracking
  const handleDownload = async (article: RhcaArticle) => {
    try {
      if (article.pdfFileName) {
        const { data } = await supabase.storage
          .from('rhca-pdfs')
          .getPublicUrl(article.pdfFileName);
          
        window.open(data.publicUrl, '_blank');
        
        // Track download
        try {
          await supabase.rpc('increment_count', { 
            table_name: 'articles', 
            column_name: 'downloads', 
            row_id: article.id 
          });
        } catch (error) {
          console.error('[RhcaTable] Error incrementing download count:', error);
        }
      } else {
        toast.error("PDF non disponible");
      }
    } catch (error) {
      console.error('[RhcaTable] Error downloading PDF:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };
  
  const handleShare = (article: RhcaArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract || "Découvrez cet article de la RHCA",
        url: window.location.href
      }).catch(error => {
        console.error('[RhcaTable] Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
    
    // Track share
    try {
      supabase.rpc('increment_count', { 
        table_name: 'articles', 
        column_name: 'shares', 
        row_id: article.id 
      });
    } catch (error) {
      console.error('[RhcaTable] Error incrementing share count:', error);
    }
  };
  
  const columns = [
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
    },
    {
      accessorKey: 'title',
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
    },
    {
      accessorKey: 'authors',
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
    },
    {
      accessorKey: 'publication_date',
      header: 'Date',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="text-sm">
            {article.publication_date 
              ? new Date(article.publication_date).toLocaleDateString('fr-FR') 
              : 'Non spécifié'}
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'volume',
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
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDownload(article)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare(article)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 50,
    },
  ];
  
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} style={{ width: `${column.size}px` }}>
                {column.header as React.ReactNode}
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
