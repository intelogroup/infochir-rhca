import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Download } from "lucide-react";
import { DiagnosticCase } from "./types";
import { toast } from "sonner";

interface DiagnosticCardProps {
  diagnosticCase: DiagnosticCase;
}

export const DiagnosticCard = ({ diagnosticCase }: DiagnosticCardProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + '#' + diagnosticCase.id);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.success("Le téléchargement va commencer...");
    // Placeholder for actual download functionality
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={diagnosticCase.imageUrl}
          alt={diagnosticCase.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="p-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xs font-medium line-clamp-2">{diagnosticCase.title}</CardTitle>
          <Badge variant="outline" className="text-[10px] whitespace-nowrap">
            {diagnosticCase.specialty}
          </Badge>
        </div>
        <CardDescription className="text-[10px]">{diagnosticCase.date}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-4">
        <p className="text-[10px] text-gray-600 mb-1 line-clamp-2">{diagnosticCase.description}</p>
        <p className="text-[10px] font-semibold">
          Status: <span className="text-primary">{diagnosticCase.diagnosis}</span>
        </p>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[10px]"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[10px]"
            onClick={handleShare}
          >
            <Share2 className="h-3 w-3 mr-1" />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};