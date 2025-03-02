
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Download, Share2, AlertCircle } from "lucide-react";
import { RhcaArticle } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { downloadFileFromStorage, checkFileExistsInBucket } from '@/lib/pdf-utils';
import { toast } from 'sonner';

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  
  // Check if the file exists when the component mounts
  React.useEffect(() => {
    if (article.pdfFileName) {
      const checkFile = async () => {
        try {
          const exists = await checkFileExistsInBucket('rhca-pdfs', article.pdfFileName!);
          setFileExists(exists);
        } catch (err) {
          console.error("[RhcaCard] Error checking file existence:", err);
          setFileExists(false);
        }
      };
      
      checkFile();
    } else {
      setFileExists(false);
    }
  }, [article.pdfFileName]);
  
  const handleClick = () => {
    navigate(`/rhca/article/${article.id}`);
  };
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent navigation when clicking the download icon
    if (!article.pdfFileName) {
      toast.error("Le fichier PDF n'est pas disponible pour cet article", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    // If we already checked and know the file doesn't exist
    if (fileExists === false) {
      toast.error(`Le fichier "${article.pdfFileName}" n'existe pas dans la bibliothèque`, {
        description: "Contactez l'administrateur pour assistance",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Use our improved download function
      await downloadFileFromStorage('rhca-pdfs', article.pdfFileName);
      
    } catch (err) {
      console.error("[RhcaCard:ERROR] Download failed:", err);
      
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
      setIsDownloading(false);
    }
  };
  
  const formattedDate = (() => {
    try {
      return format(new Date(article.date), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  })();

  return (
    <Card 
      className="w-full h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group border border-gray-200"
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-emerald-600 transition-colors">
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
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {article.abstract}
          </p>
          
          {article.category && (
            <div className="pt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {article.category}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <button 
                className={`flex items-center ${
                  fileExists === false 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : isDownloading 
                      ? 'opacity-50 cursor-wait' 
                      : 'hover:text-emerald-600'
                }`}
                onClick={handleDownload}
                disabled={isDownloading || fileExists === false}
                title={fileExists === false 
                  ? "PDF non disponible sur le serveur" 
                  : article.pdfFileName 
                    ? "Télécharger le PDF" 
                    : "PDF non disponible"
                }
              >
                <Download className={`h-3.5 w-3.5 mr-1 ${isDownloading ? 'animate-pulse' : ''}`} />
                <span>{article.downloads || 0} téléchargements</span>
              </button>
            </div>
            <div className="flex items-center">
              <Share2 className="h-3.5 w-3.5 mr-1" />
              <span>{article.shares || 0} partages</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
