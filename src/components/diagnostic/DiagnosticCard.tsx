import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Download } from "lucide-react";
import { DiagnosticCase } from "./types";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface DiagnosticCardProps {
  diagnosticCase: DiagnosticCase;
}

export const DiagnosticCard = ({ diagnosticCase }: DiagnosticCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      }
    );

    if (observer) {
      observer.observe(document.getElementById(`card-${diagnosticCase.id}`) as Element);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [diagnosticCase.id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + '#' + diagnosticCase.id);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.success("Le téléchargement va commencer...");
  };

  return (
    <Card 
      id={`card-${diagnosticCase.id}`}
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-200/50 hover:border-primary/20"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        {isInView && (
          <img
            src={diagnosticCase.imageUrl}
            alt={diagnosticCase.title}
            className={`object-cover w-full h-full transition-all duration-500 ${
              imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {diagnosticCase.title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-primary text-[10px] whitespace-nowrap backdrop-blur-sm"
          >
            {diagnosticCase.specialty}
          </Badge>
        </div>
        <CardDescription className="text-[10px]">{diagnosticCase.date}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <p className="text-[10px] text-gray-600 mb-1 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {diagnosticCase.description}
        </p>
        <p className="text-[10px] font-semibold">
          Status: <span className="text-primary">{diagnosticCase.diagnosis}</span>
        </p>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[10px] hover:bg-primary hover:text-white transition-all duration-300"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[10px] hover:bg-primary hover:text-white transition-all duration-300"
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