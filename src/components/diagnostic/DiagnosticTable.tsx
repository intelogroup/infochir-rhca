import { DiagnosticCase } from "./types";
import { Button } from "@/components/ui/button";
import { FileText, Share2 } from "lucide-react";
import { toast } from "sonner";

interface DiagnosticTableProps {
  cases: DiagnosticCase[];
}

export const DiagnosticTable = ({ cases }: DiagnosticTableProps) => {
  const handleShare = (id: string) => {
    navigator.clipboard.writeText(window.location.href + '#' + id);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <div className="space-y-4">
      {cases.map((item) => (
        <div 
          key={item.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-primary/20"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{item.specialty}</span>
                <span>•</span>
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.diagnosis}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
                onClick={() => handleShare(item.id)}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Partager
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
              >
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};