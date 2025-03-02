
import { FileCheck, FileX, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PdfStatusIndicatorProps {
  status: "checking" | "available" | "unavailable";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PdfStatusIndicator = ({ 
  status,
  size = "md",
  className = ""
}: PdfStatusIndicatorProps) => {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];
  
  const messages = {
    checking: "Vérification de la disponibilité du PDF...",
    available: "PDF disponible pour téléchargement",
    unavailable: "PDF non disponible"
  };
  
  const icons = {
    checking: <Loader2 className={cn(`${sizeClass} animate-spin text-primary/60`, className)} />,
    available: <FileCheck className={cn(`${sizeClass} text-green-500`, className)} />,
    unavailable: <FileX className={cn(`${sizeClass} text-gray-300`, className)} />
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{icons[status]}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{messages[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
