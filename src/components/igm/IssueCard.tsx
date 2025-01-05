import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { IssueModal } from "./IssueModal";
import { toast } from "sonner";
import type { Issue } from "./types";

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
        className="hover:shadow-lg transition-shadow cursor-pointer group bg-white h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col sm:flex-row h-full">
          <div className="w-full sm:w-32 h-44 flex-shrink-0 relative overflow-hidden">
            {issue.coverImage ? (
              <img 
                src={issue.coverImage}
                alt={`Couverture ${issue.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No cover</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 sm:p-6 flex flex-col min-w-0">
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {issue.volume} - {issue.issue}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span className="truncate">
                    {format(new Date(issue.date), 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 line-clamp-2 break-words">
                {issue.abstract}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{issue.articleCount} articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{issue.downloads || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{issue.shares || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-ocean text-white hover:bg-ocean-hover flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-ocean text-white hover:bg-ocean-hover flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
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