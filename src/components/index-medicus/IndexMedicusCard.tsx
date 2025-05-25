
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "./types";
import { User, Calendar, Tag, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArticleModal } from "./article/ArticleModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface IndexMedicusCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isSelected?: boolean;
  hideImage?: boolean;
}

export const IndexMedicusCard: React.FC<IndexMedicusCardProps> = ({
  article,
  onTagClick,
  isSelected = false,
  hideImage = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
      })
    : "";

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    e.preventDefault();
    onTagClick && onTagClick(tag);
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on tags or action buttons
    if ((e.target as HTMLElement).closest('[data-tag]') || 
        (e.target as HTMLElement).closest('button')) {
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Generate direct PDF link
      const pdfLink = article.pdfUrl || article.pdf_url;
      let shareUrl = '';
      
      if (pdfLink && pdfLink.includes('supabase.co')) {
        // Use the direct PDF URL for sharing
        shareUrl = pdfLink;
      } else if (article.pdf_filename) {
        // Generate direct PDF URL using the filename
        shareUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/indexmedicuspdf/${article.pdf_filename}`;
      } else {
        // Fallback to article page
        shareUrl = `${window.location.origin}/index-medicus/articles/${article.id}`;
      }
      
      // Try native sharing first on mobile
      if (navigator.share && isMobile) {
        await navigator.share({
          title: article.title,
          text: `Découvrez "${article.title}" sur Index Medicus`,
          url: shareUrl
        });
        toast.success("Contenu partagé avec succès");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien PDF copié dans le presse-papier");
      }
      
      // Update share count
      if (article.id) {
        await supabase
          .from('articles')
          .update({ shares: (article.shares || 0) + 1 })
          .eq('id', article.id);
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Erreur lors du partage");
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const pdfUrl = article.pdfUrl || article.pdf_url;
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = article.pdf_filename || `${article.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update download count
      if (article.id) {
        await supabase
          .from('articles')
          .update({ downloads: (article.downloads || 0) + 1 })
          .eq('id', article.id);
      }
      
      toast.success("Téléchargement du PDF en cours...");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "h-full rounded-lg overflow-hidden",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
      >
        <Card
          className="h-full flex flex-col border-gray-200 hover:border-primary/30 cursor-pointer transition-all duration-200 overflow-hidden group"
          onClick={handleCardClick}
        >
          <CardContent className="flex-grow flex flex-col p-3 sm:p-4 space-y-3">
            {/* Title */}
            <h3 className="font-medium text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* Authors */}
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {article.authors?.join(", ") || "Unknown authors"}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span>{formattedDate || "Date inconnue"}</span>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center gap-1 mb-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-gray-50 hover:bg-gray-100 cursor-pointer px-2 py-0.5"
                      data-tag={tag}
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > (isMobile ? 2 : 3) && (
                    <Badge variant="outline" className="text-xs bg-gray-50 px-2 py-0.5">
                      +{article.tags.length - (isMobile ? 2 : 3)}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons - always visible on mobile */}
            <div className="flex gap-2 pt-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8 gap-1"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
                {isMobile ? "Partager" : "Partager PDF"}
              </Button>
              
              {(article.pdfUrl || article.pdf_url) && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 text-xs h-8 gap-1 bg-primary hover:bg-primary/90"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3" />
                  PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <ArticleModal 
        article={article}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
