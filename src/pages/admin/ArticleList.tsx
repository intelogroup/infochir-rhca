import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Search, Calendar, User } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ArticleItem {
  id: string;
  title: string;
  abstract: string;
  source: string;
  status: string;
  created_at: string;
  authors: string[];
  category: string;
  tags: string[];
  publication_date: string;
}

const ArticleList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_content')
        .select('id, title, abstract, source, status, created_at, authors, category, tags, publication_date')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ArticleItem[];
    }
  });

  const filteredArticles = articles?.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.authors || []).some(author => 
        author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesSource = selectedSource === "all" || article.source === selectedSource;
    
    return matchesSearch && matchesSource;
  }) || [];

  const handleEdit = (articleId: string) => {
    navigate(`/admin/articles/edit/${articleId}`);
  };

  const handleCreate = () => {
    navigate("/admin/articles/new");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Gestion des articles" 
          description="Gérer et modifier les articles existants"
        />
        <div className="flex justify-center py-12">
          <LoadingSpinner variant="default" size="lg" text="Chargement des articles..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Gestion des articles" 
          description="Gérer et modifier les articles existants"
        />
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Erreur lors du chargement des articles</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des articles" 
        description="Gérer et modifier les articles existants"
      />

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">Toutes les sources</option>
            <option value="RHCA">RHCA</option>
            <option value="IGM">IGM</option>
            <option value="ADC">ADC</option>
            <option value="INDEX">INDEX</option>
          </select>
        </div>

        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusBadgeVariant(article.status)}>
                      {article.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {article.source}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(article.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {article.abstract}
              </p>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">
                    {(article.authors || []).join(", ") || "Aucun auteur"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(article.publication_date || article.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {article.category && (
                  <div className="text-xs">
                    <span className="font-medium">Catégorie:</span> {article.category}
                  </div>
                )}
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{article.tags.length - 3} plus
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {searchTerm || selectedSource !== "all" 
                ? "Aucun article trouvé avec ces critères" 
                : "Aucun article disponible"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleList;