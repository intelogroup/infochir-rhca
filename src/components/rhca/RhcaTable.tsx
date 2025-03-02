import React, { useState, useEffect } from 'react';
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
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { downloadFileFromStorage, checkFileExistsInBucket } from '@/lib/pdf-utils';
import { useNavigate } from 'react-router-dom';
import { ImageOptimizer } from '@/components/shared/ImageOptimizer';
import { supabase } from '@/integrations/supabase/client';

interface RhcaTableProps {
  articles: RhcaArticle[];
}

export const RhcaTable: React.FC<RhcaTableProps> = ({ articles }) => {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [fileExistsMap, setFileExistsMap] = useState<Record<string, boolean>>({});
  
  // Check file existence for all articles when component mounts
  useEffect(() => {
    const checkFiles = async () => {
      const existsMap: Record<string, boolean> = {};
      
      for (const article of articles) {
        if (article.pdfFileName) {
          try {
            const exists = await checkFileExistsInBucket('rhca-pdfs', article.pdfFileName);
            existsMap[article.id] = exists;
          } catch (err) {
            console.error(`[RhcaTable] Error checking file existence for ${article.id}:`, err);
            existsMap[article.id] = false;
          }
        } else {
          existsMap[article.id] = false;
        }
      }
      
      setFileExistsMap(existsMap);
    };
    
    checkFiles();
  }, [articles]);
  
  const handleDownload = async (article: RhcaArticle) => {
    if (!article.pdfFileName) {
      toast.error("Le fichier PDF n'est pas disponible pour cet article", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    // If we already checked and know the file doesn't exist
    if (fileExistsMap[article.id] === false) {
      toast.error(`Le fichier "${article.pdfFileName}" n'existe pas dans la bibliothèque`, {
        description: "Contactez l'administrateur pour assistance",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    try {
      setDownloadingId(article.id);
      
      // Use our improved download function
      await downloadFileFromStorage('rhca-pdfs', article.pdfFileName);
      
    } catch (err) {
      console.error("[RhcaTable:ERROR] Download failed:", err);
      
      // More specific error messages based on error type
      if (err instanceof Error && err.message.includes('network')) {
        toast.error("Erreur de connexion réseau", {
          description: "Vérifiez votre connexion et réessayez"
        });
      } else {
        toast.error("Échec du téléchargement", {
          description: err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
        });
      }
    } finally {
      setDownloadingId(null);
    }
  };
  
  const handleRowClick = (articleId: string) => {
    navigate(`/rhca/article/${articleId}`);
  };

  const columns: ColumnDef<RhcaArticle>[] = [
    {
      accessorKey: 'coverImage',
      header: '',
      cell: ({ row }) => {
        const article = row.original;
        
        if (article.coverImageFileName) {
          const { data } = supabase.storage
            .from('rhca_covers')
            .getPublicUrl(article.coverImageFileName);
            
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
        }
        
        return null;
      },
      size: 50,
    },
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
        const fileExists = fileExistsMap[article.id];
        
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(article);
            }}
            disabled={isDownloading || fileExists === false || !article.pdfFileName}
            className={`flex items-center ${
              fileExists === false || !article.pdfFileName
                ? 'text-gray-300 cursor-not-allowed' 
                : isDownloading 
                  ? 'text-gray-400 cursor-wait' 
                  : 'text-gray-600 hover:text-emerald-600'
            }`}
            title={fileExists === false 
              ? "PDF non disponible sur le serveur" 
              : article.pdfFileName 
                ? "Télécharger le PDF" 
                : "PDF non disponible"
            }
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
