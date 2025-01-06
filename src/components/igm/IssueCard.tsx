import { Calendar, Download, Eye, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Issue } from "./types";
import { motion } from "framer-motion";
import { useState } from "react";
import { IssueModal } from "./IssueModal";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    setIsDownloading(true);
    try {
      window.open(issue.pdfUrl, '_blank');
      toast.success("Ouverture du PDF...", {
        className: "bg-secondary text-white",
      });
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier", {
        className: "bg-secondary text-white",
      });
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
      >
        <Card 
          className="group hover:shadow-md transition-all duration-300 cursor-pointer h-full transform hover:-translate-y-1 bg-white/95 backdrop-blur-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex gap-4 p-4 sm:p-5">
            <div className="w-20 sm:w-24 flex-shrink-0">
              <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg bg-muted/10">
                {issue.coverImage ? (
                  <div className="relative w-full h-full">
                    <div 
                      className={cn(
                        "absolute inset-0 bg-muted/20 backdrop-blur-[2px] transition-opacity duration-300",
                        imageLoaded ? "opacity-0" : "opacity-100"
                      )}
                    />
                    <img 
                      src={issue.coverImage} 
                      alt={`Couverture ${issue.title}`}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                    <span className="text-secondary/20 text-xl font-bold">PDF</span>
                  </div>
                )}
              </AspectRatio>
            </div>
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-primary leading-tight tracking-tight truncate group-hover:text-primary-light transition-colors">
                    {issue.title}
                  </h3>
                  <div className="text-sm font-medium text-secondary/80 mt-1">
                    {issue.volume} • {issue.issue}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors relative"
                          onClick={handleShare}
                          disabled={isSharing}
                        >
                          {isSharing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Partager</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          onClick={handleDownload}
                          disabled={!issue.pdfUrl || isDownloading}
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger PDF</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voir les détails</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {issue.abstract}
              </p>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                <span className="bg-secondary/5 px-2 py-1 rounded-full">
                  {issue.articleCount} articles
                </span>
                <span>{issue.downloads} téléchargements</span>
                <span>{issue.shares} partages</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <IssueModal 
        issue={issue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};