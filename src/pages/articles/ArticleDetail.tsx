
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArticleActions } from "@/components/index-medicus/article/ArticleActions";
import { Article } from "@/components/index-medicus/types";
import { toast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";

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
        // Mock API call - replace with actual API in production
        // In a real app, you would fetch the article from an API
        console.log(`Fetching article with ID: ${id}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, create a mock article
        const mockArticle: Article = {
          id: id || "0",
          title: "Article détaillé",
          authors: ["Dr. Exemple Auteur", "Dr. Autre Auteur"],
          abstract: "Résumé détaillé de l'article qui serait normalement chargé à partir d'une API.",
          date: new Date().toISOString(),
          publicationDate: new Date().toISOString(),
          source: "RHCA",
          tags: ["chirurgie", "innovation"],
          category: "Recherche",
          specialty: "Clinique",
          pdfUrl: "#",
          status: "published",
          imageUrl: "",
          coverImage: "",
          views: 0,
          citations: 0,
          downloads: 0,
          shares: 0
        };
        
        setArticle(mockArticle);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Impossible de charger les détails de l'article");
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'article",
          variant: "destructive",
        });
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
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement de l'article...</p>
          </div>
        ) : error ? (
          <div className="p-6 border border-destructive/20 bg-destructive/10 rounded-lg text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate("/index-medicus")}
            >
              Retourner à l'index
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
              <p className="text-gray-700">{article.abstract}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-500">Source</h3>
                <p>{article.source}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Date de publication</h3>
                <p>{new Date(article.publicationDate).toLocaleDateString()}</p>
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
              
              {article.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-4">
              <ArticleActions 
                title={article.title}
                pdfUrl={article.pdfUrl}
                article={article}
              />
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ArticleDetail;
