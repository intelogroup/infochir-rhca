import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, FileText, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/components/index-medicus/types";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useScrollToTop();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("Article ID is required");
        }

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Article not found");
        }

        // Map to Article type
        const article: Article = {
          id: data.id,
          title: data.title,
          abstract: data.abstract,
          authors: Array.isArray(data.authors) ? data.authors : [],
          publicationDate: data.publication_date,
          date: data.publication_date || new Date().toISOString(),
          source: (data.source as ArticleSource) || "INDEX",
          tags: Array.isArray(data.tags) ? data.tags : [],
          views: data.views || 0,
          downloads: data.downloads || 0,
          shares: data.shares || 0,
          citations: data.citations || 0,
          pdfUrl: data.pdf_url,
          imageUrl: data.image_url,
          volume: data.volume,
          issue: data.issue,
          pageNumber: data.page_number,
          specialty: data.specialty,
          category: data.category
        };
        
        setArticle(article);
        
        // Update view count
        await supabase
          .from("articles")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", id);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err instanceof Error ? err.message : "Failed to load article");
        toast.error("Impossible de charger les détails de l'article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    } else {
      setError("ID d'article non valide");
      setLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownloadPdf = async () => {
    if (!article || !article.pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    try {
      window.open(article.pdfUrl, '_blank');
      
      // Log download action
      await supabase
        .from("articles")
        .update({ downloads: (article.downloads || 0) + 1 })
        .eq("id", article.id);
      
      toast.success("Téléchargement du PDF commencé");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleShare = () => {
    if (!article) return;
    
    const shareUrl = window.location.href;
    const shareTitle = article.title;
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        url: shareUrl,
      }).then(async () => {
        // Update share count in database
        await supabase
          .from("articles")
          .update({ shares: (article.shares || 0) + 1 })
          .eq("id", article.id);
      }).catch(error => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(shareUrl).then(async () => {
        toast.success("Lien copié dans le presse-papier");
        
        // Update share count in database
        await supabase
          .from("articles")
          .update({ shares: (article.shares || 0) + 1 })
          .eq("id", article.id);
      }).catch(error => {
        console.error("Error copying link:", error);
        toast.error("Erreur lors de la copie du lien");
      });
    }
  };

  const handleCite = () => {
    if (!article) return;
    
    // Create citation text in a common format
    const authors = Array.isArray(article.authors) ? article.authors.join(", ") : "";
    const year = article.publicationDate ? new Date(article.publicationDate).getFullYear() : "";
    const citation = `${authors} (${year}). ${article.title}. ${article.source || ''}${article.volume ? `, ${article.volume}` : ''}${article.issue ? `(${article.issue})` : ''}${article.pageNumber ? `, ${article.pageNumber}` : ''}.`;
    
    navigator.clipboard.writeText(citation).then(async () => {
      toast.success("Citation copiée dans le presse-papier");
      
      // Update citation count in database
      await supabase
        .from("articles")
        .update({ citations: (article.citations || 0) + 1 })
        .eq("id", article.id);
    }).catch(error => {
      console.error("Error copying citation:", error);
      toast.error("Erreur lors de la copie de la citation");
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {loading ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <LoadingSpinner size="md" text="Chargement de l'article..." />
          </div>
        ) : error ? (
          <div className="p-6 border border-destructive/20 bg-destructive/10 rounded-lg text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Retourner à l'accueil
            </Button>
          </div>
        ) : article ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {article.authors.map((author, index) => (
                <span 
                  key={index} 
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {author}
                </span>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Résumé</h2>
              <p className="text-gray-700 whitespace-pre-line">{article.abstract}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-500">Source</h3>
                <p>{article.source}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Date de publication</h3>
                <p>{formatDate(article.publicationDate)}</p>
              </div>
              {article.volume && article.issue && (
                <div>
                  <h3 className="font-medium text-gray-500">Volume/Issue</h3>
                  <p>{article.volume}, {article.issue}</p>
                </div>
              )}
              {article.pageNumber && (
                <div>
                  <h3 className="font-medium text-gray-500">Pages</h3>
                  <p>{article.pageNumber}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {article.category && (
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                  {article.category}
                </span>
              )}
              
              {article.tags && article.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-4">
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Partager
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCite}
                    className="flex items-center gap-2"
                  >
                    <Quote className="h-4 w-4" />
                    Citer
                  </Button>
                </div>
                
                {article.pdfUrl && (
                  <Button 
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Télécharger PDF
                  </Button>
                )}
              </div>
              
              <div className="flex justify-between mt-6 text-sm text-gray-500">
                <span>{article.views} vue{article.views !== 1 ? 's' : ''}</span>
                <span>{article.downloads} téléchargement{article.downloads !== 1 ? 's' : ''}</span>
                <span>{article.citations} citation{article.citations !== 1 ? 's' : ''}</span>
                <span>{article.shares} partage{article.shares !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ArticleDetail;
