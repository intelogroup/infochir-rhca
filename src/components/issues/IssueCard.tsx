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
      // First check if the file exists and validate its content type
      const { data: fileExists } = await supabase.storage
        .from('articles')
        .list('', {
          search: pdfUrl
        });

      if (!fileExists || fileExists.length === 0) {
        toast.error("Le fichier PDF n'existe pas");
        return;
      }

      // Check if the file is actually a PDF by its content type
      const file = fileExists[0];
      if (!file.metadata?.mimetype?.includes('pdf')) {
        toast.error("Le fichier n'est pas un PDF valide");
        console.error('Invalid file type:', file.metadata?.mimetype);
        return;
      }

      const { data, error } = await supabase.storage
        .from('articles')
        .download(pdfUrl);
        
      if (error) {
        console.error('Error downloading file:', error);
        toast.error("Erreur lors du téléchargement du fichier");
        return;
      }
      
      // Additional validation of the downloaded data
      if (!(data instanceof Blob) || data.size === 0) {
        toast.error("Le fichier PDF est corrompu ou vide");
        console.error('Invalid PDF data:', data);
        return;
      }

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Téléchargement démarré");
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error("Erreur lors du téléchargement");
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
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};