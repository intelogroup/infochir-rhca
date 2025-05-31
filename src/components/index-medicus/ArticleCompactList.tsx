
import React, { useState } from "react";
import { Article } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleCompactListProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <p className="text-sm text-gray-600">{text}</p>;
  }
  
  return (
    <div>
      <p className="text-sm text-gray-600">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <Button 
        variant="link" 
        size="sm" 
        className="p-0 h-auto font-medium text-primary" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Read more"}
      </Button>
    </div>
  );
};

export const ArticleCompactList: React.FC<ArticleCompactListProps> = ({ 
  articles, 
  onTagClick,
  selectedTags = []
}) => {
  const handleShare = async (article: Article) => {
    try {
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

  const handleDownload = async (article: Article) => {
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

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun article trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <Card key={article.id} className="p-3 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-semibold text-base leading-tight mb-1 text-primary line-clamp-2">
                {article.title}
              </h3>
              
              <div className="flex flex-col gap-1 mb-2">
                <div className="text-xs text-gray-600 flex items-center">
                  <span className="font-medium mr-2">Auteurs:</span>
                  <ExpandableText 
                    text={article.authors?.join(", ") || "Unknown authors"} 
                    maxLength={40}
                  />
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Date:</span>
                  <span>
                    {article.date ? new Date(article.date).getFullYear() : "Date inconnue"}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="font-medium">Source:</span>
                  <span className="truncate max-w-[150px]">{article.source || "Unknown"}</span>
                </div>
              </div>
              
              {article.abstract && (
                <div className="mt-1 mb-2">
                  <ExpandableText text={article.abstract} maxLength={80} />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {article.tags?.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={`text-xs hover:bg-primary/10 cursor-pointer truncate max-w-[100px] ${
                    selectedTags?.includes(tag) ? "bg-primary/20" : "bg-muted"
                  }`}
                  onClick={() => onTagClick && onTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {(article.tags?.length || 0) > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-muted cursor-pointer"
                >
                  +{(article.tags?.length || 0) - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8 gap-1"
                onClick={() => handleShare(article)}
              >
                <Share2 className="h-3 w-3" />
                Partager
              </Button>
              
              {(article.pdfUrl || article.pdf_url) && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 text-xs h-8 gap-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleDownload(article)}
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
};
