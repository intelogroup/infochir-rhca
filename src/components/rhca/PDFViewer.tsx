import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PDFViewerProps {
  pdfUrl: string | null;
  title: string;
}

export const PDFViewer = ({ pdfUrl, title }: PDFViewerProps) => {
  const handleView = async () => {
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }

    // If it's a storage URL, get the public URL
    if (pdfUrl.startsWith('articles/')) {
      const { data } = supabase.storage
        .from('articles')
        .getPublicUrl(pdfUrl);
      
      window.open(data.publicUrl, '_blank');
    } else {
      // If it's an external URL, open directly
      window.open(pdfUrl, '_blank');
    }
    
    toast.success("Ouverture du PDF...");
  };

  const handleDownload = async () => {
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }

    try {
      if (pdfUrl.startsWith('articles/')) {
        const { data, error } = await supabase.storage
          .from('articles')
          .download(pdfUrl);

        if (error) throw error;

        // Create a download link
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // For external URLs, open in new tab
        window.open(pdfUrl, '_blank');
      }

      toast.success("Téléchargement du PDF...");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleView}
        disabled={!pdfUrl}
        className="gap-2"
      >
        <Eye className="h-4 w-4" />
        Voir
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={!pdfUrl}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Télécharger
      </Button>
    </div>
  );
};