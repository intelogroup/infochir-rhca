import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Share2, Tag, Calendar, BookOpen, Share, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import type { Issue } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

export const IssueModal = ({ issue, isOpen, onClose }: IssueModalProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      const { error } = await supabase
        .from('articles')
        .update({ shares: issue.shares + 1 })
        .eq('id', issue.id);

      if (error) throw error;
      
      toast.success("Lien copié dans le presse-papier", {
        className: "bg-secondary text-white",
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  const handleDownload = async () => {
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible pour ce numéro");
      return;
    }

    setIsDownloading(true);
    try {
      const { error } = await supabase
        .from('articles')
        .update({ downloads: issue.downloads + 1 })
        .eq('id', issue.id);

      if (error) throw error;

      window.open(issue.pdfUrl, '_blank');
      toast.success("Téléchargement du PDF en cours...", {
        className: "bg-secondary text-white",
      });
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
            <DialogHeader className="p-6 pb-0">
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DialogTitle className="text-[clamp(1.5rem,1.35rem+0.75vw,2rem)] font-bold text-primary leading-tight">
                  {issue.title}
                </DialogTitle>
              </motion.div>
              <DialogDescription className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 mt-2 leading-relaxed">
                {issue.abstract}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[80vh]">
              <motion.div 
                className="p-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-500 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/5 px-3 py-1 rounded-full">
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
                      className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] hover:bg-secondary/10 hover:text-secondary transition-colors"
                      onClick={handleShare}
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                      Partager
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] bg-secondary hover:bg-secondary-light transition-colors"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Télécharger PDF
                    </Button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-[clamp(1.125rem,1.075rem+0.25vw,1.25rem)] font-semibold text-primary mb-4">Résumé</h3>
                  <p className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 leading-relaxed">{issue.abstract}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[clamp(1.125rem,1.075rem+0.25vw,1.25rem)] font-semibold text-primary">Table des matières</h3>
                  {issue.articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] text-gray-900 mb-2">
                        {article.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>Page {article.pageNumber}</span>
                        </div>
                        <div>
                          {article.authors.join(", ")}
                        </div>
                      </div>
                      {article.abstract && (
                        <p className="mt-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 leading-relaxed">
                          {article.abstract}
                        </p>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {article.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium bg-primary/10 text-primary"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};