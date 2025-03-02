
import React, { useState } from 'react';
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
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { downloadFileFromStorage, checkFileExistsInBucket } from '@/lib/pdf-utils';
import { useNavigate } from 'react-router-dom';

interface RhcaTableProps {
  articles: RhcaArticle[];
}

export const RhcaTable: React.FC<RhcaTableProps> = ({ articles }) => {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const handleDownload = async (article: RhcaArticle) => {
    if (!article.pdfFileName) {
      toast.error("Le fichier PDF n'est pas disponible pour cet article");
      return;
    }
    
    try {
      setDownloadingId(article.id);
      
      // Check if file exists in bucket before attempting download
      const bucketName = 'rhca-pdfs';
      const fileExists = await checkFileExistsInBucket(bucketName, article.pdfFileName);
      
      if (!fileExists) {
        toast.error(`Le fichier "${article.pdfFileName}" n'existe pas dans la bibliothèque`, {
          description: "Contactez l'administrateur pour assistance"
        });
        return;
      }
      
      await downloadFileFromStorage(bucketName, article.pdfFileName);
      
    } catch (err) {
      console.error("[RhcaTable:ERROR] Download failed:", err);
      toast.error("Échec du téléchargement", {
        description: err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
      });
    } finally {
      setDownloadingId(null);
    }
  };
  
  const handleRowClick = (articleId: string) => {
    navigate(`/rhca/article/${articleId}`);
  };

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
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.category || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'specialty',
      header: 'Specialty',
      cell: ({ row }) => (
        <div>
          {row.original.specialty || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => {
        const article = row.original;
        const isDownloading = downloadingId === article.id;
        
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(article);
            }}
            disabled={isDownloading || !article.pdfFileName}
            className={`flex items-center ${
              !article.pdfFileName ? 'text-gray-400 cursor-not-allowed' : 
              isDownloading ? 'text-gray-400 cursor-wait' : 'text-gray-600 hover:text-emerald-600'
            }`}
            title={article.pdfFileName ? "Télécharger le PDF" : "PDF non disponible"}
          >
            <Download className={`h-4 w-4 mr-1.5 ${isDownloading ? 'animate-pulse' : ''}`} />
            <span>{article.downloads || 0}</span>
          </button>
        );
      },
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
                onClick={() => handleRowClick(row.original.id)}
                className="cursor-pointer hover:bg-gray-50"
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
