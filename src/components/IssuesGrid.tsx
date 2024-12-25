import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchAndSort } from "./issues/SearchAndSort";
import { IssuesList } from "./issues/IssuesList";
import type { Issue } from "./issues/types";

export const IssuesGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // First, list all files in the articles bucket
      const { data: storageFiles, error: storageError } = await supabase
        .storage
        .from('articles')
        .list();

      if (storageError) {
        console.error('Error fetching storage files:', storageError);
        toast.error("Erreur lors du chargement des fichiers");
        return;
      }

      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(name),
          article_authors(
            author:authors(name)
          ),
          article_tags(
            tag:tags(name)
          )
        `)
        .order('date', { ascending: false });

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
        toast.error("Erreur lors du chargement des articles");
        return;
      }

      if (!articles) {
        console.error('No articles found');
        toast.error("Aucun article trouvé");
        return;
      }

      // Transform the articles into the Issue format with improved PDF matching
      const transformedArticles = articles.map(article => {
        // Find matching PDF file from storage using a more robust matching
        const pdfFile = storageFiles?.find(file => {
          const normalizedFileName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normalizedFileName.includes(normalizedTitle);
        });

        return {
          id: article.id,
          title: article.title,
          volume: article.category?.name ? `Volume ${article.category.name}` : undefined,
          issue: `Issue ${new Date(article.date).getMonth() + 1}`,
          date: new Date(article.date).toISOString(),
          abstract: article.abstract,
          pdfUrl: pdfFile 
            ? `${supabase.storage.from('articles').getPublicUrl(pdfFile.name).data.publicUrl}` 
            : article.pdf_url,
          articleCount: article.article_count ?? 1,
          authors: article.article_authors?.map((aa: any) => aa.author.name) || [],
          tags: article.article_tags?.map((at: any) => at.tag.name) || []
        };
      });

      console.log('Transformed articles:', transformedArticles);
      setFilteredIssues(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = filteredIssues.filter(issue =>
      issue.title.toLowerCase().includes(value.toLowerCase()) ||
      issue.abstract?.toLowerCase().includes(value.toLowerCase()) ||
      issue.authors.some(author => 
        author.toLowerCase().includes(value.toLowerCase())
      ) ||
      issue.tags.some(tag => 
        tag.toLowerCase().includes(value.toLowerCase())
      )
    );
    sortIssues(filtered, sortBy);
  };

  const sortIssues = (issues: Issue[], sortType: string) => {
    const sorted = [...issues];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "year":
        sorted.sort((a, b) => 
          new Date(b.date).getFullYear() - new Date(a.date).getFullYear()
        );
        break;
      case "month":
        sorted.sort((a, b) => 
          new Date(b.date).getMonth() - new Date(a.date).getMonth()
        );
        break;
    }
    setFilteredIssues(sorted);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    sortIssues(filteredIssues, value);
  };

  if (isLoading) {
    return <div className="p-4">Chargement des articles...</div>;
  }

  return (
    <div className="space-y-4 px-4">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <IssuesList issues={filteredIssues} />
    </div>
  );
};