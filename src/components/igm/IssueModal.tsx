import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Share2, Tag, Calendar, BookOpen, Share } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import type { Issue } from "./types";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

export const IssueModal = ({ issue, isOpen, onClose }: IssueModalProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible pour ce numéro");
      return;
    }
    window.open(issue.pdfUrl, '_blank');
    toast.success("Téléchargement du PDF en cours...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">
              {issue.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {issue.description}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {issue.articleCount} articles
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {issue.downloads} téléchargements
                </div>
                <div className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  {issue.shares} partages
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Télécharger PDF
                </Button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-primary mb-4">Résumé</h3>
              <p className="text-gray-600">{issue.abstract}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Table des matières</h3>
              {issue.articles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {article.title}
                  </h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>Page {article.pageNumber}</span>
                    </div>
                    <div>
                      {article.authors.join(", ")}
                    </div>
                  </div>
                  {article.abstract && (
                    <p className="mt-2 text-sm text-gray-600">
                      {article.abstract}
                    </p>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};