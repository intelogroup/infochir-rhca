
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { RhcaArticle } from "@/components/rhca/types";
import { getStorageUrl } from "@/integrations/supabase/client";
import { ArticleActions } from "@/components/rhca/article/ArticleActions";

const RhcaArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useScrollToTop();
  
  const [article, setArticle] = useState<RhcaArticle | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("ID de l'article manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch article from Supabase
        const { data, error } = await supabase
          .from("rhca_articles_view")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error("Article introuvable");
        }
        
        // Map to RhcaArticle type
        const article: RhcaArticle = {
          id: data.id,
          title: data.title,
          abstract: data.abstract,
          authors: Array.isArray(data.authors) ? data.authors : [],
          pdfFileName: data.pdf_filename,
          coverImageFileName: data.cover_image_filename,
          publicationDate: data.publication_date,
          volume: data.volume,
          issue: data.issue,
          pageNumber: data.page_number,
          category: data.category,
          status: data.status === 'published' ? "published" : (data.status === 'pending' ? "pending" : "draft"),
          views: data.views || 0,
          downloads: data.downloads || 0,
          // Add the missing required properties
          date: data.publication_date || new Date().toISOString(),
          source: data.source || "RHCA",
          tags: Array.isArray(data.tags) ? data.tags : [],
          // Include optional properties if they exist in data
          imageUrl: data.image_url,
          shares: data.shares || 0,
          specialty: data.specialty
        };
        
        setArticle(article);
        
        // Get PDF URL if available
        if (article.pdfFileName) {
          const url = getStorageUrl('rhca-pdfs', article.pdfFileName);
          setPdfUrl(url);
          
          // Open PDF directly
          if (url) {
            window.open(url, '_blank');
            
            // Go back to articles list after opening PDF
            navigate('/rhca');
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'article");
        toast.error("Impossible de charger les détails de l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate('/rhca');
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
          Retour à la liste des articles
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
              onClick={handleGoBack}
            >
              Retourner à la liste des articles
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
            
            {article.abstract && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Résumé</h2>
                <p className="text-gray-700 whitespace-pre-line">{article.abstract}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {article.volume && (
                <div>
                  <h3 className="font-medium text-gray-500">Volume</h3>
                  <p>{article.volume}</p>
                </div>
              )}
              {article.issue && (
                <div>
                  <h3 className="font-medium text-gray-500">Numéro</h3>
                  <p>{article.issue}</p>
                </div>
              )}
              {article.publicationDate && (
                <div>
                  <h3 className="font-medium text-gray-500">Date de publication</h3>
                  <p>{new Date(article.publicationDate).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
              {article.pageNumber && (
                <div>
                  <h3 className="font-medium text-gray-500">Pages</h3>
                  <p>{article.pageNumber}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="mr-4">{article.views || 0} vue{article.views !== 1 ? 's' : ''}</span>
                  <span>{article.downloads || 0} téléchargement{article.downloads !== 1 ? 's' : ''}</span>
                </div>
                
                {pdfUrl && article.pdfFileName && article.date && (
                  <ArticleActions
                    id={article.id}
                    pdfFileName={article.pdfFileName}
                    date={article.date}
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default RhcaArticleDetail;
