import { Calendar, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface IssueCardProps {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  articleCount?: number;
  pdfUrl?: string;
}

export const IssueCard = ({ id, title, volume, issue, date, articleCount, pdfUrl }: IssueCardProps) => {
  const handleDownload = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    try {
      // Get the signed URL for the file
      const { data } = await supabase
        .storage
        .from('articles')
        .getPublicUrl(pdfUrl);

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = `${title}.pdf`; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Téléchargement démarré");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur inattendue s'est produite");
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow transform scale-90 origin-left">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-primary truncate">
              {title}
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="whitespace-nowrap">{volume} • {issue}</span>
              <span className="text-primary">|</span>
              <Calendar className="h-3 w-3" />
              <span>{new Date(date).toLocaleDateString()}</span>
              {articleCount && (
                <>
                  <span className="text-primary">|</span>
                  <span>{articleCount} articles</span>
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
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};