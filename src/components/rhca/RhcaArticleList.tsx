
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Download, Share2, AlertCircle } from "lucide-react";
import { RhcaArticle } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { downloadFileFromStorage, checkFileExistsInBucket } from '@/lib/pdf-utils';
import { toast } from 'sonner';

interface RhcaArticleListProps {
  articles: RhcaArticle[];
}

export const RhcaArticleList: React.FC<RhcaArticleListProps> = ({ articles }) => {
  const navigate = useNavigate();
  const [downloadingArticleId, setDownloadingArticleId] = useState<string | null>(null);
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
            console.error(`[RhcaArticleList] Error checking file existence for ${article.id}:`, err);
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
  
  const handleArticleClick = (articleId: string) => {
    navigate(`/rhca/article/${articleId}`);
  };
  
  const handleDownload = async (e: React.MouseEvent, article: RhcaArticle) => {
    e.stopPropagation();
    
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
      setDownloadingArticleId(article.id);
      
      // Use our improved download function
      await downloadFileFromStorage('rhca-pdfs', article.pdfFileName);
      
    } catch (err) {
      console.error("[RhcaArticleList:ERROR] Download failed:", err);
      
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
      setDownloadingArticleId(null);
    }
  };
  
  return (
    <div className="space-y-4">
      {articles.map((article) => {
        const formattedDate = (() => {
          try {
            return format(new Date(article.date), 'dd MMMM yyyy', { locale: fr });
          } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date invalide';
          }
        })();
        
        const isDownloading = downloadingArticleId === article.id;
        const fileExists = fileExistsMap[article.id];
        
        return (
          <Card 
            key={article.id}
            className="w-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group border border-gray-200"
            onClick={() => handleArticleClick(article.id)}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-1 mt-2">
                    <div className="flex items-center mr-3">
                      {article.volume && article.issue ? (
                        <span>Volume {article.volume} • No. {article.issue}</span>
                      ) : article.volume ? (
                        <span>Volume {article.volume}</span>
                      ) : (
                        <span>Numéro non spécifié</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.abstract}
                </p>
                
                <div className="flex flex-wrap items-center justify-between pt-1">
                  <div className="flex items-center space-x-3">
                    {article.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {article.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button 
                      className={`flex items-center ${
                        fileExists === false 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : isDownloading 
                            ? 'opacity-50 cursor-wait' 
                            : 'hover:text-emerald-600'
                      }`}
                      onClick={(e) => handleDownload(e, article)}
                      disabled={isDownloading || fileExists === false}
                      title={fileExists === false 
                        ? "PDF non disponible sur le serveur" 
                        : article.pdfFileName 
                          ? "Télécharger le PDF" 
                          : "PDF non disponible"
                      }
                    >
                      <Download className={`h-3.5 w-3.5 mr-1 ${isDownloading ? 'animate-pulse' : ''}`} />
                      <span>{article.downloads || 0}</span>
                    </button>
                    
                    <div className="flex items-center">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      <span>{article.shares || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
