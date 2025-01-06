import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import type { Article } from "./types";

export const ArticleTable = ({ articles }: { articles: Article[] }) => {
  const handleShare = (articleId: string) => {
    const shareUrl = `${window.location.origin}/index-medicus/articles/${articleId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = (pdfUrl?: string) => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[400px]">Titre</TableHead>
            <TableHead>Année</TableHead>
            <TableHead>Auteurs</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <div className="font-medium text-primary hover:text-primary-light cursor-pointer">
                      {article.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {article.abstract}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getYear(article.date)}
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">
                  {article.authors.join(", ")}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`
                    font-semibold
                    ${article.source === 'RHCA' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${article.source === 'IGM' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    ${article.source === 'ADC' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                  `}
                >
                  {article.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {article.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-muted">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(article.id)}
                    className="hover:bg-muted"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(article.pdfUrl)}
                    className="hover:bg-muted"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/index-medicus/articles/${article.id}`, '_blank')}
                    className="hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};