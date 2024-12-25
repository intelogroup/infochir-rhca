import { Calendar, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

type IssueCardProps = Pick<Article, 'id' | 'title' | 'volume' | 'issue_number' | 'date' | 'article_count' | 'pdf_url'>;

export const IssueCard = ({ id, title, volume, issue_number, date, article_count, pdf_url }: IssueCardProps) => {
  const handleDownload = async () => {
    if (!pdf_url) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    try {
      // If it's a storage URL, get the public URL
      if (pdf_url.startsWith('articles/')) {
        const { data } = supabase.storage
          .from('articles')
          .getPublicUrl(pdf_url);
        
        window.open(data.publicUrl, '_blank');
      } else {
        // If it's an external URL, open directly
        window.open(pdf_url, '_blank');
      }
      
      toast.success("Téléchargement du PDF...");
    } catch (error) {
      console.error('Error downloading PDF:', error);
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
              <span className="whitespace-nowrap">
                {volume} • Issue {issue_number}
              </span>
              <span className="text-primary">|</span>
              <Calendar className="h-3 w-3" />
              <span>{new Date(date).toLocaleDateString()}</span>
              {article_count && (
                <>
                  <span className="text-primary">|</span>
                  <span>{article_count} articles</span>
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
              disabled={!pdf_url}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};