import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  volume?: string;
  issue?: string;
  date: string;
  abstract: string;
  pdfUrl?: string;
  articleCount?: number;
}

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
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the articles into the Issue format
      const transformedArticles = articles.map(article => ({
        id: article.id,
        title: article.title,
        volume: "Volume " + (new Date(article.date).getFullYear() - 1999), // Example volume calculation
        issue: "Issue " + (new Date(article.date).getMonth() + 1),
        date: new Date(article.date).toISOString(),
        abstract: article.abstract,
        pdfUrl: article.pdf_url,
        articleCount: 1 // This could be updated if we want to group articles
      }));

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

  const handleDownload = async (issue: Issue) => {
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('articles')
        .download(issue.pdfUrl);
        
      if (error) throw error;
      
      // Create a download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${issue.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Téléchargement démarré");
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error("Erreur lors du téléchargement");
    }
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
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher des volumes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Plus récents</SelectItem>
            <SelectItem value="year">Année</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-2">
            <h2 className="text-lg font-bold text-primary">{year}</h2>
            <div className="grid gap-2">
              {issuesByYear[year].map((issue) => (
                <Card 
                  key={issue.id} 
                  className="group hover:shadow-md transition-shadow transform scale-90 origin-left"
                >
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium text-primary truncate">
                          {issue.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="whitespace-nowrap">{issue.volume} • {issue.issue}</span>
                          <span className="text-primary">|</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(issue.date).toLocaleDateString()}</span>
                          {issue.articleCount && (
                            <>
                              <span className="text-primary">|</span>
                              <span>{issue.articleCount} articles</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleDownload(issue)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};