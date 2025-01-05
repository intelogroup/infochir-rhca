import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Quote, Download, Share2, Copy } from "lucide-react";
import { Article } from "./types";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const handleDownload = () => {
    if (article.pdfUrl) {
      const link = document.createElement('a');
      link.href = article.pdfUrl;
      link.setAttribute('download', `${article.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Le téléchargement va commencer...");
    } else {
      toast.error("Le PDF n'est pas disponible pour cet article");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + '#' + article.id);
    toast.success("Lien copié dans le presse-papier");
  };

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
    toast.success(`Citation format ${format} copiée dans le presse-papier`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden group scale-[0.7] origin-top rounded-3xl">
      <div className="flex flex-col md:flex-row">
        {article.imageUrl ? (
          <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                  <User className="h-4 w-4" />
                  {article.authors.join(", ")}
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4" />
                  {new Date(article.date).toLocaleDateString()}
                  {article.views && (
                    <>
                      <span className="mx-2">•</span>
                      <Eye className="h-4 w-4" />
                      {article.views} vues
                    </>
                  )}
                  {article.citations && (
                    <>
                      <span className="mx-2">•</span>
                      <Quote className="h-4 w-4" />
                      {article.citations} citations
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{article.source}</Badge>
                <Badge variant="outline">{article.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.abstract}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-primary/5 text-primary hover:bg-primary/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Télécharger PDF
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier la citation
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateCitation('APA')}>
                    Format APA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateCitation('MLA')}>
                    Format MLA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateCitation('Chicago')}>
                    Format Chicago
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateCitation('Harvard')}>
                    Format Harvard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  </>;