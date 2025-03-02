
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
  
  const colors = {
    checking: "text-ocean-light animate-pulse",
    available: "text-green-500",
    unavailable: "text-gray-300"
  };
  
  const icons = {
    checking: <Loader2 className={cn(`${sizeClass} animate-spin text-ocean`, className)} />,
    available: <FileCheck className={cn(`${sizeClass} ${colors.available}`, className)} />,
    unavailable: <FileX className={cn(`${sizeClass} ${colors.unavailable}`, className)} />
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{icons[status]}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-white border border-gray-200 shadow-md">
          <p className={cn("text-sm", colors[status])}>{messages[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
