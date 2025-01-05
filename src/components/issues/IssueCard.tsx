import { Calendar, Download, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface IssueCardProps {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  abstract: string;
  description?: string;
  articleCount?: number;
  pdfUrl?: string;
  coverImage?: string;
}

export const IssueCard = ({ 
  id, 
  title, 
  volume, 
  issue, 
  date,
  abstract,
  description,
  articleCount, 
  pdfUrl,
  coverImage 
}: IssueCardProps) => {
  const handleDownload = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    window.open(pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/igm/issues/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <Card className="group hover:shadow-md transition-shadow h-full">
      <div className="flex gap-4 p-4 h-full">
        <div className="w-32 h-44 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={`Couverture ${title} ${volume} ${issue}`}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full bg-secondary/5 flex items-center justify-center absolute inset-0">
              <span className="text-secondary/20 text-xl font-bold">PDF</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <CardHeader className="p-0 flex-1">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl font-bold text-secondary truncate">
                  {title}
                </CardTitle>
                <div className="text-lg font-medium text-secondary/80 truncate">
                  {volume} • {issue}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                  {articleCount && (
                    <>
                      <span className="text-secondary">•</span>
                      <span className="truncate">{articleCount} articles</span>
                    </>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                    Édité par: {description}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {abstract}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleDownload}
                  disabled={!pdfUrl}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </div>
      </div>
    </Card>
  );
};