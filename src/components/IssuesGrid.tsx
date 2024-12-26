import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchAndSort } from "./issues/SearchAndSort";
import { YearGroup } from "./issues/YearGroup";
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

      const { data: articles, error } = await supabase
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

      if (error) {
        console.error('Error fetching articles:', error);
        toast.error("Erreur lors du chargement des articles");
        return;
      }

      // Transform the articles into the Issue format
      const transformedArticles = articles.map(article => {
        // Find matching PDF file from storage
        const pdfFile = storageFiles?.find(file => 
          file.name.toLowerCase().includes(article.title.toLowerCase().replace(/\s+/g, '-'))
        );

        return {
          id: article.id,
          title: article.title,
          volume: article.category?.name ? `Volume ${article.category.name}` : undefined,
          issue: `Issue ${new Date(article.date).getMonth() + 1}`,
          date: new Date(article.date).toISOString(),
          abstract: article.abstract,
          pdfUrl: pdfFile ? `${supabase.storage.from('articles').getPublicUrl(pdfFile.name).data.publicUrl}` : article.pdf_url,
          articleCount: 1,
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
      issue.abstract.toLowerCase().includes(value.toLowerCase())
    );
    sortIssues(filtered, sortBy);
  };

  const sortIssues = (issues: Issue[], sortType: string) => {
    let sorted = [...issues];
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
      default:
        break;
    }
    setFilteredIssues(sorted);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    sortIssues(filteredIssues, value);
  };

  // Group issues by year
  const issuesByYear = filteredIssues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

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

      <div className="space-y-4">
        {sortedYears.map((year) => (
          <YearGroup 
            key={year}
            year={year}
            issues={issuesByYear[year]}
          />
        ))}
      </div>
    </div>
  );
};