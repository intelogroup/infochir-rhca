
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Download, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageOptimizer } from "../shared/ImageOptimizer";
import { useNavigate } from "react-router-dom";
import type { RhcaArticle } from "./types";
import { PdfStatusIndicator } from "../shared/PdfStatusIndicator";

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCoverImage = async () => {
      try {
        setImageLoading(true);
        console.log(`[RhcaCard] Article ${article.id} cover filename:`, article.coverImageFileName);
        
        // First try to get the cover image from storage if we have a filename
        if (article.coverImageFileName) {
          const { data } = await supabase.storage
            .from('rhca_covers')
            .getPublicUrl(article.coverImageFileName);
            
          console.log(`[RhcaCard] Cover image URL from storage:`, data.publicUrl);
          setCoverUrl(data.publicUrl);
        } 
        // Fallback to image_url if available
        else if (article.image_url) {
          console.log(`[RhcaCard] Using image_url fallback:`, article.image_url);
          setCoverUrl(article.image_url);
        } 
        // If no image is available, use a placeholder
        else {
          console.log(`[RhcaCard] No cover image available for article ${article.id}`);
          setCoverUrl(null);
        }
      } catch (error) {
        console.error('[RhcaCard] Error loading cover image:', error);
        setCoverUrl(null);
      } finally {
        setImageLoading(false);
      }
    };
    
    const loadPdfUrl = async () => {
      try {
        if (article.pdfFileName) {
          const { data } = await supabase.storage
            .from('rhca-pdfs')
            .getPublicUrl(article.pdfFileName);
            
          setPdfUrl(data.publicUrl);
        } else {
          setPdfUrl(null);
        }
      } catch (error) {
        console.error('[RhcaCard] Error loading PDF URL:', error);
        setPdfUrl(null);
      }
    };
    
    loadCoverImage();
    loadPdfUrl();
  }, [article]);
  
  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      
      // Track download count in analytics
      try {
        supabase.rpc('increment_count', { 
          table_name: 'articles', 
          column_name: 'downloads', 
          row_id: article.id 
        });
      } catch (error) {
        console.error('[RhcaCard] Error incrementing download count:', error);
      }
    } else {
      toast.error("Le PDF n'est pas disponible pour le moment");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract || "Découvrez cet article de la RHCA",
        url: window.location.href
      }).then(() => {
        // Track share count
        try {
          supabase.rpc('increment_count', { 
            table_name: 'articles', 
            column_name: 'shares', 
            row_id: article.id 
          });
        } catch (error) {
          console.error('[RhcaCard] Error incrementing share count:', error);
        }
      }).catch(error => {
        console.error('[RhcaCard] Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };
  
  const renderCoverImage = () => {
    return (
      <div className="relative w-full aspect-[4/3] rounded-t-md overflow-hidden bg-gray-100">
        <ImageOptimizer
          src={coverUrl || ''}
          alt={article.title}
          width={320}
          height={240}
          className="w-full h-full object-cover"
          fallbackText={article.title}
          loading={imageLoading}
        />
        
        <PdfStatusIndicator 
          available={!!pdfUrl} 
          className="absolute top-2 right-2" 
        />
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {renderCoverImage()}
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>
              {article.publication_date ? new Date(article.publication_date).toLocaleDateString('fr-FR') : 'Date non disponible'}
            </span>
          </div>
          
          <h3 className="font-semibold leading-tight line-clamp-2">{article.title}</h3>
          
          {article.abstract && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {article.abstract}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags && article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="px-2 py-0 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleDownload}
                disabled={!pdfUrl}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
