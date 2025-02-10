import * as React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { DiagnosticCase } from "./types";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

interface DiagnosticTableProps {
  cases: DiagnosticCase[];
}

export const DiagnosticTable: React.FC<DiagnosticTableProps> = ({ cases }) => {
  const handleShare = (id: string) => {
    navigator.clipboard.writeText(window.location.href + '#' + id);
    toast.success("Lien copié dans le presse-papier");
  };

  const formatDate = (dateStr: string) => {
    // Handle "À venir" case
    if (dateStr === "À venir") return dateStr;
    
    try {
      // Parse the date string from DD/MM/YY format
      const parsedDate = parse(dateStr, 'dd/MM/yy', new Date());
      return format(parsedDate, 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return dateStr; // Return original string if parsing fails
    }
  };

  return (
    <div className="space-y-3">
      {cases.map((item) => (
        <div 
          key={item.id}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-secondary/20"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-secondary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {item.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.date)}
                </span>
                <span className="text-gray-300">•</span>
                <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                  {item.specialty}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-secondary">{item.diagnosis}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-gray-600 hover:text-secondary"
                onClick={() => handleShare(item.id)}
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-gray-600 hover:text-secondary"
              >
                <FileText className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                className="h-8 gap-2"
              >
                <Eye className="h-3.5 w-3.5" />
                Voir
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
