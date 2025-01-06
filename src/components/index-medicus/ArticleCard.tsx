import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Article } from "./types";
import { ArticleTags } from "./article/ArticleTags";
import { ArticleCategories } from "./article/ArticleCategories";
import { ArticleMetadata } from "./article/ArticleMetadata";
import { ArticleActions } from "./article/ArticleActions";
import { toast } from "@/hooks/use-toast";

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleCard = ({ article, onTagClick, selectedTags }: ArticleCardProps) => {
  const generateCitation = (format: 'APA' | 'MLA' | 'Chicago' | 'Harvard') => {
    const year = new Date(article.date).getFullYear();
    const authors = article.authors.join(", ");
    let citation = '';

    switch (format) {
      case 'APA':
        citation = `${authors} (${year}). ${article.title}. ${article.source}, ${article.category}. DOI: ${article.id}`;
        break;
      case 'MLA':
        citation = `${authors}. "${article.title}." ${article.source}, ${year}.`;
        break;
      case 'Chicago':
        citation = `${authors}. "${article.title}." ${article.source} (${year}).`;
        break;
      case 'Harvard':
        citation = `${authors} ${year}, '${article.title}', ${article.source}, ${article.category}.`;
        break;
      default:
        citation = `${authors} (${year}). ${article.title}`;
    }

    navigator.clipboard.writeText(citation);
    toast({
      title: "Citation copiée",
      description: `Format ${format} copié dans le presse-papier`
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + '#' + article.id);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans le presse-papier"
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden group rounded-3xl">
      <div className="flex flex-col md:flex-row">
        {article.imageUrl ? (
          <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
            <User className="h-12 w-12 text-primary/20" />
          </div>
        )}
        <div className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <ArticleMetadata 
                  authors={article.authors}
                  date={article.date}
                  views={article.views}
                  citations={article.citations}
                />
              </div>
              <ArticleCategories 
                source={article.source}
                category={article.category}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.abstract}
            </p>
            <div className="mb-4">
              <ArticleTags 
                tags={article.tags}
                onTagClick={onTagClick}
                selectedTags={selectedTags}
              />
            </div>
            <ArticleActions 
              title={article.title}
              pdfUrl={article.pdfUrl}
              onCitation={generateCitation}
              onShare={handleShare}
            />
          </CardContent>
        </div>
      </div>
    </Card>
  );
};