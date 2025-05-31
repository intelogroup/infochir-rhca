
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeader as ArticleTableHeader } from "./table/TableHeader";
import { ArticleTableRow } from "./table/TableRow";
import { Article } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./table/TableActions";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleTableProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  onTagClick,
  selectedTags = [],
}) => {
  const isMobile = useIsMobile();
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun article trouvé.</p>
      </div>
    );
  }

  const handleMobileShare = async (article: Article) => {
    try {
      // Generate direct PDF link for sharing
      const pdfLink = article.pdfUrl || article.pdf_url;
      let shareUrl = '';
      
      if (pdfLink && pdfLink.includes('supabase.co')) {
        shareUrl = pdfLink;
      } else if (article.pdf_filename) {
        shareUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/indexmedicuspdf/${article.pdf_filename}`;
      } else {
        shareUrl = `${window.location.origin}/index-medicus/articles/${article.id}`;
      }
      
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: `PDF: "${article.title}"`,
          url: shareUrl
        });
        toast.success("Contenu partagé avec succès");
      } else {
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

  const handleMobileDownload = async (article: Article) => {
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

  // Mobile view uses card layout for better readability
  if (isMobile) {
    return (
      <div className="space-y-3">
        {articles.map((article) => (
          <Card key={article.id} className="p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-medium text-primary mb-1 line-clamp-2 text-sm leading-tight">
                  {article.title}
                </h3>
                {article.authors?.length > 0 && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {article.authors?.join(", ")}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {article.tags?.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`text-xs truncate max-w-[100px] cursor-pointer ${
                      selectedTags?.includes(tag) ? "bg-primary/20" : "bg-muted hover:bg-primary/10"
                    }`}
                    onClick={() => onTagClick && onTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {(article.tags?.length || 0) > 3 && (
                  <Badge variant="outline" className="text-xs bg-muted">
                    +{(article.tags?.length || 0) - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 gap-1"
                  onClick={() => handleMobileShare(article)}
                >
                  <Share2 className="h-3 w-3" />
                  Partager
                </Button>
                
                {(article.pdfUrl || article.pdf_url) && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs h-8 gap-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleMobileDownload(article)}
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop view uses a proper table with all columns
  return (
    <div className="rounded-md border">
      <TableContainer>
        <Table>
          <ArticleTableHeader />
          <TableBody>
            {articles.map((article) => (
              <ArticleTableRow 
                key={article.id}
                article={article}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
