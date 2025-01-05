import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { IssueModal } from "./IssueModal";
import { toast } from "sonner";
import type { Issue } from "./types";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(issue.pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-shadow cursor-pointer bg-white h-full"
        onClick={() => setIsModalOpen(true)}
        role="article"
        aria-labelledby={`issue-title-${issue.id}`}
      >
        <div className="flex flex-col sm:flex-row h-full">
          <div className="w-full sm:w-28 lg:w-32 flex-shrink-0">
            <AspectRatio ratio={3/4} className="overflow-hidden">
              {issue.coverImage ? (
                <img 
                  src={issue.coverImage}
                  alt={`Couverture ${issue.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)]">No cover</span>
                </div>
              )}
            </AspectRatio>
          </div>
          
          <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col min-w-0">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1">
              <div>
                <h3 
                  id={`issue-title-${issue.id}`}
                  className="text-[clamp(1rem,0.95rem+0.25vw,1.25rem)] font-semibold text-gray-900 line-clamp-2"
                >
                  {issue.title}
                </h3>
                <p 
                  className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 truncate"
                  aria-label="Numéro de volume et d'édition"
                >
                  {issue.volume} - {issue.issue}
                </p>
                <div 
                  className="flex items-center gap-2 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] text-gray-500 mt-1 flex-wrap"
                  aria-label="Informations de publication"
                >
                  <span className="truncate">
                    {format(new Date(issue.date), 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              <p 
                className="text-[clamp(0.75rem,0.7rem+0.25vw,1rem)] text-gray-600 line-clamp-2 break-words"
                aria-label="Résumé de l'édition"
              >
                {issue.abstract}
              </p>

              <div 
                className="flex items-center gap-3 sm:gap-4 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] text-gray-500 flex-wrap"
                aria-label="Statistiques de l'édition"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{issue.articleCount} articles</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{issue.downloads || 0}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{issue.shares || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3 sm:mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 bg-ocean text-white hover:bg-ocean-hover flex-1 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] h-8 sm:h-9"
                onClick={handleShare}
                aria-label="Partager l'édition"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Partager
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 bg-ocean text-white hover:bg-ocean-hover flex-1 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] h-8 sm:h-9"
                onClick={handleDownload}
                aria-label={issue.pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <IssueModal
        issue={issue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};